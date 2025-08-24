# Community Cards - Modern Drag & Drop Interface

A sophisticated, interactive interface for managing community cards (Flop, Turn, River) with modern drag-and-drop functionality, smooth animations, and comprehensive state management.

## ✨ Features

### 🎯 Core Functionality
- **Visual Card Deck**: Interactive 52-card deck with realistic playing card design
- **Drag & Drop Interface**: Intuitive card movement from deck to community positions
- **Community Card Positions**: Dedicated slots for Flop (3 cards), Turn (1 card), and River (1 card)
- **Card Flip Animations**: Smooth 3D flip transitions when cards are revealed
- **Mobile Support**: Touch-friendly interface with gesture support

### 🎨 Visual Features
- **Modern Design**: Clean, casino-style green gradient background
- **Smooth Animations**: 
  - Card flip animations with 3D rotation
  - Shuffle animation effects
  - Deal animations with staggered timing
  - Hover effects and visual feedback
- **Visual Feedback**: 
  - Drop zone highlighting
  - Drag preview with rotation effect
  - Occupied slot indicators
  - Interactive hover states

### 🎲 Game Functions
- **Shuffle & Deal**: Automatically shuffle deck and deal 5 community cards
- **Manual Card Selection**: Click individual cards to flip and reveal
- **Reset Board**: Clear all community cards and restore full deck
- **Random Dealing**: Animated card dealing with realistic timing

### 💾 State Management
- **Undo/Redo**: Full history tracking with 50-step memory
- **Save States**: Named save system with local storage persistence
- **Load States**: Browse and restore previously saved board configurations
- **Auto-Save**: Automatic state preservation during gameplay

### ⌨️ Keyboard Shortcuts
- `Ctrl/Cmd + Z`: Undo last action
- `Ctrl/Cmd + Shift + Z`: Redo action
- `Ctrl/Cmd + R`: Reset board
- `Ctrl/Cmd + S`: Save current state
- `Escape`: Close modals

### 📱 Responsive Design
- Mobile-optimized touch interface
- Responsive grid layouts
- Adaptive card sizing
- Touch gesture support

## 🚀 Getting Started

### Quick Start
1. Open `index.html` in a modern web browser
2. The interface will load with a shuffled 52-card deck
3. Start dragging cards from the deck to community card positions
4. Use the control buttons for advanced features

### Basic Usage

#### Manual Card Placement
1. **Click any card** in the deck to flip and reveal it
2. **Drag cards** from the deck to any community card slot
3. Cards will automatically flip when placed in community positions
4. **Drop zones** will highlight when dragging over valid positions

#### Automatic Dealing
1. Click **"🎲 Shuffle & Deal"** to automatically:
   - Shuffle the entire deck with animation
   - Deal 5 cards to community positions (Flop, Turn, River)
   - Display smooth dealing animations

#### State Management
1. **Save**: Click "💾 Save" to store current board state with custom name
2. **Load**: Click "📂 Load" to browse and restore saved states
3. **Undo/Redo**: Use buttons or keyboard shortcuts to navigate history
4. **Reset**: Click "🔄 Reset" to clear board and restore full deck

## 🏗️ Technical Architecture

### Core Classes
- **CommunityCardsInterface**: Main application controller
- **Card Management**: 52-card deck with suits (♠♥♦♣) and ranks (A-K)
- **State System**: Comprehensive history and save/load functionality
- **Animation Engine**: CSS3 transitions with JavaScript coordination

### File Structure
```
community-cards-interface/
├── index.html          # Main HTML structure
├── style.css          # Complete styling with animations
├── script.js          # Full JavaScript functionality
└── README.md          # This documentation
```

### Data Structures
```javascript
// Card Object
{
  suit: '♠',           // ♠, ♥, ♦, ♣
  rank: 'A',           // A, 2-10, J, Q, K
  id: 'A-♠',          // Unique identifier
  color: 'black'       // 'red' or 'black'
}

// Community Cards State
{
  'flop-1': Card,      // First flop card
  'flop-2': Card,      // Second flop card  
  'flop-3': Card,      // Third flop card
  'turn': Card,        // Turn card
  'river': Card        // River card
}
```

## 🎨 Customization

### Styling
The interface uses CSS custom properties for easy theming:

```css
:root {
  --primary-green: #0c4a2e;
  --accent-yellow: #fbbf24;
  --card-width: 60px;
  --card-height: 84px;
  --animation-duration: 0.3s;
}
```

### Card Design
Cards feature:
- Realistic playing card proportions (3:4 ratio)
- Color-coded suits (red: ♥♦, black: ♠♣)
- Professional typography
- 3D flip animations
- Hover and drag effects

### Animations
- **Shuffle Animation**: Deck wiggle effect during shuffle
- **Deal Animation**: Cards fly from deck to positions
- **Flip Animation**: 3D rotation reveal effect
- **Drag Preview**: Rotated card follows mouse/finger
- **Drop Zone**: Highlight and scale effects

## 📱 Mobile Support

### Touch Gestures
- **Tap**: Flip individual cards
- **Long Press + Drag**: Move cards to community positions
- **Pinch**: Zoom interface (browser default)
- **Scroll**: Navigate through deck when in mobile view

### Responsive Breakpoints
- **Desktop**: Full side-by-side layout
- **Tablet**: Stacked layout with larger touch targets
- **Mobile**: Single column with optimized spacing

## 🔧 Advanced Features

### History System
- Tracks up to 50 state changes
- Includes deck composition and community card positions
- Supports branching (new actions after undo clear future history)
- Memory-efficient state compression

### Local Storage
- Saves named board states persistently
- Includes metadata (name, timestamp)
- Automatic cleanup of old saves
- Cross-session persistence

### Performance Optimizations
- Event delegation for card interactions
- Efficient DOM manipulation
- CSS transitions over JavaScript animations
- Lazy loading of card elements
- Debounced resize handling

## 🌟 Use Cases

### Game Development
- **Poker Applications**: Texas Hold'em community card simulation
- **Card Game Prototyping**: Test different community card scenarios
- **Training Tools**: Practice recognizing card combinations
- **Demo Applications**: Showcase card game mechanics

### Educational
- **Probability Teaching**: Demonstrate card combination odds
- **Game Theory**: Explore betting scenarios with known community cards
- **User Interface Design**: Example of modern drag-and-drop implementation
- **Animation Techniques**: Study CSS3 and JavaScript animation coordination

### Entertainment
- **Home Games**: Digital community card display for live poker
- **Streaming**: Clean interface for poker content creation
- **Practice**: Solo practice with different board textures
- **Analysis**: Review and save interesting board states

## 🔍 Browser Compatibility

### Supported Browsers
- **Chrome**: 80+ (full support)
- **Firefox**: 75+ (full support)  
- **Safari**: 13+ (full support)
- **Edge**: 80+ (full support)
- **Mobile Safari**: iOS 13+ (full support)
- **Chrome Mobile**: Android 80+ (full support)

### Required Features
- CSS3 Transforms and Transitions
- HTML5 Drag and Drop API
- Local Storage API
- ES6 Classes and Arrow Functions
- Touch Events (mobile)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:
- Additional card themes
- Sound effects
- Multi-language support
- Tournament mode features
- Statistics tracking
- Export/import functionality

---

*Built with modern web technologies for an exceptional user experience.*