# feedfilter-yt

🎯 A lightweight Chrome extension that lets you take control of your YouTube feed through keyword and duration filters.

todo: integrate with LLM and have support for filters defined via english languge.

## Key Features
- Filter out videos using custom keywords (matches both titles and channel names)
- Remove short-form content based on custom duration thresholds
- Real-time visual indicator showing filter activity
- Instant settings sync across browser sessions
- Minimal performance impact

## Why feedfilter-yt?
YouTube's recommendation algorithm often prioritizes engagement over user intent. This extension helps you maintain a cleaner, more relevant feed by filtering out unwanted content and short videos that don't match your viewing preferences.

## Installation
1. Clone this repository
2. Visit `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the repository directory

## Usage
- Click the extension icon to open settings
- Add keywords to filter out unwanted content
- Set minimum video length to filter short videos
- Toggle filters on/off as needed
- Changes apply instantly to your YouTube feed

## Technical Stack
- Chrome Extensions Manifest V3
- Vanilla JavaScript
- Chrome Storage Sync API
- MutationObserver for real-time DOM updates

## Privacy
- No data collection
- No external API calls
- All settings stored locally in Chrome storage
