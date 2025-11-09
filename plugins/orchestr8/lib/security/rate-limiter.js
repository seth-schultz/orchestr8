/**
 * Rate Limiter for Orchestr8 Parallel Agent Execution
 *
 * Prevents API rate limiting from Claude API by controlling:
 * - Maximum concurrent agent executions
 * - Requests per minute throttling
 * - Priority queue for critical operations
 * - Exponential backoff on rate limit errors
 *
 * @module rate-limiter
 */

class RateLimiter {
  /**
   * Create a new RateLimiter
   *
   * @param {Object} options - Rate limiter configuration
   * @param {number} [options.maxConcurrent=5] - Max concurrent operations
   * @param {number} [options.maxPerMinute=100] - Max requests per minute
   * @param {number} [options.maxPerHour=1000] - Max requests per hour
   * @param {boolean} [options.enableBackoff=true] - Enable exponential backoff
   */
  constructor(options = {}) {
    this.maxConcurrent = options.maxConcurrent || 5;
    this.maxPerMinute = options.maxPerMinute || 100;
    this.maxPerHour = options.maxPerHour || 1000;
    this.enableBackoff = options.enableBackoff !== false;

    // Token buckets for rate limiting
    this.minuteTokens = this.maxPerMinute;
    this.hourTokens = this.maxPerHour;

    // Track active operations
    this.activeOperations = 0;
    this.queue = [];

    // Track request timestamps for sliding window
    this.requestTimestamps = [];

    // Backoff state
    this.backoffLevel = 0;
    this.maxBackoffLevel = 5;

    // Start token refill timers
    this.startTokenRefill();
  }

  /**
   * Start token bucket refill timers
   */
  startTokenRefill() {
    // Refill minute tokens every minute
    this.minuteRefillInterval = setInterval(() => {
      this.minuteTokens = this.maxPerMinute;
      this.processQueue();
    }, 60000);

    // Refill hour tokens every hour
    this.hourRefillInterval = setInterval(() => {
      this.hourTokens = this.maxPerHour;
      this.processQueue();
    }, 3600000);

    // Gradual token refill (smoother than all-at-once)
    this.gradualRefillInterval = setInterval(() => {
      if (this.minuteTokens < this.maxPerMinute) {
        this.minuteTokens = Math.min(
          this.minuteTokens + Math.ceil(this.maxPerMinute / 60),
          this.maxPerMinute
        );
      }
      if (this.hourTokens < this.maxPerHour) {
        this.hourTokens = Math.min(
          this.hourTokens + Math.ceil(this.maxPerHour / 3600),
          this.maxPerHour
        );
      }
      this.processQueue();
    }, 1000);
  }

  /**
   * Stop the rate limiter and clear timers
   */
  stop() {
    clearInterval(this.minuteRefillInterval);
    clearInterval(this.hourRefillInterval);
    clearInterval(this.gradualRefillInterval);
  }

  /**
   * Execute an operation with rate limiting
   *
   * @param {Function} operation - Async function to execute
   * @param {Object} [options] - Execution options
   * @param {number} [options.priority=0] - Priority (higher = more important)
   * @param {string} [options.id] - Operation ID for tracking
   * @param {number} [options.timeout] - Max wait time in ms
   * @returns {Promise<any>} - Operation result
   */
  async execute(operation, options = {}) {
    const {
      priority = 0,
      id = this.generateId(),
      timeout = 300000 // 5 minutes default
    } = options;

    return new Promise((resolve, reject) => {
      const item = {
        operation,
        priority,
        id,
        resolve,
        reject,
        addedAt: Date.now(),
        timeout
      };

      // Add to priority queue
      this.enqueue(item);

      // Try to process immediately
      this.processQueue();
    });
  }

  /**
   * Add item to priority queue
   *
   * @param {Object} item - Queue item
   */
  enqueue(item) {
    // Insert based on priority (higher priority first)
    let inserted = false;
    for (let i = 0; i < this.queue.length; i++) {
      if (item.priority > this.queue[i].priority) {
        this.queue.splice(i, 0, item);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      this.queue.push(item);
    }
  }

  /**
   * Process queued operations
   */
  async processQueue() {
    // Remove timed-out items
    const now = Date.now();
    this.queue = this.queue.filter(item => {
      if (now - item.addedAt > item.timeout) {
        item.reject(new Error(`Operation ${item.id} timed out after ${item.timeout}ms`));
        return false;
      }
      return true;
    });

    // Process while we have capacity and tokens
    while (
      this.queue.length > 0 &&
      this.activeOperations < this.maxConcurrent &&
      this.minuteTokens > 0 &&
      this.hourTokens > 0
    ) {
      const item = this.queue.shift();
      this.executeItem(item);
    }
  }

  /**
   * Execute a single queued item
   *
   * @param {Object} item - Queue item
   */
  async executeItem(item) {
    // Consume tokens
    this.minuteTokens--;
    this.hourTokens--;
    this.activeOperations++;

    // Track request timestamp
    this.requestTimestamps.push(Date.now());

    // Clean old timestamps (keep last hour)
    const oneHourAgo = Date.now() - 3600000;
    this.requestTimestamps = this.requestTimestamps.filter(ts => ts > oneHourAgo);

    try {
      // Apply backoff delay if needed
      if (this.backoffLevel > 0) {
        const delay = this.getBackoffDelay();
        await this.sleep(delay);
      }

      // Execute operation
      const result = await item.operation();

      // Success - reduce backoff
      if (this.backoffLevel > 0) {
        this.backoffLevel = Math.max(0, this.backoffLevel - 1);
      }

      item.resolve(result);
    } catch (error) {
      // Check if it's a rate limit error
      if (this.isRateLimitError(error)) {
        // Increase backoff
        if (this.enableBackoff) {
          this.backoffLevel = Math.min(this.maxBackoffLevel, this.backoffLevel + 1);
        }

        // Re-queue with higher priority
        item.priority += 10;
        this.enqueue(item);
      } else {
        // Other error - reject
        item.reject(error);
      }
    } finally {
      this.activeOperations--;

      // Try to process more items
      this.processQueue();
    }
  }

  /**
   * Check if error is a rate limit error
   *
   * @param {Error} error - Error to check
   * @returns {boolean} - True if rate limit error
   */
  isRateLimitError(error) {
    if (!error) return false;

    const message = error.message || '';
    const status = error.status || error.statusCode;

    return (
      status === 429 ||
      message.includes('rate limit') ||
      message.includes('too many requests') ||
      message.includes('quota exceeded')
    );
  }

  /**
   * Get backoff delay based on current level
   *
   * @returns {number} - Delay in milliseconds
   */
  getBackoffDelay() {
    // Exponential backoff: 2^level * 1000ms
    // Level 0: 0ms
    // Level 1: 2s
    // Level 2: 4s
    // Level 3: 8s
    // Level 4: 16s
    // Level 5: 32s
    return Math.pow(2, this.backoffLevel) * 1000;
  }

  /**
   * Sleep for specified duration
   *
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate a unique operation ID
   *
   * @returns {string} - Unique ID
   */
  generateId() {
    return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current rate limiter status
   *
   * @returns {Object} - Status information
   */
  getStatus() {
    return {
      activeOperations: this.activeOperations,
      queuedOperations: this.queue.length,
      minuteTokensRemaining: this.minuteTokens,
      hourTokensRemaining: this.hourTokens,
      backoffLevel: this.backoffLevel,
      backoffDelay: this.getBackoffDelay(),
      requestsLastMinute: this.getRequestsInWindow(60000),
      requestsLastHour: this.requestTimestamps.length
    };
  }

  /**
   * Get number of requests in a time window
   *
   * @param {number} windowMs - Time window in milliseconds
   * @returns {number} - Number of requests
   */
  getRequestsInWindow(windowMs) {
    const cutoff = Date.now() - windowMs;
    return this.requestTimestamps.filter(ts => ts > cutoff).length;
  }

  /**
   * Wait for capacity to become available
   *
   * @param {number} [timeoutMs=30000] - Max wait time
   * @returns {Promise<void>}
   */
  async waitForCapacity(timeoutMs = 30000) {
    const start = Date.now();

    while (
      (this.activeOperations >= this.maxConcurrent ||
       this.minuteTokens <= 0 ||
       this.hourTokens <= 0) &&
      Date.now() - start < timeoutMs
    ) {
      await this.sleep(100);
    }

    if (this.activeOperations >= this.maxConcurrent ||
        this.minuteTokens <= 0 ||
        this.hourTokens <= 0) {
      throw new Error('Timeout waiting for rate limiter capacity');
    }
  }

  /**
   * Reset the rate limiter state
   */
  reset() {
    this.minuteTokens = this.maxPerMinute;
    this.hourTokens = this.maxPerHour;
    this.backoffLevel = 0;
    this.requestTimestamps = [];
  }
}

/**
 * Global rate limiter instance for Orchestr8
 */
let globalRateLimiter = null;

/**
 * Get or create the global rate limiter
 *
 * @param {Object} [options] - Rate limiter options
 * @returns {RateLimiter} - Global rate limiter instance
 */
function getGlobalRateLimiter(options) {
  if (!globalRateLimiter) {
    globalRateLimiter = new RateLimiter(options);
  }
  return globalRateLimiter;
}

/**
 * Execute an operation with global rate limiting
 *
 * @param {Function} operation - Async function to execute
 * @param {Object} [options] - Execution options
 * @returns {Promise<any>} - Operation result
 */
async function executeRateLimited(operation, options = {}) {
  const limiter = getGlobalRateLimiter();
  return limiter.execute(operation, options);
}

module.exports = {
  RateLimiter,
  getGlobalRateLimiter,
  executeRateLimited
};
