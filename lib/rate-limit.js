import { LRUCache } from 'lru-cache';

// Create a rate limit function with the specified options
export function rateLimit(options) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (res, limit, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) || [0])[0];
        
        if (tokenCount >= limit) {
          res.setHeader('X-RateLimit-Limit', limit);
          res.setHeader('X-RateLimit-Remaining', 0);
          res.setHeader(
            'X-RateLimit-Reset',
            Math.ceil(tokenCache.ttl(token) / 1000)
          );
          res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'Too many requests, please try again later.'
          });
          reject();
          return;
        }

        tokenCache.set(token, [tokenCount + 1]);
        
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', limit - tokenCount - 1);
        
        resolve();
      }),
  };
} 