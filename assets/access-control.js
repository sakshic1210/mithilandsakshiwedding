// Wedding Website Access Control
// Add this script to the top of your main pages

(function() {
    'use strict';
    
    // Check if user has access
    const hasAccess = sessionStorage.getItem('weddingAccess') === 'granted';
    
    // If no access, redirect to login page
    if (!hasAccess) {
        // Don't redirect if already on login page
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
            return;
        }
    }
    
    // Track page views for analytics
    const trackPageView = async () => {
        try {
            const pageData = {
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            };
            
            console.log('Page view:', pageData);
            
            // Store in localStorage for tracking
            const pageLog = JSON.parse(localStorage.getItem('weddingPageViews') || '[]');
            pageLog.push(pageData);
            localStorage.setItem('weddingPageViews', JSON.stringify(pageLog));
            
            // Optional: Send to your analytics service
            // await fetch('your-analytics-endpoint', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(pageData)
            // });
            
        } catch (error) {
            console.error('Page tracking error:', error);
        }
    };
    
    // Track page view
    trackPageView();
    
    // Logout functionality (optional - add a logout button if needed)
    window.weddingLogout = function() {
        sessionStorage.removeItem('weddingAccess');
        window.location.href = 'login.html';
    };
    
})();





