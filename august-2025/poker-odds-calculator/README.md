# Poker Odds Calculator - Drag & Drop Interface

A modern, interactive poker odds calculator featuring an intuitive drag-and-drop interface for placing cards on the board. Built with vanilla JavaScript, HTML5, and CSS3.

## Features

### 🎴 Visual Card Deck
- Complete 52-card deck with beautifully styled playing cards
- Color-coded suits (red for hearts/diamonds, black for spades/clubs)
- Responsive grid layout that adapts to different screen sizes

### 🖱️ Drag & Drop Interface
- Drag cards from the deck to player hand or community card positions
- Visual feedback with hover effects and drop zone highlighting
- Smooth animations when placing or removing cards
- Double-click cards to remove them from the board

### 🎯 Community Cards Layout
- Separate sections for Flop (3 cards), Turn (1 card), and River (1 card)
- Clear visual organization matching real poker table layout
- Labeled drop zones for easy card placement

### ✨ Card Animations
- Flip animation when cards are placed on the board
- Shuffle animation when dealing random cards
- Hover effects and smooth transitions throughout the interface
- Cards scale and lift on hover for better visual feedback

### 🎲 Random Deal Function
- "Deal Random" button to automatically deal a complete hand
- Shuffle animation plays before dealing cards
- Deals 2 player cards and 5 community cards randomly

### ↩️ Undo/Redo Functionality
- Full undo/redo history (up to 50 actions)
- Keyboard shortcuts: Ctrl+Z (Undo), Ctrl+Shift+Z (Redo)
- Visual button states indicate when undo/redo is available
- Preserves complete game state including card positions

### 💾 Save/Load Board States
- Save multiple named game states to local storage
- Load previously saved states instantly
- Delete unwanted saved states
- Keyboard shortcut: Ctrl+S to open save/load modal
- Persistent storage across browser sessions

### 📊 Real-Time Odds Calculation
- **Hand Strength**: Automatically detects and displays current hand ranking
- **Win Probability**: Calculates percentage chance of winning based on current cards
- **Outs**: Shows number of cards that could improve your hand
- Updates instantly as cards are added or removed

### ⌨️ Keyboard Shortcuts
- `Ctrl+Z` - Undo last action
- `Ctrl+Shift+Z` - Redo last undone action
- `Ctrl+R` - Deal random cards
- `Ctrl+S` - Open save/load modal

### 📱 Responsive Design
- Mobile-friendly interface that works on tablets and phones
- Adaptive layouts for different screen sizes
- Touch-friendly controls for mobile devices

## How to Use

1. **Open the Application**: Open `index.html` in any modern web browser
2. **Place Cards**: Drag cards from the deck area to your hand or community card positions
3. **View Odds**: Real-time calculations appear in the results section
4. **Remove Cards**: Double-click any placed card to remove it
5. **Deal Random**: Click "Deal Random" for a complete random hand
6. **Save States**: Use "Save State" to preserve interesting scenarios
7. **Undo/Redo**: Use the buttons or keyboard shortcuts to navigate history

## Hand Rankings Supported

The calculator recognizes all standard poker hands:
- Royal Flush
- Straight Flush  
- Four of a Kind
- Full House
- Flush
- Straight
- Three of a Kind
- Two Pair
- One Pair
- High Card

## Odds Calculation

### Win Probability
- **Pre-flop**: Based on starting hand strength and basic poker statistics
- **Post-flop**: Uses outs calculation and rule-of-thumb probability formulas
- **Complete hands**: Shows final hand strength percentage

### Outs Calculation
- Flush draws (9 outs when 4 cards to a flush)
- Straight draws (8 outs for open-ended, 4 for gutshot)
- Overcard draws (6 outs for two overcards)
- Combination draws calculated appropriately

## Technical Details

### Built With
- **HTML5** - Semantic markup and modern web standards
- **CSS3** - Advanced animations, gradients, and responsive design
- **Vanilla JavaScript** - No external dependencies, pure ES6+

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Structure
```
poker-odds-calculator/
├── index.html          # Main HTML structure
├── style.css           # All styling and animations
├── script.js           # Complete JavaScript functionality
└── README.md           # This documentation
```

### Key Classes and Functions

#### Main Class: `PokerOddsCalculator`
- `init()` - Initialize the application
- `renderDeck()` - Render all available cards
- `placeCard()` - Handle card placement via drag-and-drop
- `calculateOdds()` - Calculate win probability and hand strength
- `dealRandom()` - Deal random cards with animation
- `saveState()` / `restoreState()` - Undo/redo functionality

## Performance Features

- **Efficient DOM Updates**: Only re-renders changed elements
- **Local Storage**: Saves user preferences and game states
- **Smooth Animations**: 60fps animations using CSS transforms
- **Memory Management**: Proper cleanup of event listeners and intervals

## Future Enhancements

Potential features for future versions:
- Multi-player support with opponent hand ranges
- Tournament mode with blind calculations
- Hand history analysis
- Statistical tracking over time
- Import/export of game scenarios
- Advanced simulation with Monte Carlo methods

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests. Pull requests are welcome for:
- Bug fixes
- Performance improvements  
- New features
- Documentation improvements

---

Enjoy calculating your poker odds with this modern, interactive interface! 🃏