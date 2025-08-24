# Poker Hand Range Selector

A comprehensive interactive tool for analyzing poker starting hands and ranges with equity calculations and visual heatmap display.

## Features

### 🎯 Interactive 13x13 Grid
- Complete matrix of all 169 possible starting hands
- Visual color coding system for hand strength categories:
  - **Premium**: AA, KK, QQ, AK (Red)
  - **Strong**: JJ, TT, AQ, AJ (Orange)
  - **Playable**: 99-22, KQ, KJ (Yellow)
  - **Marginal**: Ax, Kx, suited connectors (Green)
  - **Weak**: Low cards, offsuit (Gray)

### 📊 Range Selection Tools
- **Preset Ranges**: Quick selection for common playing styles
  - Tight (15% of hands)
  - Loose (35% of hands)
  - Aggressive (25% of hands)
- **Percentage Slider**: Select top X% of hands by strength
- **Manual Selection**: Click individual hands to add/remove from range

### 🎲 Opponent Modeling
- Select opponent range types (Tight/Loose/Aggressive)
- Visual comparison of your range vs opponent range
- Range vs range equity calculations
- Real-time equity updates

### 🔥 Equity Heatmap
- Visual representation of hand performance against opponent ranges
- Color-coded equity percentages:
  - High Equity (70%+): Dark Green
  - Medium-High (60-70%): Light Green
  - Medium (50-60%): Yellow
  - Medium-Low (40-50%): Orange
  - Low (<40%): Red

### 📱 Responsive Design
- Desktop and mobile friendly
- Touch-friendly interface
- Scalable grid layout

## How to Use

1. **Select Your Range**:
   - Use preset buttons for quick range selection
   - Drag the percentage slider to select top hands
   - Click individual hands in the grid to toggle selection

2. **Set Opponent Range**:
   - Choose opponent type from dropdown
   - Tool automatically sets appropriate range

3. **Analyze Equity**:
   - View overall range vs range equity
   - Check heatmap for individual hand performance
   - Hover over hands for detailed information

4. **Strategic Insights**:
   - Compare different range strategies
   - Understand positional play implications
   - Optimize your hand selection

## Technical Implementation

- **Vanilla JavaScript**: No external dependencies
- **CSS Grid**: Responsive layout system
- **Interactive Elements**: Real-time calculations
- **Hand Rankings**: Based on poker theory and simulations

## Hand Notation

- **Pairs**: AA, KK, QQ, etc.
- **Suited**: AKs, KQs, etc. (s = suited)
- **Offsuit**: AKo, KQo, etc. (o = offsuit)

## Getting Started

Simply open `index.html` in your web browser. No installation or setup required!

## Educational Value

This tool helps players:
- Understand hand strength relationships
- Learn proper range construction
- Visualize equity concepts
- Practice range vs range analysis
- Improve preflop decision making

Perfect for poker students, coaches, and serious players looking to improve their range analysis skills.