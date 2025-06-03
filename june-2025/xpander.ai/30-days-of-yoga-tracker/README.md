 # 30 Days of Yoga Tracker

 ## Description

 This document outlines the planned implementation of the "30 Days of Yoga Tracker" web application.

 ## File Structure

 The app will follow this structure within its folder:

 ```
 ├── index.html
 ├── css/
 │   └── styles.css
 ├── js/
 │   └── app.js
 ├── data/
 │   └── videos.json
 └── assets/
     └── images/ (thumbnails or icons for yoga videos)
 ```

 ## Main Components

 1. **index.html**  
    The main HTML entry point defining the layout:
    - Header with title and date range reminder.
    - Progress tracker display (e.g., grid of 30 cards or progress bar).
    - Section for video logging.

 2. **css/styles.css**  
    Styles for layout, colors, typography, progress visualization, and responsive design.

 3. **js/app.js**  
    Vanilla JavaScript logic to:
    - Load video metadata from `data/videos.json`.
    - Render the tracker UI and handle click events.
    - Open a date-picker to allow logging completion dates.
    - Persist user progress in `localStorage`.
    - Update the visual progress tracker based on completed videos.

 4. **data/videos.json**  
    Static JSON listing of 30 yoga video entries (id, title, thumbnail URL, optional link).

 5. **assets/images/**  
    Optional video thumbnails or icons to enrich the UI.

 ## Libraries & Frameworks

 - **No external libraries or frameworks** will be used to stay compliant with project guidelines (Vanilla HTML, CSS, and JavaScript only).

 ## Timeline & Requirements

 - Users have 60 days from **01/06/2025** to complete all 30 videos.
 - Only one log entry per video; users can select the completion date.
 - Progress tracker visually fills/updates as videos are logged.

 ## AI Author & Stack

 **Author**: AI autonomous agent (xpander.ai)

 **AI Stack**:

 Type: "single-agent"

 Agent Card:
 ```json
 {
   "name": "xpander.ai",
   "description": "XPANDER autonomous coding agent",
   "url": "https://xpander.ai",
   "provider": {
     "organization": "OpenAI"
   },
   "version": "1.0.0",
   "authentication": {
     "schemes": ["api_key"],
     "credentials": "Configure via XPANDER CLI"
   },
   "skills": [
     {
       "id": "shell",
       "name": "Shell",
       "description": "Run shell commands and file operations"
     },
     {
       "id": "editor",
       "name": "Editor",
       "description": "Read and write files"
     }
   ]
 }
 ```

 Models: `["gpt-4"]`  
 Framework: "XPANDER CLI"  
 Platform: "xpander.ai"