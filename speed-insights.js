// Vercel Speed Insights initialization
// This script initializes Speed Insights for web deployments on Vercel
// It will not track in development mode or in the Electron app

(function() {
  // Only initialize if running in a browser environment (not Electron)
  const isElectron = typeof navigator !== 'undefined' && 
                     navigator.userAgent.toLowerCase().indexOf('electron') > -1;
  
  // Don't initialize in Electron environment
  if (isElectron) {
    console.log('[Speed Insights] Skipped: Running in Electron');
    return;
  }

  // Initialize the queue for Speed Insights
  window.si = window.si || function() {
    (window.siq = window.siq || []).push(arguments);
  };

  // Inject the Speed Insights script
  const script = document.createElement('script');
  script.defer = true;
  
  // Use the Vercel Speed Insights script
  // In production on Vercel, this will be automatically routed correctly
  script.src = '/_vercel/speed-insights/script.js';
  
  script.onerror = function() {
    console.log('[Speed Insights] Script not loaded - may not be deployed on Vercel');
  };
  
  // Insert the script into the page
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
})();
