import { createHash } from 'crypto';

// 使用全局变量来存储 RateLimitStore 实例
// 这样即使在开发模式下热重载，数据也不会丢失
if (!global.rateLimitStore) {
  class RateLimitStore {
    constructor() {
      this.store = new Map();
      this.dailyLimit = 5;
      // 每小时清理一次过期数据
      setInterval(() => this.cleanup(), 1000 * 60 * 60);
    }

    getKey(ip) {
      const date = new Date().toISOString().split('T')[0];
      return `${ip}-${date}`;
    }

    increment(ip) {
      const key = this.getKey(ip);
      const current = this.store.get(key) || {
        count: 0,
        firstRequest: Date.now(),
        lastRequest: Date.now()
      };

      current.count += 1;
      current.lastRequest = Date.now();
      this.store.set(key, current);
      
      return current;
    }

    getRemainingLimit(ip) {
      const key = this.getKey(ip);
      const current = this.store.get(key);
      if (!current) return this.dailyLimit;
      return Math.max(0, this.dailyLimit - current.count);
    }

    cleanup() {
      const today = new Date().toISOString().split('T')[0];
      for (const [key] of this.store) {
        if (!key.endsWith(today)) {
          this.store.delete(key);
        }
      }
    }

    // 获取用户限制状态的详细信息
    getLimitStatus(ip) {
      const key = this.getKey(ip);
      const current = this.store.get(key);
      
      if (!current) {
        return {
          remaining: this.dailyLimit,
          isLimited: false,
          resetTime: new Date().setHours(24, 0, 0, 0),
          requestCount: 0
        };
      }

      const remaining = Math.max(0, this.dailyLimit - current.count);
      const resetTime = new Date().setHours(24, 0, 0, 0);

      return {
        remaining,
        isLimited: remaining <= 0,
        resetTime,
        requestCount: current.count,
        firstRequest: current.firstRequest,
        lastRequest: current.lastRequest
      };
    }
  }

  // 将实例存储在全局对象中
  global.rateLimitStore = new RateLimitStore();
}

// 导出全局存储的实例
export const rateLimitStore = global.rateLimitStore;

export async function handleRateLimit(req, res) {
  // 直接从请求头或连接信息中获取 IP
  const ip = req.headers['x-forwarded-for'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress;

  if (!ip) {
    return res.status(400).json({ error: 'Cannot identify client IP' });
  }

  try {
    const status = rateLimitStore.getLimitStatus(ip);
    
    if (status.isLimited) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        remaining: 0,
        resetTime: status.resetTime,
        retryAfter: new Date(status.resetTime) - new Date()
      });
    }

    const result = rateLimitStore.increment(ip);
    const remaining = rateLimitStore.getRemainingLimit(ip);

    return res.status(200).json({
      message: 'Request accepted',
      remaining,
      requestCount: result.count,
      firstRequest: result.firstRequest,
      lastRequest: result.lastRequest,
      resetTime: status.resetTime
    });
  } catch (error) {
    console.error('RateLimit error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
