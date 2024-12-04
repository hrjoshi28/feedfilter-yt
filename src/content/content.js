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
});
indicator.textContent = 'YouTube Filter Active: 0 hidden';
document.body.appendChild(indicator);

// -----------------------------
// In-Memory Cache for Settings
// -----------------------------
let settings = {
  keywords: [],
  minLength: 0,
  enableKeywordFilter: true,
  enableLengthFilter: true,
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
    if (['keywords', 'minLength', 'enableKeywordFilter', 'enableLengthFilter'].includes(key)) {
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
};

// -----------------------------
// Filter a Single Recommendation
// -----------------------------
const applyFilter = (recommendation) => {
  if (recommendation.dataset.filtered) return;

  const titleElement = recommendation.querySelector(selectors.title);
  const channelElement = recommendation.querySelector(selectors.channelName);
  const timeLabelElement = recommendation.querySelector(selectors.timeLabel);

  const title = titleElement?.textContent.trim().toLowerCase() || '';
  const channelName = channelElement?.textContent.trim().toLowerCase() || '';
  const timeText = timeLabelElement?.textContent.trim() || '';

  let shouldHide = false;

  // Keyword Filter using includes
  if (settings.enableKeywordFilter && settings.keywords.length > 0) {
    const lowerKeywords = settings.keywords.map(k => k.toLowerCase());
    shouldHide = lowerKeywords.some(keyword => title.includes(keyword) || channelName.includes(keyword));
    if (shouldHide) hiddenCount.keyword++;
  }

  // Length Filter using includes (no regex)
  if (settings.enableLengthFilter && !shouldHide && timeText) {
    const durationInMinutes = parseDuration(timeText);
    if (durationInMinutes < settings.minLength) {
      shouldHide = true;
      hiddenCount.length++;
    }
  }

  if (shouldHide) {
    recommendation.style.display = 'none';
    recommendation.dataset.filtered = 'true';
    // Uncomment the next line for debugging purposes
    // console.log(`Hidden Video: "${titleElement.textContent.trim()}" by "${channelElement.textContent.trim()}", Duration: ${timeText}`);
  }
};

// -----------------------------
// Filter Existing Recommendations on Initial Load
// -----------------------------
const filterExistingRecommendations = () => {
  const recommendations = document.querySelectorAll(selectors.recommendations);
  recommendations.forEach(applyFilter);
  updateIndicator();
};

// -----------------------------
// Reapply Filters (e.g., when settings change)
// -----------------------------
const reapplyFilters = () => {
  hiddenCount = { keyword: 0, length: 0 };
  const recommendations = document.querySelectorAll(selectors.recommendations);
  recommendations.forEach(applyFilter);
  updateIndicator();
};

// -----------------------------
// Update Visual Indicator
// -----------------------------
const updateIndicator = () => {
  const totalHidden = hiddenCount.keyword + hiddenCount.length;
  indicator.textContent = `Filter Active: ${hiddenCount.keyword} keywords, ${hiddenCount.length} short videos hidden`;
};

// -----------------------------
// Setup MutationObserver to Process Only Newly Added Elements
// -----------------------------
const setupObserver = () => {
  const observer = new MutationObserver((mutations) => {
    const newRecommendations = [];
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.matches(selectors.recommendations)) {
          newRecommendations.push(node);
        }
      });
    });

    if (newRecommendations.length > 0) {
      newRecommendations.forEach(applyFilter);
      updateIndicator();
    }
  });

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
initializeSettings();
setupObserver();

// -----------------------------
// Listen for Messages from Popup (e.g., when settings are updated)
/// -----------------------------
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
