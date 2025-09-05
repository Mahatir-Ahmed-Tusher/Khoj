// Visit tracking utilities for KALOPATHOR
export interface VisitInfo {
  isFirstVisit: boolean;
  visitCount: number;
  firstVisitDate: string | null;
  lastVisitDate: string | null;
  sessionCount: number;
  hasSeenTour: boolean;
}

// Safe wrapper to prevent hydration issues
const safeGetVisitInfo = (): VisitInfo => {
  if (typeof window === 'undefined') {
    return {
      isFirstVisit: false,
      visitCount: 0,
      firstVisitDate: null,
      lastVisitDate: null,
      sessionCount: 0,
      hasSeenTour: false
    };
  }
  return getVisitInfo();
};

const safeIsFirstVisit = (): boolean => {
  if (typeof window === 'undefined') return false;
  return isFirstVisit();
};

const safeIsNewSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  return isNewSession();
};

class VisitTracker {
  private readonly VISIT_KEY = 'kalopathor_visit_info';
  private readonly SESSION_KEY = 'kalopathor_session_active';

  // Check if this is the first visit ever
  isFirstVisit(): boolean {
    if (typeof window === 'undefined') return false;
    
    const visitInfo = this.getVisitInfo();
    return visitInfo.isFirstVisit;
  }

  // Check if this is a new session (browser tab opened)
  isNewSession(): boolean {
    if (typeof window === 'undefined') return false;
    
    const sessionActive = sessionStorage.getItem(this.SESSION_KEY);
    if (!sessionActive) {
      sessionStorage.setItem(this.SESSION_KEY, 'true');
      return true;
    }
    return false;
  }

  // Check if user has seen the tour
  hasSeenTour(): boolean {
    if (typeof window === 'undefined') return false;
    
    const visitInfo = this.getVisitInfo();
    return visitInfo.hasSeenTour;
  }

  // Mark tour as seen
  markTourAsSeen(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const visitInfo = this.getVisitInfo();
      visitInfo.hasSeenTour = true;
      localStorage.setItem(this.VISIT_KEY, JSON.stringify(visitInfo));
    } catch (error) {
      console.error('Error marking tour as seen:', error);
    }
  }

  // Get comprehensive visit information
  getVisitInfo(): VisitInfo {
    if (typeof window === 'undefined') {
      return {
        isFirstVisit: false,
        visitCount: 0,
        firstVisitDate: null,
        lastVisitDate: null,
        sessionCount: 0,
        hasSeenTour: false
      };
    }

    try {
      const stored = localStorage.getItem(this.VISIT_KEY);
      if (!stored) {
        // First visit ever
        const visitInfo: VisitInfo = {
          isFirstVisit: true,
          visitCount: 1,
          firstVisitDate: new Date().toISOString(),
          lastVisitDate: new Date().toISOString(),
          sessionCount: 1,
          hasSeenTour: false
        };
        localStorage.setItem(this.VISIT_KEY, JSON.stringify(visitInfo));
        return visitInfo;
      }

      const visitInfo: VisitInfo = JSON.parse(stored);
      
      // Check if this is a new session
      const isNewSession = this.isNewSession();
      
      if (isNewSession) {
        visitInfo.sessionCount += 1;
        visitInfo.lastVisitDate = new Date().toISOString();
        localStorage.setItem(this.VISIT_KEY, JSON.stringify(visitInfo));
      }

      return visitInfo;
    } catch (error) {
      console.error('Error getting visit info:', error);
      return {
        isFirstVisit: false,
        visitCount: 0,
        firstVisitDate: null,
        lastVisitDate: null,
        sessionCount: 0,
        hasSeenTour: false
      };
    }
  }

  // Track a page visit
  trackVisit(pageName: string): void {
    if (typeof window === 'undefined') return;

    try {
      const visitInfo = this.getVisitInfo();
      const pageVisitsKey = `kalopathor_page_visits_${pageName}`;
      
      const pageVisits = parseInt(localStorage.getItem(pageVisitsKey) || '0');
      localStorage.setItem(pageVisitsKey, (pageVisits + 1).toString());
      
      console.log(`📊 Visit tracked for page: ${pageName}`);
    } catch (error) {
      console.error('Error tracking visit:', error);
    }
  }

  // Get page visit count
  getPageVisitCount(pageName: string): number {
    if (typeof window === 'undefined') return 0;
    
    try {
      const pageVisitsKey = `kalopathor_page_visits_${pageName}`;
      return parseInt(localStorage.getItem(pageVisitsKey) || '0');
    } catch (error) {
      console.error('Error getting page visit count:', error);
      return 0;
    }
  }

  // Reset visit tracking (for testing)
  resetVisitTracking(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.VISIT_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
    
    // Remove all page visit tracking
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('kalopathor_page_visits_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Export singleton instance
export const visitTracker = new VisitTracker();

// Convenience functions
export const isFirstVisit = () => visitTracker.isFirstVisit();
export const isNewSession = () => visitTracker.isNewSession();
export const hasSeenTour = () => visitTracker.hasSeenTour();
export const markTourAsSeen = () => visitTracker.markTourAsSeen();
export const getVisitInfo = () => visitTracker.getVisitInfo();
export const trackVisit = (pageName: string) => visitTracker.trackVisit(pageName);
export const getPageVisitCount = (pageName: string) => visitTracker.getPageVisitCount(pageName);

// Safe exports for SSR
export { safeGetVisitInfo as getSafeVisitInfo };
export { safeIsFirstVisit as getSafeIsFirstVisit };
export { safeIsNewSession as getSafeIsNewSession };
