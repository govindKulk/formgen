// Visitor tracking configuration - centralized timeframes and settings

export const VISITOR_TRACKING_CONFIG = {
  // Consistent timeframe across all strategies
  UNIQUE_VISITOR_WINDOW_HOURS: 24, // 24 hours for unique visitor detection
  
  // Data retention periods
  REDIS_CACHE_RETENTION_DAYS: 7, // Keep Redis data for 7 days
  DATABASE_CLEANUP_RETENTION_DAYS: 90, // Keep database records for 90 days
  
  // Redis configuration
  REDIS_KEY_PREFIX: 'formgen:visitor:',
  REDIS_SET_EXPIRY_SECONDS: 7 * 24 * 60 * 60, // 7 days in seconds
  
  // Memory cache configuration
  MEMORY_CACHE_CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // Clean up every hour
  
  // IP filtering
  SKIP_TRACKING_IPS: [
    '127.0.0.1',
    '::1',
    'unknown'
  ] as string[],
  SKIP_PRIVATE_IPS: true, // Skip 192.168.x.x, 10.x.x.x ranges
} as const;

// Helper function to get unique visitor window in milliseconds
export function getUniqueVisitorWindowMs(): number {
  return VISITOR_TRACKING_CONFIG.UNIQUE_VISITOR_WINDOW_HOURS * 60 * 60 * 1000;
}

// Helper function to check if IP should be tracked
export function shouldTrackIP(ip: string): boolean {
  if (VISITOR_TRACKING_CONFIG.SKIP_TRACKING_IPS.includes(ip)) {
    return false;
  }
  
  if (VISITOR_TRACKING_CONFIG.SKIP_PRIVATE_IPS) {
    // Skip private IP ranges
    return !(
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.16.') ||
      ip.startsWith('172.17.') ||
      ip.startsWith('172.18.') ||
      ip.startsWith('172.19.') ||
      ip.startsWith('172.2') ||
      ip.startsWith('172.30.') ||
      ip.startsWith('172.31.')
    );
  }
  
  return true;
}
