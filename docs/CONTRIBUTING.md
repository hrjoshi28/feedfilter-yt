# Contributing to feedfilter-yt

Thank you for your interest in contributing to feedfilter-yt! This document provides guidelines and instructions for contributing to this project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/feedfilter-yt.git
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔧 Development Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the project directory

## 📝 Guidelines

### Code Style
- Use clear, descriptive variable and function names
- Add comments for complex logic
- Follow the existing code organization structure
- Use consistent indentation (2 spaces)
- Keep functions focused and concise

### Commit Messages
Format your commit messages as follows:
```
type: brief description

longer description if needed
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat: add category-based filtering

Add ability to filter videos based on their category/topic.
This includes:
- Category selection UI
- Category detection logic
- Storage handling for category preferences
```

### Pull Requests
1. Update your fork to the latest upstream changes
2. Test your changes thoroughly
3. Update documentation if needed
4. Create a pull request with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots/videos for UI changes

## 🔍 Testing
Before submitting a PR, please:
1. Test the extension on different YouTube pages
   - Home page
   - Watch page
   - Search results
   - Channel pages
2. Verify settings persist after browser restart
3. Check console for any errors
4. Ensure performance isn't negatively impacted

## 📦 Project Structure
```
feedfilter-yt/
├── src/
│   ├── background/
│   ├── content/
│   └── popup/
├── assets/
├── docs/
└── manifest.json
```

## 🐛 Bug Reports
When reporting bugs, please include:
1. Chrome version
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots if applicable
6. Console errors if any

## 💡 Feature Requests
Feature requests are welcome! Please provide:
1. Clear use case
2. Description of the problem it solves
3. Potential implementation approach if you have one

## 📜 License
By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## ❓ Questions?
Feel free to open an issue for any questions about contributing.

Thank you for helping make feedfilter-yt better! 🎉