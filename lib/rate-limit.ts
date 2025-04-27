import { LRUCache } from 'lru-cache';

const rateLimitCache = new LRUCache({
  max: 1000, // Maximum number of IPs to track
  ttl: 1000 * 60 * 60, // 1 hour
});

const RATE_LIMIT = 100; // Requests per hour
const WINDOW_MS = 1000 * 60 * 60; // 1 hour

export async function rateLimit(ip: string) {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  
  const requests = rateLimitCache.get(ip) || [];
  const recentRequests = requests.filter((timestamp: number) => timestamp > windowStart);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return { success: false };
  }
  
  recentRequests.push(now);
  rateLimitCache.set(ip, recentRequests);
  
  return { success: true };
} 