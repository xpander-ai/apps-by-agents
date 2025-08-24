# 🃏 Poker Hole Cards Selector

An elegant, interactive dropdown card selector for Texas Hold'em poker hole cards with visual card representations, duplicate filtering, and quick-select presets.

## ✨ Features

### 🎴 Visual Card Selector
- **Elegant dropdowns** with card grid layout
- **Suit symbols** (♠♥♦♣) with proper colors
- **Visual card representations** showing rank and suit
- **Smooth animations** and hover effects

### 🚫 Duplicate Prevention
- **Smart filtering** prevents selecting the same card twice
- **Real-time updates** disable already selected cards
- **Visual feedback** with grayed-out disabled cards

### ⚡ Quick Select Presets
Pre-configured buttons for popular poker hands:
- **Premium hands**: AA, KK, QQ, JJ
- **Strong hands**: AK, AKs, AQ, AQs, KQ, AJ
- **Pocket pairs**: TT, 99

### 🎯 Interactive Features
- **Hand recognition** with proper poker terminology
- **Hand strength indicators** (Premium, Strong, Playable)
- **Statistics display** (hand type, suited/offsuit status, odds)
- **Random hand generator**
- **Clear selection** button

### 📱 Responsive Design
- **Mobile-friendly** layout
- **Touch-optimized** interactions
- **Adaptive grid** layouts
- **Smooth scrolling** dropdowns

## 🚀 Usage

### Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="card-selector">
        <!-- Card selector HTML structure -->
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### JavaScript API

```javascript
// Initialize the selector
const cardSelector = new PokerCardSelector();

// Get selected cards
console.log(cardSelector.selectedCards.card1); // e.g., "AS"
console.log(cardSelector.selectedCards.card2); // e.g., "KH"

// Set cards programmatically
cardSelector.setPresetCards("AS", "KH");

// Clear selection
cardSelector.clearSelection();

// Generate random hand
cardSelector.selectRandomHand();
```

## 🎨 Customization

### CSS Variables
The component uses CSS custom properties for easy theming:

```css
:root {
    --primary-color: #4caf50;
    --background-gradient: linear-gradient(135deg, #0f4c3a 0%, #1a5f4a 100%);
    --card-background: linear-gradient(145deg, #ffffff, #f0f0f0);
    --accent-color: #ffd700;
}
```

### Card Styling
- **Red suits** (♥♦): Hearts and Diamonds in `#e53e3e`
- **Black suits** (♠♣): Spades and Clubs in `#2d3748`
- **Hover effects** with scale transformation and glowing borders
- **Smooth transitions** on all interactive elements

## 🔧 Technical Implementation

### Architecture
- **ES6 Class-based** structure
- **Event delegation** for efficient DOM handling
- **State management** for card selections
- **Dynamic rendering** of card grids

### Key Components

1. **PokerCardSelector Class**
   - Manages card selection state
   - Handles UI updates and interactions
   - Provides hand analysis

2. **Card Grid System**
   - Dynamic generation of all 52 cards
   - Real-time filtering for duplicates
   - Visual feedback for selections

3. **Hand Recognition Engine**
   - Identifies common poker hands
   - Calculates hand strength
   - Provides statistical information

### Performance Features
- **Efficient DOM updates** with targeted re-rendering
- **Optimized event handling** with delegation
- **Smooth animations** using CSS transforms
- **Intersection Observer** for scroll animations

## 📦 File Structure

```
poker-hole-cards-selector/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with animations
├── script.js           # Full JavaScript implementation
└── README.md           # This documentation
```

## 🎮 How to Use

1. **Select Cards**: Click on dropdown to open card grid, then click any card
2. **Quick Select**: Use preset buttons for popular hands (AA, KK, AK, etc.)
3. **Clear**: Reset both cards with the clear button
4. **Random**: Generate a random two-card hand
5. **View Stats**: See hand type, suited status, and approximate odds

## 🎯 Integration Tips

### For Existing Poker Apps
Replace your text inputs with this structure:

```html
<!-- Replace this: -->
<input type="text" placeholder="Enter card (e.g., AS)" />

<!-- With this: -->
<div class="card-dropdown" id="card1-dropdown">
    <div class="selected-card">
        <span class="card-display">Select Card</span>
        <span class="dropdown-arrow">▼</span>
    </div>
    <div class="dropdown-menu">
        <div class="card-grid" id="card1-grid"></div>
    </div>
</div>
```

### Event Handling
Listen for card selection changes:

```javascript
// Custom event when cards are selected
document.addEventListener('cardsUpdated', (event) => {
    console.log('New hand:', event.detail.cards);
    console.log('Hand name:', event.detail.handName);
});
```

## 🌟 Advanced Features

- **Keyboard navigation** support
- **Screen reader** accessibility
- **Touch gesture** support
- **Animation sequences** for card reveals
- **Sound effects** integration points
- **Multi-language** suit symbols

This implementation provides a complete, production-ready card selector that can enhance any poker application with beautiful, intuitive card selection.