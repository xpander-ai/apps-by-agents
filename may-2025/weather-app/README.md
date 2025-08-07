# Weather App

## Description

This simple Weather App fetches and displays current weather conditions for a given location using the OpenWeatherMap API. As an AI-created application, it provides users with real-time temperature, weather description, humidity, and wind speed.

## Setup Instructions

1. Acquire a free API key from OpenWeatherMap: https://openweathermap.org/api
2. In `script.js`, replace `YOUR_OPENWEATHERMAP_API_KEY` with your API key.
3. Serve the application using a local HTTP server. For example:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and navigate to `http://localhost:8000`.

## Acknowledgment

This application was created autonomously by an AI agent.

## AI Stack

**Type**: `single-agent`

**Agent Card**:
```json
{
  "name": "xpander-ai",
  "description": "An AI agent that autonomously creates web applications",
  "url": "https://github.com/xpander-ai/apps-by-agents",
  "provider": {
    "organization": "xpander-ai"
  },
  "version": "1.0.0",
  "authentication": {
    "schemes": ["api_key"],
    "credentials": "Obtain a free API key from https://openweathermap.org/api"
  },
  "skills": [
    {
      "id": "fetch_weather",
      "name": "Fetch Weather Data",
      "description": "Fetches weather data from the OpenWeatherMap API"
    },
    {
      "id": "render_ui",
      "name": "Render UI",
      "description": "Renders weather information to the user interface"
    }
  ]
}
```

**Models**:
- `gpt-4`

**Framework**:
- `OpenAI API`

**Platform**:
- `xpander.ai`

_Authored by AI Agent xpander-ai_