// Option 3: Simple in-memory cache with email support (for development/low-traffic)
// Note: This will reset on every serverless cold start
// Only recommended for development or very low-traffic forms

import { VISITOR_TRACKING_CONFIG, getUniqueVisitorWindowMs } from './visitor-config';

interface VisitorEntry {
  ip: string;
  email?: string;
  timestamp: number;
}

// Global cache map (persists only during instance lifetime)
const visitorCache = new Map<string, Set<string>>();

export function trackVisitorInMemory(
  formId: string, 
  visitorIp: string, 
  visitorEmail?: string
): boolean {
  const now = Date.now();
  const windowMs = getUniqueVisitorWindowMs();
  
  // Create unique visitor key based on IP and email (if provided)
  const visitorKey = visitorEmail 
    ? `${visitorIp}:${visitorEmail}` 
    : visitorIp;
  
  const cacheKey = `${visitorKey}:${Math.floor(now / windowMs)}`;
  
  if (!visitorCache.has(formId)) {
    visitorCache.set(formId, new Set());
  }
  
  const formVisitors = visitorCache.get(formId)!;
  
  if (formVisitors.has(cacheKey)) {
    return false; // Already tracked
  }
  
  formVisitors.add(cacheKey);
  
  // Clean up old entries periodically
  cleanupOldEntries(formId);
  
  return true; // New visitor
}

function cleanupOldEntries(formId: string) {
  const formVisitors = visitorCache.get(formId);
  if (!formVisitors) return;
  
  const now = Date.now();
  const windowMs = getUniqueVisitorWindowMs();
  const currentPeriod = Math.floor(now / windowMs);
  
  // Remove entries older than configured retention period
  const maxPeriodsToKeep = Math.floor(
    VISITOR_TRACKING_CONFIG.REDIS_CACHE_RETENTION_DAYS * 24 * 60 * 60 * 1000 / windowMs
  );
  
  for (const entry of formVisitors) {
    const parts = entry.split(':');
    const entryPeriodStr = parts[parts.length - 1]; // Period is always the last part
    const entryPeriod = parseInt(entryPeriodStr);
    
    if (currentPeriod - entryPeriod > maxPeriodsToKeep) {
      formVisitors.delete(entry);
    }
  }
}

export function getInMemoryVisitorCount(formId: string): number {
  const formVisitors = visitorCache.get(formId);
  return formVisitors ? formVisitors.size : 0;
}

// Get detailed visitor info for debugging
export function getInMemoryVisitorDetails(formId: string): string[] {
  const formVisitors = visitorCache.get(formId);
  return formVisitors ? Array.from(formVisitors) : [];
}

// Manual cleanup function
export function cleanupInMemoryCache(): void {
  for (const formId of visitorCache.keys()) {
    cleanupOldEntries(formId);
  }
}

// Export for potential usage in the API route
export { visitorCache };
