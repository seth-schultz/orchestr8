/**
 * Statistics Collector
 *
 * Centralized statistics collection and broadcasting for the MCP server.
 * Used by both stdio and HTTP transports to track server metrics.
 */

import type { TokenMetrics } from '../token/metrics.js';

export interface ActivityEvent {
  type: string;
  timestamp: number;
  data?: any;
}

export interface StatsSnapshot {
  uptime: number;
  requests: {
    total: number;
    byMethod: Record<string, number>;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: string;
  };
  latency: {
    p50: number;
    p95: number;
    p99: number;
    avg: number;
  };
  errors: number;
  memory: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
  lastActivity: number;
  tokens?: {
    efficiency: number;
    tokensSaved: number;
    totalCost: number;
    recentSavings: number;
    totalActualTokens: number;
    totalBaselineTokens: number;
  };
}

export type StatsSubscriber = (snapshot: StatsSnapshot) => void;
export type ActivitySubscriber = (event: ActivityEvent) => void;

export class StatsCollector {
  private startTime: number;
  private stats = {
    requests: {
      total: 0,
      byMethod: {} as Record<string, number>
    },
    cache: {
      hits: 0,
      misses: 0
    },
    latencies: [] as number[],
    errors: 0,
    lastActivity: Date.now()
  };

  private activityLog: ActivityEvent[] = [];
  private subscribers = new Set<StatsSubscriber>();
  private activitySubscribers = new Set<ActivitySubscriber>();
  private readonly maxLatencies = 100;
  private readonly maxActivityLog = 1000;

  // Token metrics integration
  private tokenMetrics: TokenMetrics | null = null;

  constructor(tokenMetrics?: TokenMetrics) {
    this.startTime = Date.now();
    this.tokenMetrics = tokenMetrics || null;
  }

  /**
   * Track a request to the MCP server
   */
  trackRequest(method: string, latencyMs: number, params?: any): void {
    this.stats.requests.total++;
    this.stats.requests.byMethod[method] =
      (this.stats.requests.byMethod[method] || 0) + 1;

    this.stats.latencies.push(latencyMs);
    if (this.stats.latencies.length > this.maxLatencies) {
      this.stats.latencies.shift();
    }

    this.stats.lastActivity = Date.now();

    // Log activity
    this.logActivity('mcp_request', {
      method,
      latency: latencyMs,
      params
    });

    this.notifySubscribers();
  }

  /**
   * Track a cache hit
   */
  trackCacheHit(): void {
    this.stats.cache.hits++;
    this.notifySubscribers();
  }

  /**
   * Track a cache miss
   */
  trackCacheMiss(): void {
    this.stats.cache.misses++;
    this.notifySubscribers();
  }

  /**
   * Track an error
   */
  trackError(errorData?: any): void {
    this.stats.errors++;
    this.stats.lastActivity = Date.now();

    // Log activity
    this.logActivity('error', errorData);

    this.notifySubscribers();
  }

  /**
   * Log an activity event
   */
  logActivity(type: string, data?: any): void {
    const event: ActivityEvent = {
      type,
      timestamp: Date.now(),
      data
    };

    this.activityLog.push(event);

    // Keep only the last N activities
    if (this.activityLog.length > this.maxActivityLog) {
      this.activityLog.shift();
    }

    // Notify activity subscribers
    this.notifyActivitySubscribers(event);
  }

  /**
   * Get activity log
   */
  getActivityLog(limit?: number): ActivityEvent[] {
    if (limit) {
      return this.activityLog.slice(-limit);
    }
    return [...this.activityLog];
  }

  /**
   * Get current statistics snapshot
   */
  async getSnapshot(): Promise<StatsSnapshot> {
    const latencies = [...this.stats.latencies].sort((a, b) => a - b);
    const memUsage = process.memoryUsage();

    const snapshot: StatsSnapshot = {
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      requests: {
        total: this.stats.requests.total,
        byMethod: { ...this.stats.requests.byMethod }
      },
      cache: {
        hits: this.stats.cache.hits,
        misses: this.stats.cache.misses,
        hitRate: this.calculateHitRate()
      },
      latency: {
        p50: this.calculatePercentile(latencies, 0.5),
        p95: this.calculatePercentile(latencies, 0.95),
        p99: this.calculatePercentile(latencies, 0.99),
        avg: this.calculateAverage(latencies)
      },
      errors: this.stats.errors,
      memory: {
        heapUsed: memUsage.heapUsed, // Bytes (UI will format)
        heapTotal: memUsage.heapTotal, // Bytes
        external: memUsage.external, // Bytes
        rss: memUsage.rss // Bytes
      },
      lastActivity: this.stats.lastActivity
    };

    // Add token metrics if available
    if (this.tokenMetrics) {
      try {
        const tokenSummary = this.tokenMetrics.getSummary({ period: 'last_hour' });
        snapshot.tokens = {
          efficiency: tokenSummary.efficiency,
          tokensSaved: tokenSummary.tokensSaved,
          totalCost: tokenSummary.costUSD,
          recentSavings: tokenSummary.tokensSaved,
          totalActualTokens: tokenSummary.totalTokens,
          totalBaselineTokens: tokenSummary.totalTokens + tokenSummary.tokensSaved,
        };
      } catch (error) {
        // Token metrics not available yet, skip
      }
    }

    return snapshot;
  }

  /**
   * Subscribe to statistics updates
   * Returns an unsubscribe function
   */
  subscribe(callback: StatsSubscriber): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Subscribe to activity events
   * Returns an unsubscribe function
   */
  subscribeToActivity(callback: ActivitySubscriber): () => void {
    this.activitySubscribers.add(callback);
    return () => {
      this.activitySubscribers.delete(callback);
    };
  }

  /**
   * Get number of active subscribers
   */
  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  /**
   * Get number of active activity subscribers
   */
  getActivitySubscriberCount(): number {
    return this.activitySubscribers.size;
  }

  /**
   * Reset statistics (useful for testing)
   */
  reset(): void {
    this.startTime = Date.now();
    this.stats = {
      requests: {
        total: 0,
        byMethod: {}
      },
      cache: {
        hits: 0,
        misses: 0
      },
      latencies: [],
      errors: 0,
      lastActivity: Date.now()
    };
    this.activityLog = [];
    this.notifySubscribers();
  }

  /**
   * Notify all subscribers of stats update
   */
  private async notifySubscribers(): Promise<void> {
    if (this.subscribers.size === 0) {
      return;
    }

    const snapshot = await this.getSnapshot();
    this.subscribers.forEach(callback => {
      try {
        callback(snapshot);
      } catch (error) {
        console.error('[StatsCollector] Error in subscriber callback:', error);
      }
    });
  }

  /**
   * Notify all activity subscribers of new activity
   */
  private notifyActivitySubscribers(event: ActivityEvent): void {
    if (this.activitySubscribers.size === 0) {
      return;
    }

    this.activitySubscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('[StatsCollector] Error in activity subscriber callback:', error);
      }
    });
  }

  /**
   * Calculate cache hit rate
   */
  private calculateHitRate(): string {
    const total = this.stats.cache.hits + this.stats.cache.misses;
    if (total === 0) {
      return '0.0';
    }
    return ((this.stats.cache.hits / total) * 100).toFixed(1);
  }

  /**
   * Calculate percentile from sorted array
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    if (sortedValues.length === 0) {
      return 0;
    }
    const index = Math.floor(sortedValues.length * percentile);
    return sortedValues[index] || 0;
  }

  /**
   * Calculate average from array
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.floor(sum / values.length);
  }
}
