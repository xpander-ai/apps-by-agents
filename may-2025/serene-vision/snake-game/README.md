# Snake Game

A modern implementation of the classic Snake game with multiple difficulty levels, responsive design, and touch controls for mobile devices.

## Features

- **Responsive Design**: Adapts to different screen sizes for optimal gameplay on both desktop and mobile devices
- **Multiple Difficulty Levels**: Choose between Easy, Medium, and Hard difficulty settings
- **Touch Controls**: Swipe gestures and on-screen buttons for mobile gameplay
- **Keyboard Controls**: Arrow keys or WASD for desktop gameplay
- **Score Tracking**: Current score and high score tracking with local storage persistence
- **Progressive Web App (PWA)**: Install on your device for offline play
- **Modern UI**: Clean, attractive interface with animations and visual feedback

## How to Play

1. Click "Start Game" or press the spacebar to begin
2. Control the snake using:
   - **Desktop**: Arrow keys or WASD keys
   - **Mobile**: Swipe gestures or on-screen direction buttons
3. Collect food (red circles) to grow the snake and increase your score
4. Avoid colliding with the walls or the snake's own body
5. Pause the game at any time by clicking the "Pause" button or pressing the spacebar

## Technical Implementation

The game is built using modern web technologies:

- **HTML5 Canvas**: For rendering the game graphics
- **CSS3**: For styling and responsive design
- **JavaScript**: For game logic and interactivity
- **Local Storage API**: For saving high scores
- **Service Worker**: For offline functionality as a PWA

### Code Structure

- **index.html**: Main HTML structure
- **styles.css**: Styling and responsive design
- **script.js**: Game logic and functionality
- **manifest.json**: PWA configuration
- **service-worker.js**: Offline caching and PWA functionality

### Game Architecture

The game follows a modular architecture with:

- **Configuration**: Game settings and constants
- **Game State**: Current state of the game
- **Event Handling**: User input processing
- **Game Loop**: Core update and render cycle
- **Rendering**: Drawing the game elements on canvas

## Performance Optimizations

- **RequestAnimationFrame**: For smooth animation and optimal performance
- **Throttled Updates**: Game updates at specific intervals based on difficulty
- **Efficient Collision Detection**: Optimized algorithms for collision checking
- **Responsive Canvas Scaling**: Maintains performance across different screen sizes
- **Event Delegation**: Efficient event handling

## Browser Compatibility

The game works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Installation as a PWA

On supported browsers, you can install the game as a standalone application:

1. Open the game in your browser
2. Look for the install prompt or use the browser's menu to "Add to Home Screen"
3. Launch the game from your device's home screen for a full-screen experience

## Future Enhancements

- Additional game modes (e.g., time attack, obstacles)
- Customizable snake appearance
- Power-ups and special food items
- Multiplayer functionality
- Sound effects and background music

Enjoy playing the Snake Game!