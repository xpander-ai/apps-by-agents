# SmartTravel App

A minimal single-page application for travel planning built with vanilla HTML, CSS, and JavaScript.

## Features

- **Travel Preferences Input**: Users can input key travel details including:
  - Destination
  - Travel dates
  - Number of travelers (adults and children)
  - Transportation preference
  - Travel style (budget, luxury, nature-focused, city explorer, etc.)

- **Intelligent Recommendations**: After submitting travel details, the app generates:
  - Day-by-day itinerary with top attractions and experiences
  - Accommodation options optimized for cost, rating, and walkability
  - Local travel tips including cultural etiquette and best times to visit

- **Data Persistence**: All travel plans and generated recommendations are saved in localStorage, allowing users to:
  - Revisit their travel plans after page reload
  - Edit existing plans and see updated recommendations

## Technical Implementation

- **Vanilla JavaScript**: No frameworks or libraries used
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **LocalStorage**: For data persistence between sessions
- **Modular Code**: Organized into logical components for maintainability

## How It Works

1. Users fill out the travel planning form with their preferences
2. The app generates personalized recommendations based on the destination and preferences
3. Results are displayed in an easy-to-navigate tabbed interface
4. All data is saved to localStorage for persistence
5. Users can edit their plan at any time to see updated recommendations

## Future Enhancements

- Integration with real travel APIs for live data
- User accounts for saving multiple trip plans
- Sharing functionality for trip plans
- Offline support with Service Workers
- Export to PDF/calendar functionality

## Getting Started

Simply open `index.html` in your web browser to start using the app. No server or build process required.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT