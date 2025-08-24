# Advanced Poker Odds Calculator

A sophisticated poker odds calculator with Monte Carlo simulation, advanced settings, and results history tracking.

## Features

### Core Functionality
- **Texas Hold'em Odds Calculation**: Calculate win probabilities for your hand against multiple opponents
- **Monte Carlo Simulation**: High-accuracy simulations with configurable iterations (1K-100K)
- **Real-time Hand Evaluation**: Instant feedback on hand strength and winning chances
- **Community Cards Support**: Calculate odds pre-flop, flop, turn, and river

### Advanced Settings Panel
- **Collapsible Interface**: Expandable settings section to keep the UI clean
- **Iteration Slider**: Adjust simulation accuracy from 1,000 to 100,000 iterations
- **Advanced Calculations Toggle**: Enable/disable specific calculation types:
  - Pot Odds Analysis
  - Implied Odds
  - Position Analysis  
  - Range Analysis
- **Preset Configurations**:
  - **Quick Mode**: 1K iterations, basic calculations for fast results
  - **Accurate Mode**: 10K iterations with most calculations enabled (default)
  - **Tournament Mode**: 50K iterations with all calculations for maximum precision

### Results History
- **Persistent Storage**: All calculations saved locally with timestamps
- **Favorite System**: Star important calculations for easy reference
- **Detailed Records**: Stores hand, board, opponents, results, and settings used
- **Export Functionality**: Download history as CSV for external analysis
- **Search and Filter**: Easy browsing of calculation history

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Card Validation**: Prevents duplicate card selection with visual feedback
- **Modern UI**: Clean, professional interface with smooth animations
- **Accessibility**: Keyboard navigation and screen reader friendly

## How to Use

### Basic Calculation
1. Select your two hole cards from the dropdown menus
2. Set the number of opponents (1-9)
3. Optionally select community cards (flop, turn, river)
4. Click "Calculate Odds" to run the simulation

### Advanced Settings
1. Click on "Advanced Settings" to expand the panel
2. Adjust Monte Carlo iterations using the slider
3. Toggle advanced calculation features on/off
4. Select a preset configuration or customize your own
5. Settings are remembered for future calculations

### Managing History
1. All calculations are automatically saved to history
2. Click the star icon to favorite important calculations
3. Use the delete (×) button to remove unwanted entries
4. Export your history to CSV for analysis
5. Clear all history when needed

## Technical Details

### Monte Carlo Simulation
The calculator uses Monte Carlo simulation to estimate probabilities by:
- Dealing random cards from the remaining deck
- Completing opponent hands and community cards
- Evaluating all hands using standard poker rules
- Calculating win/tie percentages across thousands of simulations

### Hand Evaluation
Implements complete poker hand ranking:
- Royal Flush, Straight Flush, Four of a Kind
- Full House, Flush, Straight
- Three of a Kind, Two Pair, One Pair
- High Card with proper kicker evaluation

### Data Storage
- Uses localStorage for persistent history storage
- Automatically manages storage limits (50 calculations max)
- Exports data in CSV format for external tools

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance
- Quick Mode: ~50ms calculation time
- Accurate Mode: ~200ms calculation time  
- Tournament Mode: ~1-2s calculation time

## Future Enhancements
- Opponent range assignment
- ICM calculations for tournaments
- Hand vs. hand comparisons
- Preflop charts and recommendations
- Multi-table tournament scenarios