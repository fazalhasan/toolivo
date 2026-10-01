// Privacy-first local analytics tracker
// Complies with GDPR/CCPA - No PII, cookies, or external tracker scripts

export interface AnalyticsEvent {
  eventName: 'tool_started' | 'file_uploaded' | 'tool_completed' | 'file_downloaded' | 'tool_error';
  toolSlug: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface AnalyticsSummary {
  totalToolRuns: number;
  totalDownloads: number;
  toolsUsage: Record<string, number>;
  recentEvents: AnalyticsEvent[];
}

const STORAGE_KEY = 'toolivo_analytics_v1';

export function trackEvent(
  eventName: AnalyticsEvent['eventName'],
  toolSlug: string,
  metadata?: Record<string, any>
) {
  if (typeof window === 'undefined') return;

  try {
    const currentData = getAnalyticsData();
    const event: AnalyticsEvent = {
      eventName,
      toolSlug,
      timestamp: Date.now(),
      metadata
    };

    currentData.recentEvents.unshift(event);
    if (currentData.recentEvents.length > 100) {
      currentData.recentEvents.pop();
    }

    if (eventName === 'tool_started' || eventName === 'tool_completed') {
      currentData.totalToolRuns += 1;
      currentData.toolsUsage[toolSlug] = (currentData.toolsUsage[toolSlug] || 0) + 1;
    }

    if (eventName === 'file_downloaded') {
      currentData.totalDownloads += 1;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));

    // Dispatch custom event for dashboard reactivity
    window.dispatchEvent(new CustomEvent('toolivo_analytics_update', { detail: currentData }));
  } catch (e) {
    // Fail silently in restricted local storage environments
  }
}

export function getAnalyticsData(): AnalyticsSummary {
  if (typeof window === 'undefined') {
    return { totalToolRuns: 0, totalDownloads: 0, toolsUsage: {}, recentEvents: [] };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { totalToolRuns: 0, totalDownloads: 0, toolsUsage: {}, recentEvents: [] };
    }
    return JSON.parse(raw);
  } catch {
    return { totalToolRuns: 0, totalDownloads: 0, toolsUsage: {}, recentEvents: [] };
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
