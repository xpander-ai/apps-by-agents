# Super Mario Game

A beautiful, playable Super Mario Bros-inspired platformer game built entirely with vanilla JavaScript, HTML5 Canvas, and CSS. No external frameworks or game engines - just pure web technologies!

## Features

🎮 **Classic Gameplay Mechanics**
- Side-scrolling platformer action
- Smooth Mario character movement and jumping
- Realistic physics with gravity and collision detection
- Enemy interactions and combat

🎨 **Retro-Inspired Visuals**
- Pixel art styling with crisp, clean sprites
- Smooth animations and responsive controls
- Beautiful gradient backgrounds and atmospheric effects
- Classic Super Mario aesthetic

🏆 **Game Elements**
- Collectible coins with spinning animations
- Multiple platform types and obstacles
- Goomba enemies with AI movement
- Score tracking and lives system
- Level completion mechanics
- Game over and restart functionality

⌨️ **Responsive Controls**
- Arrow keys or WASD for movement
- Spacebar or Up arrow for jumping
- Smooth, responsive input handling

## How to Play

### Setup
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. No installation required - runs entirely in the browser!

### Controls
- **Move Left**: Left Arrow or 'A' key
- **Move Right**: Right Arrow or 'D' key  
- **Jump**: Spacebar, Up Arrow, or 'W' key

### Gameplay
- Navigate Mario through the level by running and jumping
- Collect golden coins to increase your score (200 points each)
- Avoid or defeat enemies by jumping on top of them (100 points each)
- Reach the flag at the end of the level to complete it
- You have 3 lives - falling off the screen or touching enemies will cost a life
- Game ends when all lives are lost

### Scoring
- **Coins**: 200 points each
- **Defeating Enemies**: 100 points each  
- **Level Completion**: 1000 bonus points

## Technical Details

### Architecture
The game is built using modern JavaScript ES6+ features with a clean, object-oriented architecture:

- **Game Class**: Main game engine handling the game loop, rendering, and state management
- **Mario Class**: Player character with physics, input handling, and collision detection
- **Level Class**: Level generation and management of game objects
- **GameObject Classes**: Platform, Goomba (enemy), Coin, and Flag entities

### Key Features
- **Smooth 60fps gameplay** with requestAnimationFrame
- **Pixel-perfect collision detection** using AABB (Axis-Aligned Bounding Box)
- **Camera system** that follows the player through the level
- **Physics engine** with gravity, friction, and realistic jumping
- **Responsive design** that works on different screen sizes
- **State management** for game over, level completion, and restart functionality

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- No external dependencies required
- HTML5 Canvas API for smooth 2D graphics
- CSS3 for styling and responsive design

## File Structure

```
super-mario-game/
├── index.html          # Main HTML structure
├── style.css           # Styling and layout
├── script.js           # Game logic and JavaScript code
└── README.md          # This documentation
```

## Development

The game is fully self-contained and can be easily modified:

1. **Add New Levels**: Modify the `generateLevel()` method in the Level class
2. **New Enemies**: Create new enemy classes following the Goomba pattern
3. **Power-ups**: Add new collectible items with special effects
4. **Sound Effects**: Add Web Audio API integration for retro sounds
5. **Additional Animations**: Enhance the sprite rendering for more fluid movement

## Performance

The game is optimized for smooth performance:
- Efficient rendering with canvas clearing and redrawing
- Object pooling for enemies and coins
- Minimal DOM manipulation
- 60fps target frame rate

---

**Enjoy playing this retro-inspired Super Mario adventure!** 🍄

*Built with ❤️ using vanilla web technologies*