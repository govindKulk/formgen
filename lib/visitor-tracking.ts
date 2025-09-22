// Comprehensive visitor tracking solution with multiple fallback strategies and email support
// Priorities: Redis > Database > In-Memory > No tracking

import prisma from "@/lib/db";
import { trackVisitorInMemory } from "./memory-cache";
import { trackWithRedis } from "./visitor-cache";
import { VISITOR_TRACKING_CONFIG, getUniqueVisitorWindowMs, shouldTrackIP } from "./visitor-config";

interface VisitorTrackingResult {
  success: boolean;
  method: 'redis' | 'database' | 'memory' | 'none';
  error?: string;
  uniqueVisit?: boolean;
}

/**
 * Track a unique visitor with multiple fallback strategies
 * @param formId - The form ID
 * @param visitorIp - The visitor's IP address
 * @param userAgent - The visitor's user agent
 * @param visitorEmail - Optional email for logged-in users (enables per-user tracking from same IP)
 * @returns Promise<VisitorTrackingResult>
 */
export async function trackUniqueVisitor(
  formId: string, 
  visitorIp: string, 
  userAgent?: string,
  visitorEmail?: string
): Promise<VisitorTrackingResult> {
  
  // Skip tracking for invalid/development IPs
  if (!shouldTrackIP(visitorIp)) {
    return { success: false, method: 'none', error: 'Invalid or development IP' };
  }

  console.log('Tracking visitor:', { formId, visitorIp, hasEmail: !!visitorEmail });

  // Strategy 1: Try Redis (if available and configured)
  try {
    const redisResult = await trackWithRedis(formId, visitorIp, visitorEmail);
    if (redisResult.success) {
      await incrementFormVisits(formId);
      console.log('Redis tracking successful');
      return { success: true, method: 'redis' };
    } else if (redisResult.error !== 'Redis not available') {
      // Redis is available but visitor already tracked
      return { success: false, method: 'redis', error: redisResult.error, uniqueVisit: false };
    }
  } catch (error) {
    console.warn('Redis tracking failed:', error);
  }

  // Strategy 2: Try Database tracking (recommended for production)
  try {
    const dbResult = await trackWithDatabase(formId, visitorIp, userAgent, visitorEmail);
    if (dbResult.success) {
      console.log('Database tracking successful');
      return { success: true, method: 'database' };
    }
    return { success: false, method: 'database', error: dbResult.error };
  } catch (error) {
    console.error('Database tracking failed:', error);
  }

  // Strategy 3: Fallback to in-memory cache (development only)
  try {
    const memoryResult = trackVisitorInMemory(formId, visitorIp, visitorEmail);
    if (memoryResult) {
      // Try to increment the database counter even if in-memory tracking is used
      try {
        await incrementFormVisits(formId);
      } catch (error) {
        console.warn('Failed to increment visits counter:', error);
      }
      console.log('Memory tracking successful');
      return { success: true, method: 'memory' };
    }
    return { success: false, method: 'memory', error: 'Already tracked in memory' };
  } catch (error) {
    console.error('Memory tracking failed:', error);
  }

  // All strategies failed
  return { success: false, method: 'none', error: 'All tracking methods failed' };
}

/**
 * Track visitor using database (primary strategy)
 */
async function trackWithDatabase(
  formId: string, 
  visitorIp: string, 
  userAgent?: string,
  visitorEmail?: string
): Promise<VisitorTrackingResult> {
  
  // Check if this IP/email combination has already visited this form in the configured window
  const windowAgo = new Date(Date.now() - getUniqueVisitorWindowMs());
  
  const whereCondition: any = {
    formId: formId,
    visitorIp: visitorIp,
    visitedAt: {
      gte: windowAgo
    }
  };

  // If email is provided, include it in the uniqueness check
  // If email is null/undefined, check for records with null email (anonymous users)
  if (visitorEmail) {
    whereCondition.visitorEmail = visitorEmail;
  } else {
    whereCondition.visitorEmail = null;
  }
  
  const existingVisit = await prisma.formVisit.findFirst({
    where: whereCondition
  });

  if (existingVisit) {
    const errorMsg = visitorEmail 
      ? `User ${visitorEmail} from IP ${visitorIp} already tracked within ${VISITOR_TRACKING_CONFIG.UNIQUE_VISITOR_WINDOW_HOURS} hours`
      : `Anonymous user from IP ${visitorIp} already tracked within ${VISITOR_TRACKING_CONFIG.UNIQUE_VISITOR_WINDOW_HOURS} hours`;
    return { success: false, error: errorMsg, uniqueVisit: false, method: 'database'};
  }

  // Create new visit record
  await prisma.formVisit.create({
    data: {
      formId: formId,
      visitorIp: visitorIp,
      visitorEmail: visitorEmail || null,
      userAgent: userAgent || '',
    }
  });

  // Increment the visits counter
  await incrementFormVisits(formId);

  return { success: true, method: 'database', uniqueVisit: true };
}

/**
 * Increment the form visits counter
 */
async function incrementFormVisits(formId: string): Promise<void> {
  await prisma.form.update({
    where: { id: formId },
    data: { 
      visits: { increment: 1 }
    }
  });
}

/**
 * Get visitor analytics for a form with email-aware unique counting
 */
export async function getFormAnalytics(formId: string) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: {
        visits: true,
        submissions: true,
        visitRecords: {
          select: {
            visitedAt: true,
            visitorIp: true,
            visitorEmail: true,
          },
          orderBy: {
            visitedAt: 'desc'
          },
          take: 100 // Last 100 visits
        }
      }
    });

    if (!form) {
      throw new Error('Form not found');
    }

    // Calculate unique visitors in different time periods
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Count unique visitors (considering IP + email combinations)
    const uniqueVisitors24h = new Set();
    const uniqueVisitors7d = new Set();
    const uniqueVisitors30d = new Set();

    form.visitRecords.forEach(visit => {
      const visitorKey = visit.visitorEmail 
        ? `${visit.visitorIp}:${visit.visitorEmail}` 
        : visit.visitorIp;
      
      if (visit.visitedAt >= thirtyDaysAgo) {
        uniqueVisitors30d.add(visitorKey);
      }
      if (visit.visitedAt >= sevenDaysAgo) {
        uniqueVisitors7d.add(visitorKey);
      }
      if (visit.visitedAt >= twentyFourHoursAgo) {
        uniqueVisitors24h.add(visitorKey);
      }
    });

    const analytics = {
      totalVisits: form.visits,
      totalSubmissions: form.submissions,
      conversionRate: form.visits > 0 ? (form.submissions / form.visits * 100).toFixed(2) : '0',
      uniqueVisitors: {
        last24Hours: uniqueVisitors24h.size,
        last7Days: uniqueVisitors7d.size,
        last30Days: uniqueVisitors30d.size,
      },
      visitorBreakdown: {
        loggedInUsers: form.visitRecords.filter(v => v.visitorEmail).length,
        anonymousUsers: form.visitRecords.filter(v => !v.visitorEmail).length,
      },
      recentVisits: form.visitRecords.slice(0, 10).map(visit => ({
        ...visit,
        isLoggedIn: !!visit.visitorEmail
      }))
    };

    return analytics;
  } catch (error) {
    console.error('Failed to get form analytics:', error);
    throw error;
  }
}

/**
 * Clean up old visit records (run this periodically via cron job)
 */
export async function cleanupOldVisitRecords(daysToKeep: number = VISITOR_TRACKING_CONFIG.DATABASE_CLEANUP_RETENTION_DAYS) {
  try {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const deletedRecords = await prisma.formVisit.deleteMany({
      where: {
        visitedAt: {
          lt: cutoffDate
        }
      }
    });

    console.log(`Cleaned up ${deletedRecords.count} old visit records`);
    return deletedRecords.count;
  } catch (error) {
    console.error('Failed to cleanup old visit records:', error);
    throw error;
  }
}
