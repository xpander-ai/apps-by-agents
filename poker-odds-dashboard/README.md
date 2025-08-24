# Texas Hold'em Odds Dashboard

A real-time poker odds visualization dashboard with animated progress bars, pie charts, probability meters, and comprehensive analytics.

## Features

### 🎴 Complete Texas Hold'em Implementation
- Full 52-card deck with proper shuffling
- Two-player Texas Hold'em gameplay
- Deal preflop, flop, turn, and river cards
- Complete hand evaluation system (High Card through Royal Flush)

### 📊 Real-Time Odds Visualization
- **Animated Progress Bars**: Win/Tie/Lose percentages with smooth animations
- **Pie Charts**: Dynamic probability distribution with interactive segments
- **Probability Meters**: Circular meters showing win chances for each player
- **Hand Strength Indicators**: Visual bars showing relative hand strength

### 🎯 Advanced Analytics
- **Monte Carlo Simulation**: 10,000+ iteration odds calculation
- **Outs Counter**: Displays number of cards that improve each hand
- **Equity Graphs**: Real-time equity evolution throughout the hand
- **Remaining Deck Visualization**: Shows available cards

### ✨ Beautiful Animations & UI
- Smooth CSS transitions and animations
- Modern glassmorphism design
- Responsive layout for all screen sizes
- Card flip animations when dealing
- Shimmer effects on progress bars
- Hover effects and interactive elements

## How It Works

### Game Flow
1. Click "New Game" to deal hole cards to both players
2. Use "Deal Flop", "Deal Turn", and "Deal River" buttons to progress
3. Watch real-time odds update with each new card
4. All visualizations update dynamically with smooth animations

### Odds Calculation
- Uses Monte Carlo simulation with 10,000+ iterations
- Considers all possible remaining card combinations
- Updates probabilities in real-time as cards are revealed
- Calculates outs (cards that improve each hand)

### Visualizations
- **Progress Bars**: Show win/tie percentages with gradient fills
- **Pie Chart**: Interactive SVG chart showing probability distribution
- **Circular Meters**: Animated stroke-dashoffset for smooth percentage display
- **Hand Strength**: Color-coded strength bars (red=weak, green=strong, purple=excellent)
- **Equity Graph**: Canvas-based line chart showing equity changes

## Technical Features

### Hand Evaluation
- Supports all poker hands from High Card to Royal Flush
- Proper kicker comparison for tied hand strengths
- Handles edge cases like A-2-3-4-5 straights
- Optimized combination generation for 7-card evaluation

### Animation System
- CSS keyframe animations for card reveals
- Smooth transitions using cubic-bezier curves
- Staggered animations for visual appeal
- Hardware-accelerated transforms

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Adaptive font sizing
- Touch-friendly controls

## Usage

Simply open `index.html` in a web browser. No server setup required!

1. **New Game**: Deals fresh hole cards to both players
2. **Deal Flop**: Reveals the first three community cards
3. **Deal Turn**: Reveals the fourth community card
4. **Deal River**: Reveals the final community card

Watch the odds dashboard update in real-time with beautiful animations as each card is revealed!

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Optimized for modern browsers with support for:
- CSS Grid & Flexbox
- CSS Custom Properties
- Canvas 2D API
- SVG animations