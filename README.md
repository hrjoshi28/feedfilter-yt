# feedfilter-yt

🎯 **Take control of your YouTube feed!** A lightweight Chrome extension that lets you filter out unwanted content through smart keyword filtering, duration controls, and automatic Shorts blocking.

<div align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  </a>
  <img src="https://img.shields.io/badge/Manifest-V3-green" alt="Manifest V3">
  <img src="https://img.shields.io/badge/Chrome-Extension-orange" alt="Chrome Extension">
</div>

---

## 🚀 Features

### 🔍 **Smart Keyword Filtering**
- Filter videos by **title** and **channel name**
- Add unlimited keywords to your block list
- Case-insensitive matching
- Instantly hide unwanted content

### ⏱️ **Duration-Based Filtering** 
- Set minimum video length (in minutes)
- Perfect for filtering out clips and teasers
- Focus on longer, more substantial content

### 🚫 **YouTube Shorts Blocker**
- Automatically hide all YouTube Shorts
- Clean up your homepage from short-form content
- Reduce distractions and clickbait

### 📊 **Smart Filtering Notifications**
- Non-intrusive temporary notifications
- Shows exactly what was filtered
- Auto-disappears after 3 seconds
- Only appears when content is actually hidden

### ☁️ **Sync Across Devices**
- Settings automatically sync across all your Chrome browsers
- Works on multiple devices with the same Google account
- No setup required on new devices

---

## 🎯 Why feedfilter-yt?

**YouTube's algorithm optimizes for engagement, not your time.** This extension helps you:

- ✅ **Maintain focus** - Remove distracting content from your feed
- ✅ **Save time** - No more scrolling through irrelevant videos  
- ✅ **Avoid clickbait** - Filter out sensationalized content
- ✅ **Curate your experience** - See only what matters to you
- ✅ **Reduce shorts addiction** - Block short-form content entirely

---

## 🛠️ Installation

### Option 1: Chrome Web Store (Coming Soon)
*Extension will be available on the Chrome Web Store*

### Option 2: Manual Installation (Developer Mode)

1. **Download the extension**
   ```bash
   git clone https://github.com/yourusername/feedfilter-yt.git
   cd feedfilter-yt
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Or go to Chrome Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `feedfilter-yt` folder you downloaded
   - The extension should now appear in your extensions list

5. **Pin the extension** (Optional)
   - Click the puzzle piece icon in Chrome toolbar
   - Click the pin icon next to "feedfilter-yt"

---

## 📖 How to Use

### 🎛️ **Accessing Settings**

1. **Click the extension icon** in your Chrome toolbar
2. The popup will show three main sections:
   - Keyword Filters
   - Video Length Filter  
   - Enable/Disable Filters

### 🔤 **Setting Up Keyword Filters**

**Add Keywords:**
1. Type a keyword in the text field (e.g., "drama", "reaction", "clickbait")
2. Click "Add" or press Enter
3. The keyword will appear in your filter list

**Remove Keywords:**
- Click the "Remove" button next to any keyword in the list

**Examples of useful keywords:**
```
- "reaction" - Blocks reaction videos
- "drama" - Filters out drama content  
- "tiktok" - Removes TikTok compilations
- "shorts compilation" - Blocks compilation videos
- Channel names you want to avoid
```

### ⏰ **Setting Up Length Filters**

1. **Enter minimum duration** in minutes (e.g., `5` for 5 minutes)
2. Videos shorter than this will be automatically hidden
3. Useful for filtering out:
   - Quick clips and teasers
   - Short promotional content
   - Brief snippets

### 🎬 **YouTube Shorts Control**

- **Check the box** to hide all YouTube Shorts
- **Uncheck** to allow Shorts in your feed
- This affects both the Shorts shelf and individual short videos

### 💾 **Saving Your Settings**

1. **Click "Save Settings"** after making changes
2. Settings are automatically synced across your Chrome browsers
3. A green success message confirms your settings were saved

---

## 🔧 Advanced Usage

### 🎯 **Strategic Filtering Tips**

**For Focus:**
- Add distracting channel names as keywords
- Set minimum length to 10+ minutes for in-depth content
- Enable Shorts blocking to reduce impulse watching

**For Learning:**
- Filter out entertainment keywords
- Focus on educational channels by blocking entertainment terms
- Use length filters to find comprehensive tutorials

**For News/Information:**
- Block opinion-based keywords like "react", "response"
- Filter sensationalized terms
- Focus on established news sources

### 🔄 **Understanding Filter Behavior**

- **Keyword filters** check both video titles AND channel names
- **Length filters** only apply to videos with visible duration
- **Shorts filters** target YouTube's short-form content sections
- Filters work on homepage, search results, and recommendations

### 📱 **Multi-Device Setup**

Your settings automatically sync when you:
1. Sign into Chrome on both devices
2. Have Chrome sync enabled for extensions
3. Install the extension on the new device
4. Settings will sync via Chrome's built-in sync system

**Note:** This requires Chrome sign-in and only works across Chrome browsers.

---

## 🐛 Troubleshooting

### ❓ **Common Issues**

**Extension not working:**
- Refresh the YouTube page
- Check that the extension is enabled in `chrome://extensions/`
- Try disabling and re-enabling the extension

**Filters not applying:**
- Click "Save Settings" after making changes
- Check that the relevant filter toggles are enabled
- Refresh the YouTube page

**Settings not syncing:**
- Ensure you're signed into Chrome
- Check Chrome sync settings in Chrome Settings → Sync and Google services

**Some videos still showing:**
- YouTube's dynamic loading means some videos may appear briefly
- The extension filters content as it loads
- Try refreshing the page if issues persist

### 🔍 **Debug Mode**

For developers or advanced troubleshooting:
1. Open browser console (F12)
2. Look for extension-related logs
3. Uncomment debug lines in the source code if needed

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### 🛠️ **Development Setup**

1. Fork the repository
2. Clone your fork locally
3. Make changes in the `src/` directory
4. Test your changes by loading the extension in developer mode
5. Submit a pull request

### 📁 **Project Structure**

```
feedfilter-yt/
├── manifest.json          # Extension manifest
├── src/
│   ├── background/
│   │   └── background.js   # Service worker
│   ├── content/
│   │   └── content.js      # Main filtering logic
│   └── popup/
│       ├── popup.html      # Settings interface
│       ├── popup.css       # Popup styling
│       └── popup.js        # Settings management
├── assets/
│   ├── icons/              # Extension icons
│   └── screenshots/        # Documentation images
└── docs/
    └── CONTRIBUTING.md     # Contribution guidelines
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/feedfilter-yt/issues)
- **Feature Requests:** [GitHub Discussions](https://github.com/yourusername/feedfilter-yt/discussions)
- **Questions:** Check existing issues or start a new discussion

---

## 🎉 Enjoy Your Cleaner YouTube Experience!

Take back control of your YouTube feed and focus on content that truly matters to you. Happy browsing! 🚀

---

<div align="center">
  <strong>⭐ If this extension helped you, please star the repository! ⭐</strong>
</div>