

import { Redis } from '@upstash/redis';
import { VISITOR_TRACKING_CONFIG, getUniqueVisitorWindowMs } from './visitor-config';

let redis: Redis | null = null;

// Initialize Redis connection (lazy loading)
function getRedisClient(): Redis | null {
  if (!redis && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      console.log('Redis client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
    }
  }
  return redis;
}

export async function trackWithRedis(
  formId: string, 
  visitorIp: string, 
  visitorEmail?: string
): Promise<{ success: boolean; error?: string }> {
  const client = getRedisClient();
  
  if (!client) {
    return { success: false, error: 'Redis not available' };
  }

  try {
    // Create unique visitor key based on IP and email (if provided)
    const visitorKey = visitorEmail 
      ? `${visitorIp}:${visitorEmail}` 
      : visitorIp;
    
    // Use Redis Set with expiration for efficient unique visitor tracking
    const setKey = `${VISITOR_TRACKING_CONFIG.REDIS_KEY_PREFIX}${formId}`;
    const memberKey = `${visitorKey}:${new Date().toISOString().split('T')[0]}`; // visitor + date
    
    // Check if visitor already exists
    const isExisting = await client.sismember(setKey, memberKey);
    
    if (isExisting) {
      return { success: false, error: 'Visitor already tracked today' };
    }

    // Add visitor to set
    await client.sadd(setKey, memberKey);
    
    // Set expiration for the set
    await client.expire(setKey, VISITOR_TRACKING_CONFIG.REDIS_SET_EXPIRY_SECONDS);
    
    console.log('Redis tracking success:', { formId, visitorKey, memberKey });
    return { success: true };
  } catch (error) {
    console.error('Redis tracking error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Redis error' };
  }
}

export async function getRedisVisitorCount(formId: string): Promise<number> {
  const client = getRedisClient();
  
  if (!client) {
    return 0;
  }

  try {
    const setKey = `${VISITOR_TRACKING_CONFIG.REDIS_KEY_PREFIX}${formId}`;
    return await client.scard(setKey);
  } catch (error) {
    console.error('Redis count error:', error);
    return 0;
  }
}

// Cleanup old visitor records from Redis (run this periodically)
export async function cleanupRedisVisitors(formId: string): Promise<number> {
  const client = getRedisClient();
  
  if (!client) {
    return 0;
  }

  try {
    const setKey = `${VISITOR_TRACKING_CONFIG.REDIS_KEY_PREFIX}${formId}`;
    const members = await client.smembers(setKey);
    const cutoffDate = new Date(Date.now() - VISITOR_TRACKING_CONFIG.REDIS_CACHE_RETENTION_DAYS * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    
    let cleanedCount = 0;
    
    // Remove old entries
    for (const member of members) {
      const parts = member.split(':');
      const memberDate = parts[parts.length - 1]; // Date is always the last part
      
      if (memberDate && memberDate < cutoffDate) {
        await client.srem(setKey, member);
        cleanedCount++;
      }
    }
    
    console.log(`Cleaned up ${cleanedCount} old Redis visitor records for form ${formId}`);
    return cleanedCount;
  } catch (error) {
    console.error('Redis cleanup error:', error);
    return 0;
  }
}

// Test Redis connection
export async function testRedisConnection(): Promise<boolean> {
  const client = getRedisClient();
  
  if (!client) {
    return false;
  }

  try {
    await client.ping();
    return true;
  } catch (error) {
    console.error('Redis connection test failed:', error);
    return false;
  }
}
