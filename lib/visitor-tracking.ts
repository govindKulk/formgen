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
 * Get comprehensive visitor analytics for a form with chart data for Evil Charts
 */
export async function getFormAnalytics(formId: string) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        responses: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            responderName: true,
            responderEmail: true,
            responderIp: true,
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        visitRecords: {
          select: {
            visitedAt: true,
            visitorIp: true,
            visitorEmail: true,
          },
          orderBy: {
            visitedAt: 'asc'
          }
        }
      }
    });

    if (!form) {
      throw new Error('Form not found');
    }

    // Calculate time periods
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter recent data
    const recentVisits = form.visitRecords.filter(visit => visit.visitedAt >= thirtyDaysAgo);
    const recentSubmissions = form.responses.filter(response => response.createdAt >= thirtyDaysAgo);

    // Process daily data for line chart
    const dailyData: Record<string, { date: string; visits: number; submissions: number }> = {};
    
    // Initialize last 30 days with 0 values
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      dailyData[dateKey] = {
        date: displayDate,
        visits: 0,
        submissions: 0,
      };
    }

    // Count visits per day
    recentVisits.forEach(visit => {
      const dateKey = visit.visitedAt.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].visits += 1;
      }
    });

    // Count submissions per day
    recentSubmissions.forEach(response => {
      const dateKey = response.createdAt.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].submissions += 1;
      }
    });

    // Convert to array and sort by date (oldest first for chart)
    const chartData = Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([_, data]) => data);

    // Calculate unique visitors
    const uniqueVisitors = new Set();
    recentVisits.forEach(visit => {
      const visitorKey = visit.visitorEmail 
        ? `${visit.visitorIp}:${visit.visitorEmail}` 
        : visit.visitorIp;
      uniqueVisitors.add(visitorKey);
    });

    // Pie chart data for overview
    const bounceRate = Math.max(0, form.visits - form.submissions);
    const pieData = [
      {
        name: 'Submissions',
        value: form.submissions,
        fill: 'hsl(142, 76%, 36%)',
      },
      {
        name: 'Bounced Visits',
        value: bounceRate,
        fill: 'hsl(0, 84%, 60%)',
      },
    ];

    // Calculate conversion rate
    const conversionRate = form.visits > 0 ? (form.submissions / form.visits) * 100 : 0;

    // Recent activity (last 7 days)
    const recentVisitCount = form.visitRecords.filter(visit => visit.visitedAt >= sevenDaysAgo).length;
    const recentSubmissionCount = form.responses.filter(response => response.createdAt >= sevenDaysAgo).length;

    const analytics = {
      overview: {
        totalVisits: form.visits,
        totalSubmissions: form.submissions,
        uniqueVisitors: uniqueVisitors.size,
        conversionRate: Math.round(conversionRate * 100) / 100,
        recentVisits: recentVisitCount,
        recentSubmissions: recentSubmissionCount,
      },
      chartData,
      pieData,
      responses: form.responses.map(response => ({
        id: response.id,
        responderName: response.responderName || 'Anonymous',
        responderEmail: response.responderEmail || 'N/A',
        submittedAt: response.createdAt,
        content: response.content,
      })),
      form: {
        id: form.id,
        title: form.title,
        published: form.published,
        createdAt: form.createdAt,
      }
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
