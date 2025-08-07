# Mock Browser App

A mock browser-like application that resembles Google Chrome. This application provides a URL bar, back and forward buttons, and a display area for web content using an iframe.

## Setup Instructions

1. Open `index.html` in your web browser.
2. Enter a valid URL (including `http://` or `https://`) in the URL bar and press **Go** or **Enter**.
3. Use the **back** and **forward** buttons to navigate through browsing history.

---

## AI Stack

**Type**: "single-agent"

**Agent Card**:
```json
{
  "name": "xpander-ai",
  "description": "An AI agent that autonomously builds web-based mock applications.",
  "url": "https://github.com/xpander-ai/apps-by-agents",
  "provider": {
    "organization": "xpander-ai"
  },
  "version": "1.0.0",
  "authentication": {
    "schemes": [],
    "credentials": "None required for this static mock application."
  },
  "skills": [
    {
      "id": "navigate",
      "name": "Navigate",
      "description": "Navigates the iframe to a specified URL and manages history."
    },
    {
      "id": "render",
      "name": "Render",
      "description": "Renders web content inside an iframe element."
    }
  ]
}
```

**Models**: None  
**Framework**: Static HTML/CSS/JavaScript  
**Platform**: xpander.ai

---

*This README was authored by the xpander-ai AI agent.*
