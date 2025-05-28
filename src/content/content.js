// content.js

// Uncomment the next line for debugging purposes
// console.warn('YouTube Filter Extension: Content script loaded');

// -----------------------------
// Visual Indicator Setup
// -----------------------------
const indicator = document.createElement('div');
Object.assign(indicator.style, {
  position: 'fixed',
  top: '10px',
  right: '10px',
  padding: '6px 12px',
  backgroundColor: 'rgba(26, 115, 232, 0.9)', // Softer blue
  color: 'white',
  zIndex: '10000',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: 'bold',
  pointerEvents: 'none', // Prevents blocking interactions
  opacity: '0',
  transition: 'opacity 0.3s ease',
  display: 'none', // Start completely hidden
});
// Don't set any initial text content
document.body.appendChild(indicator);

let indicatorTimeout;

// -----------------------------
// In-Memory Cache for Settings
// -----------------------------
let settings = {
  keywords: [],
  minLength: 0,
  enableKeywordFilter: true,
  enableLengthFilter: true,
  enableShortsFilter: true, // Default to filtering shorts
};

// -----------------------------
// Update Settings from Storage
// -----------------------------
const updateSettings = (newSettings) => {
  settings = { ...settings, ...newSettings };
};

// -----------------------------
// Initialize Settings on Load
// -----------------------------
const initializeSettings = async () => {
  try {
    const data = await chrome.storage.sync.get([
      'keywords',
      'minLength',
      'enableKeywordFilter',
      'enableLengthFilter',
      'enableShortsFilter',
    ]);
    updateSettings(data);
    filterExistingRecommendations();
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
};

// -----------------------------
// Listen for Storage Changes
// -----------------------------
chrome.storage.onChanged.addListener((changes) => {
  const relevantChanges = {};
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (['keywords', 'minLength', 'enableKeywordFilter', 'enableLengthFilter', 'enableShortsFilter'].includes(key)) {
      relevantChanges[key] = newValue;
    }
  }
  if (Object.keys(relevantChanges).length) {
    updateSettings(relevantChanges);
    reapplyFilters();
  }
});

// -----------------------------
// Utility: Parse Duration to Minutes
// -----------------------------
const parseDuration = (timeText) => {
  const parts = timeText.split(':').map(Number);
  if (parts.some(isNaN)) return 0;

  let [hours, minutes, seconds] = [0, 0, 0];
  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else if (parts.length === 2) {
    [minutes, seconds] = parts;
  } else if (parts.length === 1) {
    [seconds] = parts;
  }

  const durationInSeconds = hours * 3600 + minutes * 60 + (seconds || 0);
  return durationInSeconds / 60; // Convert to minutes
};

// -----------------------------
// Cached Selectors
// -----------------------------
const selectors = {
  recommendations: 'ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer',
  shorts: 'ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer, ytd-shorts, [aria-label*="Shorts"], [title*="Shorts"]',
  shortsVideos: 'ytd-rich-grid-slim-media, ytd-reel-item-renderer',
  title: '#video-title',
  channelName: '#channel-name, #text.ytd-channel-name',
  timeLabel: '#text.ytd-thumbnail-overlay-time-status-renderer',
};

// -----------------------------
// Debounce Function
// -----------------------------
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// -----------------------------
// Hidden Count Tracking
// -----------------------------
let hiddenCount = {
  keyword: 0,
  length: 0,
  shorts: 0,
};

// -----------------------------
// Reset All Filters (show all videos)
// -----------------------------
const resetAllFilters = () => {
  const recommendations = document.querySelectorAll(selectors.recommendations);
  recommendations.forEach(recommendation => {
    if (recommendation.dataset.filtered) {
      recommendation.style.display = '';
      delete recommendation.dataset.filtered;
      delete recommendation.dataset.filterReason;
    }
  });
  
  // Also reset shorts
  const shortsContainers = document.querySelectorAll(selectors.shorts);
  shortsContainers.forEach(container => {
    if (container.dataset.filtered) {
      container.style.display = '';
      delete container.dataset.filtered;
    }
  });
  
  const shortsVideos = document.querySelectorAll(selectors.shortsVideos);
  shortsVideos.forEach(video => {
    if (video.dataset.filtered) {
      video.style.display = '';
      delete video.dataset.filtered;
    }
  });
  
  hiddenCount = { keyword: 0, length: 0, shorts: 0 };
};

// -----------------------------
// Filter Shorts
// -----------------------------
const filterShorts = () => {
  if (!settings.enableShortsFilter) return;
  
  // Hide entire Shorts sections
  const shortsContainers = document.querySelectorAll(selectors.shorts);
  shortsContainers.forEach(container => {
    if (!container.dataset.filtered) {
      container.style.display = 'none';
      container.dataset.filtered = 'true';
      hiddenCount.shorts++;
    }
  });
  
  // Hide individual shorts videos
  const shortsVideos = document.querySelectorAll(selectors.shortsVideos);
  shortsVideos.forEach(video => {
    if (!video.dataset.filtered) {
      video.style.display = 'none';
      video.dataset.filtered = 'true';
      hiddenCount.shorts++;
    }
  });
};
const applyFilter = (recommendation) => {
  // Skip if already processed in this session
  if (recommendation.dataset.processed) return;
  
  const titleElement = recommendation.querySelector(selectors.title);
  const channelElement = recommendation.querySelector(selectors.channelName);
  const timeLabelElement = recommendation.querySelector(selectors.timeLabel);

  const title = titleElement?.textContent.trim().toLowerCase() || '';
  const channelName = channelElement?.textContent.trim().toLowerCase() || '';
  const timeText = timeLabelElement?.textContent.trim() || '';

  let shouldHide = false;
  let filterReason = '';

  // Keyword Filter
  if (settings.enableKeywordFilter && settings.keywords.length > 0) {
    const lowerKeywords = settings.keywords.map(k => k.toLowerCase());
    const matchedKeyword = lowerKeywords.find(keyword => 
      title.includes(keyword) || channelName.includes(keyword)
    );
    
    if (matchedKeyword) {
      shouldHide = true;
      filterReason = 'keyword';
      hiddenCount.keyword++;
    }
  }

  // Length Filter (only if not already hidden by keyword)
  if (settings.enableLengthFilter && !shouldHide && timeText) {
    const durationInMinutes = parseDuration(timeText);
    if (durationInMinutes < settings.minLength) {
      shouldHide = true;
      filterReason = 'length';
      hiddenCount.length++;
    }
  }

  // Apply filter result
  if (shouldHide) {
    recommendation.style.display = 'none';
    recommendation.dataset.filtered = 'true';
    recommendation.dataset.filterReason = filterReason;
    // Uncomment the next line for debugging purposes
    // console.log(`Hidden Video: "${titleElement?.textContent.trim()}" by "${channelElement?.textContent.trim()}", Duration: ${timeText}, Reason: ${filterReason}`);
  } else {
    // Ensure video is visible if it doesn't match filters
    recommendation.style.display = '';
    delete recommendation.dataset.filtered;
    delete recommendation.dataset.filterReason;
  }
  
  // Mark as processed in this session
  recommendation.dataset.processed = 'true';
};

// -----------------------------
// Filter Existing Recommendations on Initial Load
// -----------------------------
const filterExistingRecommendations = () => {
  // Reset all processing markers
  const recommendations = document.querySelectorAll(selectors.recommendations);
  recommendations.forEach(recommendation => {
    delete recommendation.dataset.processed;
  });
  
  // Reset counters
  hiddenCount = { keyword: 0, length: 0, shorts: 0 };
  
  // Apply filters to all recommendations
  recommendations.forEach(applyFilter);
  
  // Filter shorts
  filterShorts();
  
  updateIndicator();
};

// -----------------------------
// Reapply Filters (e.g., when settings change)
// -----------------------------
const reapplyFilters = () => {
  // First, reset all filters and show all videos
  resetAllFilters();
  
  // Then reapply filters to all recommendations
  filterExistingRecommendations();
};

// -----------------------------
// Update Visual Indicator
// -----------------------------
const updateIndicator = () => {
  const totalHidden = hiddenCount.keyword + hiddenCount.length + hiddenCount.shorts;
  
  // Only show notification if something was actually hidden
  if (totalHidden > 0) {
    let message = 'Filter Active: ';
    const parts = [];
    if (hiddenCount.keyword > 0) parts.push(`${hiddenCount.keyword} keywords`);
    if (hiddenCount.length > 0) parts.push(`${hiddenCount.length} short videos`);
    if (hiddenCount.shorts > 0) parts.push(`${hiddenCount.shorts} shorts`);
    message += parts.join(', ') + ' hidden';
    indicator.textContent = message;
    
    // Show indicator temporarily only when there's something to show
    showIndicatorTemporarily();
  }
};

// -----------------------------
// Show Indicator Temporarily
// -----------------------------
const showIndicatorTemporarily = () => {
  // Clear any existing timeout
  if (indicatorTimeout) {
    clearTimeout(indicatorTimeout);
  }
  
  // Show indicator
  indicator.style.display = 'block';
  indicator.style.opacity = '1';
  
  // Hide after 3 seconds
  indicatorTimeout = setTimeout(() => {
    indicator.style.opacity = '0';
    // Also hide display after fade completes
    setTimeout(() => {
      indicator.style.display = 'none';
    }, 300); // Wait for transition to complete
  }, 3000);
};

// -----------------------------
// Setup MutationObserver to Process Only Newly Added Elements
// -----------------------------
const setupObserver = () => {
  const observer = new MutationObserver(debounce((mutations) => {
    const newRecommendations = [];
    let foundNewShorts = false;
    
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the node itself matches
          if (node.matches && node.matches(selectors.recommendations)) {
            newRecommendations.push(node);
          }
          // Check for matching children
          const childRecommendations = node.querySelectorAll ? node.querySelectorAll(selectors.recommendations) : [];
          newRecommendations.push(...childRecommendations);
          
          // Check for shorts
          if (node.matches && (node.matches(selectors.shorts) || node.matches(selectors.shortsVideos))) {
            foundNewShorts = true;
          }
          const childShorts = node.querySelectorAll ? node.querySelectorAll(`${selectors.shorts}, ${selectors.shortsVideos}`) : [];
          if (childShorts.length > 0) {
            foundNewShorts = true;
          }
        }
      });
    });

    if (newRecommendations.length > 0) {
      newRecommendations.forEach(applyFilter);
    }
    
    if (foundNewShorts) {
      filterShorts();
    }
    
    if (newRecommendations.length > 0 || foundNewShorts) {
      updateIndicator();
    }
  }, 100));

  const targetSelectors = ['ytd-watch', 'ytd-browse', 'ytd-app'];
  const targets = targetSelectors.map(selector => document.querySelector(selector)).filter(Boolean);

  if (targets.length) {
    targets.forEach(target => observer.observe(target, { childList: true, subtree: true }));
    // Uncomment for debugging
    // console.log('MutationObserver is watching specific containers');
  } else {
    // Fallback to observing the entire body if specific containers are not found
    observer.observe(document.body, { childList: true, subtree: true });
    // Uncomment for debugging
    // console.warn('MutationObserver is watching the entire document.body as a fallback');
  }
};

// -----------------------------
// Initialize the Content Script
// -----------------------------
const initialize = () => {
  // Wait for the page to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initializeSettings, 500);
    });
  } else {
    setTimeout(initializeSettings, 500);
  }
  
  setupObserver();
};

// Start initialization
initialize();

// -----------------------------
// Listen for Messages from Popup (e.g., when settings are updated)
// -----------------------------
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'reapplyFilters') {
    try {
      reapplyFilters();
      sendResponse({ success: true });
    } catch (error) {
      console.error('Error reapplying filters:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true; // Keeps the message channel open for asynchronous responses
  }
});

// -----------------------------
// Handle page navigation (YouTube SPA)
// -----------------------------
let currentUrl = location.href;
const checkForUrlChange = () => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    // Reset processing markers when navigating to new page
    setTimeout(() => {
      const recommendations = document.querySelectorAll(selectors.recommendations);
      recommendations.forEach(recommendation => {
        delete recommendation.dataset.processed;
      });
      filterExistingRecommendations();
    }, 1000);
  }
};

// Check for URL changes every second (for YouTube's SPA navigation)
setInterval(checkForUrlChange, 1000);