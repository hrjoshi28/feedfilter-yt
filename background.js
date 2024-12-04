// background.js

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
      keywords: [],
      minLength: 0,
      enableKeywordFilter: true,
      enableLengthFilter: true
    }, () => {
      console.log('YouTube Filter Extension initialized with default settings.');
    });
  });
  