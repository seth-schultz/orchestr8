/*!
 * LRU cache for query results with TTL support
 */

use lru::LruCache;
use serde_json::Value;
use std::num::NonZeroUsize;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

/// Cache entry with TTL
#[derive(Clone)]
struct CacheEntry {
    value: Value,
    inserted_at: Instant,
    ttl: Duration,
}

impl CacheEntry {
    fn new(value: Value, ttl: Duration) -> Self {
        Self {
            value,
            inserted_at: Instant::now(),
            ttl,
        }
    }

    fn is_expired(&self) -> bool {
        self.inserted_at.elapsed() > self.ttl
    }
}

/// Cache statistics
#[derive(Debug, Clone, Default)]
pub struct CacheStats {
    pub hits: u64,
    pub misses: u64,
    pub size: usize,
}

impl CacheStats {
    pub fn hit_rate(&self) -> f64 {
        let total = self.hits + self.misses;
        if total == 0 {
            0.0
        } else {
            self.hits as f64 / total as f64
        }
    }
}

/// Thread-safe LRU cache with TTL
#[derive(Clone)]
pub struct QueryCache {
    cache: Arc<Mutex<LruCache<String, CacheEntry>>>,
    stats: Arc<Mutex<CacheStats>>,
    default_ttl: Duration,
}

impl QueryCache {
    /// Create new cache with max size and default TTL
    pub fn new(max_size: usize, ttl_seconds: u64) -> Self {
        let cache_size = NonZeroUsize::new(max_size).expect("Cache size must be non-zero");

        Self {
            cache: Arc::new(Mutex::new(LruCache::new(cache_size))),
            stats: Arc::new(Mutex::new(CacheStats::default())),
            default_ttl: Duration::from_secs(ttl_seconds),
        }
    }

    /// Get value from cache (returns None if expired or not found)
    pub fn get(&self, key: &str) -> Option<Value> {
        let mut cache = self.cache.lock().unwrap();
        let mut stats = self.stats.lock().unwrap();

        if let Some(entry) = cache.get(key) {
            if entry.is_expired() {
                // Remove expired entry
                cache.pop(key);
                stats.misses += 1;
                stats.size = cache.len();
                None
            } else {
                stats.hits += 1;
                Some(entry.value.clone())
            }
        } else {
            stats.misses += 1;
            None
        }
    }

    /// Put value in cache with default TTL
    pub fn put(&self, key: String, value: Value) {
        self.put_with_ttl(key, value, self.default_ttl);
    }

    /// Put value in cache with custom TTL
    pub fn put_with_ttl(&self, key: String, value: Value, ttl: Duration) {
        let mut cache = self.cache.lock().unwrap();
        let mut stats = self.stats.lock().unwrap();

        let entry = CacheEntry::new(value, ttl);
        cache.put(key, entry);
        stats.size = cache.len();
    }

    /// Clear all cache entries
    pub fn clear(&self) {
        let mut cache = self.cache.lock().unwrap();
        let mut stats = self.stats.lock().unwrap();

        cache.clear();
        stats.size = 0;
    }

    /// Get cache statistics
    pub fn stats(&self) -> CacheStats {
        let stats = self.stats.lock().unwrap();
        stats.clone()
    }

    /// Remove expired entries (called periodically)
    pub fn cleanup_expired(&self) {
        let mut cache = self.cache.lock().unwrap();
        let mut stats = self.stats.lock().unwrap();

        let keys_to_remove: Vec<String> = cache
            .iter()
            .filter_map(|(k, v)| {
                if v.is_expired() {
                    Some(k.clone())
                } else {
                    None
                }
            })
            .collect();

        for key in keys_to_remove {
            cache.pop(&key);
        }

        stats.size = cache.len();
    }

    /// Get current cache size
    pub fn len(&self) -> usize {
        let cache = self.cache.lock().unwrap();
        cache.len()
    }

    /// Check if cache is empty
    pub fn is_empty(&self) -> bool {
        self.len() == 0
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    use std::thread::sleep;

    #[test]
    fn test_cache_basic() {
        let cache = QueryCache::new(100, 300);

        // Put and get
        cache.put("key1".to_string(), json!({"result": "value1"}));
        let value = cache.get("key1");
        assert!(value.is_some());
        assert_eq!(value.unwrap()["result"], "value1");

        // Cache hit
        let stats = cache.stats();
        assert_eq!(stats.hits, 1);
        assert_eq!(stats.misses, 0);
    }

    #[test]
    fn test_cache_miss() {
        let cache = QueryCache::new(100, 300);

        // Get non-existent key
        let value = cache.get("nonexistent");
        assert!(value.is_none());

        // Cache miss
        let stats = cache.stats();
        assert_eq!(stats.hits, 0);
        assert_eq!(stats.misses, 1);
    }

    #[test]
    fn test_cache_expiration() {
        let cache = QueryCache::new(100, 1); // 1 second TTL

        cache.put("key1".to_string(), json!({"result": "value1"}));

        // Immediate get should work
        assert!(cache.get("key1").is_some());

        // Wait for expiration
        sleep(Duration::from_secs(2));

        // Should be expired
        assert!(cache.get("key1").is_none());
    }

    #[test]
    fn test_cache_clear() {
        let cache = QueryCache::new(100, 300);

        cache.put("key1".to_string(), json!({"result": "value1"}));
        cache.put("key2".to_string(), json!({"result": "value2"}));

        assert_eq!(cache.len(), 2);

        cache.clear();

        assert_eq!(cache.len(), 0);
        assert!(cache.is_empty());
    }

    #[test]
    fn test_cache_lru_eviction() {
        let cache = QueryCache::new(2, 300); // Max 2 entries

        cache.put("key1".to_string(), json!({"result": "value1"}));
        cache.put("key2".to_string(), json!({"result": "value2"}));
        cache.put("key3".to_string(), json!({"result": "value3"}));

        // key1 should be evicted
        assert!(cache.get("key1").is_none());
        assert!(cache.get("key2").is_some());
        assert!(cache.get("key3").is_some());
    }

    #[test]
    fn test_hit_rate() {
        let cache = QueryCache::new(100, 300);

        cache.put("key1".to_string(), json!({"result": "value1"}));

        // 2 hits, 1 miss
        cache.get("key1");
        cache.get("key1");
        cache.get("key2");

        let stats = cache.stats();
        assert_eq!(stats.hits, 2);
        assert_eq!(stats.misses, 1);
        assert!((stats.hit_rate() - 0.666).abs() < 0.01);
    }
}
