// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const keywordInput = document.getElementById('keyword-input');
    const addButton = document.getElementById('add-keyword');
    const keywordList = document.getElementById('keyword-list');
    const minLengthInput = document.getElementById('min-length');
    const saveSettingsButton = document.getElementById('save-settings');
    const statusMessage = document.getElementById('status-message');
    const enableKeywordFilterCheckbox = document.getElementById('enable-keyword-filter');
    const enableLengthFilterCheckbox = document.getElementById('enable-length-filter');
  
    /**
     * Updates the list of keywords displayed in the popup.
     */
    const updateKeywords = async () => {
      try {
        const { keywords = [] } = await chrome.storage.sync.get('keywords');
        keywordList.innerHTML = '';
        keywords.forEach(keyword => {
          const li = document.createElement('li');
          li.textContent = keyword;
  
          const removeButton = document.createElement('button');
          removeButton.textContent = 'Remove';
          removeButton.title = `Remove keyword "${keyword}"`;
          removeButton.addEventListener('click', () => removeKeyword(keyword));
  
          li.appendChild(removeButton);
          keywordList.appendChild(li);
        });
      } catch (error) {
        console.error('Error updating keywords:', error);
        showStatus('Failed to load keywords.', 'error');
      }
    };
  
    /**
     * Removes a keyword from the filter list.
     * @param {string} keyword
     */
    const removeKeyword = async (keyword) => {
      try {
        const { keywords = [] } = await chrome.storage.sync.get('keywords');
        const updatedKeywords = keywords.filter(k => k !== keyword);
        await chrome.storage.sync.set({ keywords: updatedKeywords });
        await updateKeywords();
        showStatus(`Keyword "${keyword}" removed and filter applied.`, 'success');
        sendReapplyFiltersMessage();
      } catch (error) {
        console.error(`Error removing keyword "${keyword}":`, error);
        showStatus('Failed to remove keyword.', 'error');
      }
    };
  
    /**
     * Adds a new keyword to the filter list.
     */
    const addKeyword = async () => {
      const keyword = keywordInput.value.trim();
      if (!keyword) {
        showStatus('Please enter a keyword.', 'error');
        return;
      }
  
      try {
        const { keywords = [] } = await chrome.storage.sync.get('keywords');
        if (keywords.includes(keyword)) {
          showStatus('This keyword already exists!', 'error');
          return;
        }
  
        const updatedKeywords = [...keywords, keyword];
        await chrome.storage.sync.set({ keywords: updatedKeywords });
        keywordInput.value = '';
        await updateKeywords();
        showStatus(`Keyword "${keyword}" added and filter applied.`, 'success');
        sendReapplyFiltersMessage();
      } catch (error) {
        console.error('Error adding keyword:', error);
        showStatus('Failed to add keyword.', 'error');
      }
    };
  
    /**
     * Saves the filter settings and reapplies the filters.
     */
    const saveSettings = async () => {
      const minLength = parseFloat(minLengthInput.value) || 0;
      const enableKeywordFilter = enableKeywordFilterCheckbox.checked;
      const enableLengthFilter = enableLengthFilterCheckbox.checked;
  
      try {
        await chrome.storage.sync.set({
          minLength,
          enableKeywordFilter,
          enableLengthFilter
        });
        showStatus('Settings saved and filter applied.', 'success');
        sendReapplyFiltersMessage();
      } catch (error) {
        console.error('Error saving settings:', error);
        showStatus('Failed to save settings.', 'error');
      }
    };
  
    /**
     * Displays a status message to the user.
     * @param {string} message
     * @param {string} type - 'success' or 'error'
     */
    const showStatus = (message, type = 'success') => {
      statusMessage.textContent = message;
      statusMessage.className = type;
      // Additional styling can be managed via CSS classes
      setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.className = '';
      }, 3000);
    };
  
    /**
     * Sends a message to the content script to reapply filters.
     */
    const sendReapplyFiltersMessage = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'reapplyFilters' }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending message:', chrome.runtime.lastError);
              showStatus('Failed to apply filters.', 'error');
            }
          });
        }
      });
    };
  
    /**
     * Loads saved settings into the popup.
     */
    const loadSettings = async () => {
      try {
        const { minLength = 0, enableKeywordFilter = true, enableLengthFilter = true } = await chrome.storage.sync.get([
          'minLength',
          'enableKeywordFilter',
          'enableLengthFilter'
        ]);
        minLengthInput.value = minLength;
        enableKeywordFilterCheckbox.checked = enableKeywordFilter;
        enableLengthFilterCheckbox.checked = enableLengthFilter;
      } catch (error) {
        console.error('Error loading settings:', error);
        showStatus('Failed to load settings.', 'error');
      }
    };
  
    // Event Listeners
    addButton.addEventListener('click', addKeyword);
  
    // Enable adding keyword via Enter key
    keywordInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addKeyword();
      }
    });
  
    saveSettingsButton.addEventListener('click', saveSettings);
  
    // Initialize Popup
    (async () => {
      await loadSettings();
      await updateKeywords();
    })();
  });
  