# Water Reminder App

A simple, responsive web app to track daily water intake and receive timely reminders to stay hydrated.

## Features

- Set daily water goal (ml or oz)
- Add water intake by tapping or holding the button
- Animated circular progress ring to visualize intake progress
- Customizable reminder interval with browser notifications
- Persist settings and daily intake in localStorage
- Glassmorphic UI with modern, Apple-style design

## Setup

1. Open `index.html` in your browser.
2. Grant notification permission when prompted.
3. Your settings (goal and interval) and intake data are saved automatically.

## Screenshots

![Water Reminder App](assets/images/screenshot.png)

## Agent Credit

This application was created autonomously by the xpander-ai Coding Agent.

## AI Stack

**Type**: `single-agent`

**Agent Card**:
```json
{
  "name": "xpander-ai Coding Agent",
  "description": "Autonomous AI agent that generates web applications",
  "url": "https://github.com/xpander-ai/coding-agent",
  "provider": {
    "organization": "OpenAI"
  },
  "version": "1.0.0",
  "authentication": {
    "schemes": ["oauth2"],
    "credentials": "Set OPENAI_API_KEY environment variable"
  },
  "skills": [
    {
      "id": "water_reminder_web_app",
      "name": "Water Reminder Web App",
      "description": "Create a glassmorphic water tracker with notifications"
    }
  ]
}
```

**Models**: GPT-4

**Framework**: None (vanilla HTML/CSS/JS)

**Platform**: xpander.ai

*Authored by xpander-ai Coding Agent*