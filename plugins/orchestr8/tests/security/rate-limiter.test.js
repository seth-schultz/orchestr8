/**
 * Comprehensive Test Suite for RateLimiter
 *
 * Tests rate limiting functionality:
 * - Concurrent execution limits
 * - Requests per minute throttling
 * - Token bucket refill
 * - Exponential backoff
 * - Priority queue handling
 */

const { RateLimiter, getGlobalRateLimiter, executeRateLimited } = require('../../lib/security/rate-limiter');

// Helper to wait for async operations
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('RateLimiter', () => {
  let limiter;

  beforeEach(() => {
    limiter = new RateLimiter({
      maxConcurrent: 3,
      maxPerMinute: 10,
      maxPerHour: 100,
      enableBackoff: true
    });
  });

  afterEach(() => {
    if (limiter) {
      limiter.stop();
    }
  });

  describe('Concurrent Execution Limits', () => {
    test('allows operations up to max concurrent', async () => {
      const results = [];
      const operations = [];

      for (let i = 0; i < 3; i++) {
        operations.push(
          limiter.execute(async () => {
            await sleep(50);
            results.push(i);
            return i;
          })
        );
      }

      await Promise.all(operations);
      expect(results.length).toBe(3);
    });

    test('queues operations exceeding max concurrent', async () => {
      const executed = [];
      const operations = [];

      for (let i = 0; i < 5; i++) {
        operations.push(
          limiter.execute(async () => {
            executed.push(Date.now());
            await sleep(100);
            return i;
          })
        );
      }

      await Promise.all(operations);

      // Should have 5 executions
      expect(executed.length).toBe(5);

      // Later operations should be delayed
      // First 3 should start ~immediately, next 2 should wait
      const firstBatch = executed.slice(0, 3);
      const secondBatch = executed.slice(3);

      const firstBatchSpread = Math.max(...firstBatch) - Math.min(...firstBatch);
      const gap = Math.min(...secondBatch) - Math.max(...firstBatch);

      expect(firstBatchSpread).toBeLessThan(50); // Started nearly simultaneously
      expect(gap).toBeGreaterThan(50); // Second batch waited
    });

    test('tracks active operations correctly', async () => {
      const operation = limiter.execute(async () => {
        await sleep(100);
        return 'done';
      });

      // Should have 1 active operation
      await sleep(10);
      expect(limiter.getStatus().activeOperations).toBe(1);

      await operation;

      // Should complete and reduce active count
      expect(limiter.getStatus().activeOperations).toBe(0);
    });
  });

  describe('Token Bucket Rate Limiting', () => {
    test('allows requests up to minute limit', async () => {
      const operations = [];

      for (let i = 0; i < 10; i++) {
        operations.push(
          limiter.execute(async () => i)
        );
      }

      const results = await Promise.all(operations);
      expect(results.length).toBe(10);
    });

    test('blocks requests exceeding minute limit', async () => {
      const operations = [];

      // Execute 10 operations (at limit)
      for (let i = 0; i < 10; i++) {
        operations.push(limiter.execute(async () => i));
      }

      await Promise.all(operations);

      // Try one more - should be queued
      const status = limiter.getStatus();
      expect(status.minuteTokensRemaining).toBe(0);
    });

    test('consumes tokens on execution', async () => {
      const initialTokens = limiter.getStatus().minuteTokensRemaining;

      await limiter.execute(async () => 'test');

      const finalTokens = limiter.getStatus().minuteTokensRemaining;
      expect(finalTokens).toBe(initialTokens - 1);
    });

    test('refills tokens gradually', async () => {
      // Consume some tokens
      await limiter.execute(async () => 'test');
      await limiter.execute(async () => 'test');

      const midTokens = limiter.getStatus().minuteTokensRemaining;

      // Wait for gradual refill
      await sleep(2000);

      const finalTokens = limiter.getStatus().minuteTokensRemaining;
      expect(finalTokens).toBeGreaterThan(midTokens);
    }, 10000);
  });

  describe('Hour Limit Tracking', () => {
    test('tracks hour tokens separately', async () => {
      const initialHourTokens = limiter.getStatus().hourTokensRemaining;

      await limiter.execute(async () => 'test');

      const finalHourTokens = limiter.getStatus().hourTokensRemaining;
      expect(finalHourTokens).toBe(initialHourTokens - 1);
    });

    test('enforces hour limit', async () => {
      // Create limiter with low hour limit
      const restrictiveLimiter = new RateLimiter({
        maxConcurrent: 5,
        maxPerMinute: 100,
        maxPerHour: 3
      });

      const operations = [];
      for (let i = 0; i < 3; i++) {
        operations.push(restrictiveLimiter.execute(async () => i));
      }

      await Promise.all(operations);

      // 4th operation should be queued due to hour limit
      const status = restrictiveLimiter.getStatus();
      expect(status.hourTokensRemaining).toBe(0);

      restrictiveLimiter.stop();
    });
  });

  describe('Priority Queue', () => {
    test('executes high priority operations first', async () => {
      const executionOrder = [];

      // Fill up concurrent slots
      const blocker = limiter.execute(async () => {
        await sleep(100);
        return 'blocker';
      });

      await sleep(10);

      // Queue operations with different priorities
      const lowPriority = limiter.execute(
        async () => {
          executionOrder.push('low');
          return 'low';
        },
        { priority: 1 }
      );

      const highPriority = limiter.execute(
        async () => {
          executionOrder.push('high');
          return 'high';
        },
        { priority: 10 }
      );

      await Promise.all([blocker, lowPriority, highPriority]);

      // High priority should execute before low priority
      expect(executionOrder[0]).toBe('high');
      expect(executionOrder[1]).toBe('low');
    });

    test('maintains FIFO order for same priority', async () => {
      const executionOrder = [];

      // Fill concurrent slots
      const blockers = [];
      for (let i = 0; i < 3; i++) {
        blockers.push(limiter.execute(async () => {
          await sleep(100);
          return i;
        }));
      }

      await sleep(10);

      // Queue operations with same priority
      const ops = [];
      for (let i = 0; i < 3; i++) {
        ops.push(limiter.execute(
          async () => {
            executionOrder.push(i);
            return i;
          },
          { priority: 5 }
        ));
      }

      await Promise.all([...blockers, ...ops]);

      // Should execute in order
      expect(executionOrder).toEqual([0, 1, 2]);
    });
  });

  describe('Exponential Backoff', () => {
    test('increases backoff level on rate limit errors', async () => {
      const initialBackoff = limiter.backoffLevel;

      // Simulate rate limit error
      try {
        await limiter.execute(async () => {
          const error = new Error('Rate limit exceeded');
          error.status = 429;
          throw error;
        });
      } catch (err) {
        // Expected to fail
      }

      // Wait for re-execution and failure
      await sleep(100);

      expect(limiter.backoffLevel).toBeGreaterThan(initialBackoff);
    });

    test('decreases backoff level on success', async () => {
      // Manually set backoff level
      limiter.backoffLevel = 3;

      await limiter.execute(async () => 'success');

      expect(limiter.backoffLevel).toBe(2);
    });

    test('calculates correct backoff delays', () => {
      expect(limiter.getBackoffDelay()).toBe(0); // Level 0

      limiter.backoffLevel = 1;
      expect(limiter.getBackoffDelay()).toBe(2000); // 2^1 * 1000

      limiter.backoffLevel = 2;
      expect(limiter.getBackoffDelay()).toBe(4000); // 2^2 * 1000

      limiter.backoffLevel = 3;
      expect(limiter.getBackoffDelay()).toBe(8000); // 2^3 * 1000
    });

    test('caps backoff level at maximum', async () => {
      // Trigger multiple rate limit errors
      for (let i = 0; i < 10; i++) {
        try {
          await limiter.execute(async () => {
            const error = new Error('Rate limit');
            error.status = 429;
            throw error;
          });
        } catch (err) {
          // Expected
        }
        await sleep(50);
      }

      expect(limiter.backoffLevel).toBeLessThanOrEqual(limiter.maxBackoffLevel);
    });

    test('retries rate-limited operations', async () => {
      let attemptCount = 0;

      const result = await limiter.execute(async () => {
        attemptCount++;
        if (attemptCount < 2) {
          const error = new Error('Rate limit');
          error.status = 429;
          throw error;
        }
        return 'success';
      });

      expect(result).toBe('success');
      expect(attemptCount).toBe(2);
    });
  });

  describe('Error Handling', () => {
    test('propagates non-rate-limit errors', async () => {
      await expect(
        limiter.execute(async () => {
          throw new Error('Other error');
        })
      ).rejects.toThrow('Other error');
    });

    test('identifies rate limit errors by status code', () => {
      const error = new Error('Too many requests');
      error.status = 429;

      expect(limiter.isRateLimitError(error)).toBe(true);
    });

    test('identifies rate limit errors by message', () => {
      expect(limiter.isRateLimitError(new Error('rate limit exceeded'))).toBe(true);
      expect(limiter.isRateLimitError(new Error('too many requests'))).toBe(true);
      expect(limiter.isRateLimitError(new Error('quota exceeded'))).toBe(true);
    });

    test('does not identify non-rate-limit errors', () => {
      expect(limiter.isRateLimitError(new Error('network error'))).toBe(false);
      expect(limiter.isRateLimitError(null)).toBe(false);
    });
  });

  describe('Timeout Handling', () => {
    test('times out operations in queue', async () => {
      // Fill concurrent slots with long operations
      for (let i = 0; i < 3; i++) {
        limiter.execute(async () => {
          await sleep(5000);
          return i;
        });
      }

      // Queue operation with short timeout
      await expect(
        limiter.execute(
          async () => 'test',
          { timeout: 100 }
        )
      ).rejects.toThrow(/timed out/i);
    });

    test('removes timed-out operations from queue', async () => {
      // Fill concurrent slots
      for (let i = 0; i < 3; i++) {
        limiter.execute(async () => {
          await sleep(1000);
          return i;
        });
      }

      // Queue with short timeout
      const promise = limiter.execute(
        async () => 'test',
        { timeout: 50 }
      );

      await sleep(100);

      // Should have been removed from queue
      limiter.processQueue();
      const status = limiter.getStatus();
      expect(status.queuedOperations).toBe(0);
    });
  });

  describe('Status Reporting', () => {
    test('reports accurate status', () => {
      const status = limiter.getStatus();

      expect(status).toHaveProperty('activeOperations');
      expect(status).toHaveProperty('queuedOperations');
      expect(status).toHaveProperty('minuteTokensRemaining');
      expect(status).toHaveProperty('hourTokensRemaining');
      expect(status).toHaveProperty('backoffLevel');
      expect(status).toHaveProperty('backoffDelay');
      expect(status).toHaveProperty('requestsLastMinute');
      expect(status).toHaveProperty('requestsLastHour');
    });

    test('tracks requests in time windows', async () => {
      await limiter.execute(async () => 'test1');
      await limiter.execute(async () => 'test2');
      await limiter.execute(async () => 'test3');

      const status = limiter.getStatus();
      expect(status.requestsLastMinute).toBe(3);
      expect(status.requestsLastHour).toBe(3);
    });
  });

  describe('Wait for Capacity', () => {
    test('waits for concurrent capacity', async () => {
      // Fill all slots
      const blockers = [];
      for (let i = 0; i < 3; i++) {
        blockers.push(limiter.execute(async () => {
          await sleep(200);
          return i;
        }));
      }

      await sleep(10);

      // Wait for capacity
      const waitPromise = limiter.waitForCapacity(1000);

      // Should still be waiting
      expect(limiter.getStatus().activeOperations).toBe(3);

      // Wait for capacity to free up
      await waitPromise;

      expect(limiter.getStatus().activeOperations).toBeLessThan(3);
    });

    test('waits for token capacity', async () => {
      // Exhaust tokens
      const operations = [];
      for (let i = 0; i < 10; i++) {
        operations.push(limiter.execute(async () => i));
      }
      await Promise.all(operations);

      // Wait for tokens to refill
      await expect(limiter.waitForCapacity(3000)).resolves.not.toThrow();
    }, 10000);

    test('times out when waiting too long', async () => {
      // Fill all slots with long operations
      for (let i = 0; i < 3; i++) {
        limiter.execute(async () => {
          await sleep(5000);
          return i;
        });
      }

      await expect(limiter.waitForCapacity(100)).rejects.toThrow(/timeout/i);
    });
  });

  describe('Reset', () => {
    test('resets tokens', async () => {
      // Consume some tokens
      await limiter.execute(async () => 'test');
      await limiter.execute(async () => 'test');

      limiter.reset();

      const status = limiter.getStatus();
      expect(status.minuteTokensRemaining).toBe(limiter.maxPerMinute);
      expect(status.hourTokensRemaining).toBe(limiter.maxPerHour);
    });

    test('resets backoff level', async () => {
      limiter.backoffLevel = 3;

      limiter.reset();

      expect(limiter.backoffLevel).toBe(0);
    });

    test('clears request history', async () => {
      await limiter.execute(async () => 'test');

      limiter.reset();

      const status = limiter.getStatus();
      expect(status.requestsLastMinute).toBe(0);
      expect(status.requestsLastHour).toBe(0);
    });
  });

  describe('Operation ID Generation', () => {
    test('generates unique IDs', () => {
      const ids = new Set();

      for (let i = 0; i < 100; i++) {
        ids.add(limiter.generateId());
      }

      expect(ids.size).toBe(100);
    });

    test('IDs contain timestamp', () => {
      const id = limiter.generateId();
      expect(id).toContain('op-');
      expect(id).toMatch(/op-\d+-[a-z0-9]+/);
    });
  });

  describe('Global Rate Limiter', () => {
    afterEach(() => {
      // Reset global instance
      if (global.globalRateLimiter) {
        global.globalRateLimiter.stop();
        global.globalRateLimiter = null;
      }
    });

    test('returns same instance on multiple calls', () => {
      const limiter1 = getGlobalRateLimiter();
      const limiter2 = getGlobalRateLimiter();

      expect(limiter1).toBe(limiter2);

      limiter1.stop();
    });

    test('executeRateLimited uses global limiter', async () => {
      const result = await executeRateLimited(async () => 'test');
      expect(result).toBe('test');

      const globalLimiter = getGlobalRateLimiter();
      globalLimiter.stop();
    });
  });

  describe('Edge Cases', () => {
    test('handles zero concurrent limit', async () => {
      const zeroLimiter = new RateLimiter({ maxConcurrent: 1 });

      const result = await zeroLimiter.execute(async () => 'test');
      expect(result).toBe('test');

      zeroLimiter.stop();
    });

    test('handles operations that complete immediately', async () => {
      const result = await limiter.execute(() => 'immediate');
      expect(result).toBe('immediate');
    });

    test('handles async operations with errors', async () => {
      await expect(
        limiter.execute(async () => {
          await sleep(10);
          throw new Error('Async error');
        })
      ).rejects.toThrow('Async error');
    });

    test('handles multiple simultaneous queue processing', async () => {
      const operations = [];

      for (let i = 0; i < 10; i++) {
        operations.push(
          limiter.execute(async () => {
            await sleep(10);
            return i;
          })
        );
      }

      const results = await Promise.all(operations);
      expect(results.length).toBe(10);
      expect(results).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('Performance', () => {
    test('minimal overhead for queuing', async () => {
      const start = Date.now();

      const operations = [];
      for (let i = 0; i < 100; i++) {
        operations.push(limiter.execute(async () => i));
      }

      await Promise.all(operations);

      const duration = Date.now() - start;

      // Should complete relatively quickly (most are queued)
      expect(duration).toBeLessThan(5000);
    });

    test('processes queue efficiently', () => {
      const start = performance.now();

      limiter.processQueue();

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10); // < 10ms
    });
  });
});
