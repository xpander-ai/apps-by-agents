# SmartTravel App

A minimal single-page application for travel planning built with vanilla HTML, CSS, and JavaScript.

## Features

- Input travel preferences including destination, dates, travelers, transportation, and travel style
- Generate day-by-day itineraries with attractions and activities
- Recommend accommodations based on preferences
- Provide local travel tips for the destination
- Save travel plans using localStorage for persistence

## How to Use

1. Open `index.html` in your web browser
2. Fill in your travel details:
   - Destination
   - Travel dates
   - Number of travelers
   - Transportation preference
   - Travel style
3. Click "Generate Travel Plan" to see your personalized itinerary
4. Navigate between tabs to view your itinerary, accommodations, and local tips
5. Click "Edit Plan" to modify your travel preferences

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript (no frameworks)
- Responsive design that works on mobile and desktop
- Uses localStorage for data persistence
- ESLint configured for code quality

## Development

To run ESLint checks:

```bash
npm install eslint --save-dev
npx eslint app.js
```

## Future Enhancements

- Integration with real travel APIs for live data
- User accounts and cloud storage
- Sharing capabilities for travel plans
- Offline support with Service Workers
- Weather forecasts for travel dates