# Poker Community Cards - Drag & Drop Interface

A modern, interactive drag-and-drop interface for managing poker community cards (flop, turn, river). Features visual card animations, shuffle effects, and comprehensive state management.

## Features

### 🎴 Interactive Card Deck
- Visual 52-card deck with authentic playing card design
- Drag-and-drop functionality for intuitive card placement
- Real-time card availability tracking
- Shuffle animation with realistic card movement

### 🎯 Drop Zones
- **Flop**: Three card positions for the first community cards
- **Turn**: Single card position for the fourth community card  
- **River**: Single card position for the final community card
- Visual feedback during drag operations
- Click-to-remove functionality for placed cards

### ✨ Animations & Visual Effects
- **Card Flip Animations**: Smooth 3D flip effect when cards are placed
- **Shuffle Animation**: Realistic deck shuffling with staggered card movements
- **Hover Effects**: Cards scale and rotate on hover for enhanced interaction
- **Drag Feedback**: Visual indicators during drag operations

### 🎲 Game Controls
- **Deal Random Cards**: Automatically deals 5 random community cards with staggered animation
- **Clear Board**: Removes all cards from the board and returns them to deck
- **Shuffle Deck**: Randomizes card order with visual shuffle animation
- **Card Counter**: Real-time display of remaining available cards

### 🔄 Undo/Redo System
- Complete action history tracking
- Undo/Redo buttons with smart state management
- Preserves up to 20 previous states
- Instant state restoration with visual updates

### 💾 Save/Load States
- **Multiple Save Slots**: 3 available save slots with custom naming
- **Persistent Storage**: Uses browser localStorage for data persistence
- **Timestamp Tracking**: Automatic save time recording
- **State Validation**: Error handling for corrupted save data

## How to Use

### Basic Operations
1. **Place Cards**: Drag any card from the deck to a community card position
2. **Remove Cards**: Click on any placed card to return it to the deck
3. **Deal Random**: Click "Deal Random Cards" for automatic 5-card deal
4. **Clear Board**: Click "Clear Board" to remove all community cards

### Advanced Features
- **Undo/Redo**: Use the undo/redo buttons to navigate through your action history
- **Shuffle**: Click "Shuffle Deck" to randomize the card order
- **Save/Load**: Use the save/load buttons to preserve and restore board states

### Drag & Drop Tips
- Cards glow and scale when hovered
- Drop zones highlight when dragging over them
- Used cards become semi-transparent and non-draggable
- Visual feedback confirms successful card placement

## Technical Implementation

### Architecture
- **Pure JavaScript**: No external dependencies
- **ES6 Classes**: Object-oriented design for maintainability
- **Event-Driven**: Responsive to user interactions
- **State Management**: Centralized state with history tracking

### Key Components
- `PokerCommunityCards`: Main application class
- **Drag & Drop API**: Native HTML5 drag and drop implementation
- **CSS Animations**: Hardware-accelerated transforms and transitions
- **Local Storage**: Browser-native persistence layer

### Browser Compatibility
- Modern browsers with HTML5 drag & drop support
- CSS Grid and Flexbox for responsive layout
- CSS transforms for smooth animations

## File Structure
```
poker-community-cards/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and animations  
├── script.js           # Core JavaScript functionality
└── README.md          # This documentation
```

## Customization

### Styling
The interface uses CSS custom properties and can be easily themed by modifying the color variables in `styles.css`.

### Card Designs
Card faces use Unicode suit symbols (♠♣♥♦) and can be customized by modifying the `createCardElement` method.

### Animation Timing
All animation durations are defined in CSS and can be adjusted for different pacing preferences.

## Future Enhancements
- Hand evaluation and poker rankings
- Multi-player board state sharing
- Tournament mode with betting rounds
- Advanced card filtering and search
- Keyboard shortcuts and accessibility features

---

**Enjoy your poker game setup! 🃏**