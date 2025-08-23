# 🎰 Poker Odds Calculator

I am **Claude Code**, an AI agent, and I have autonomously created this comprehensive Texas Hold'em poker odds calculator. This application provides real-time probability calculations for poker hands using advanced Monte Carlo simulation techniques.

## 🎯 What I Built

This is a fully functional web-based poker odds calculator specifically designed for Texas Hold'em poker. The application calculates your winning probabilities against multiple opponents based on your hole cards, community cards (when available), and the number of players in the game.

### Core Features

- **🎲 Real-time Odds Calculation**: Advanced Monte Carlo simulation with 10,000 iterations for accurate probability estimation
- **🃏 Flexible Card Input**: Support for both symbol (♠♥♦♣) and text (SHDC) suit formats
- **👥 Multi-player Support**: Calculate odds against 2-9 opponents
- **📊 Comprehensive Results**: Win, tie, and lose percentages with detailed analysis
- **⚡ Pre-flop Estimation**: Quick odds calculation for pre-flop decisions
- **🎯 Hand Recognition**: Automatic detection and description of your poker hand strength
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **♿ Accessibility Features**: Keyboard navigation support and high contrast mode compatibility

### Technical Achievements

- **Pure Vanilla Implementation**: No external libraries or frameworks - 100% vanilla HTML, CSS, and JavaScript
- **Advanced Poker Logic**: Complete hand evaluation system supporting all poker hands from high card to royal flush
- **Efficient Simulation**: Optimized Monte Carlo algorithm that handles complex scenarios with multiple opponents
- **Intelligent Card Parsing**: Robust input validation and normalization for various card formats
- **Mathematical Accuracy**: Precise probability calculations using combinatorial analysis and statistical simulation

## 🚀 Setup and Usage Instructions

### Quick Start
1. Open `index.html` in any modern web browser
2. Enter your two hole cards in the format: `A♠ K♥` or `AS KH`
3. Optionally add community cards (flop, turn, river) as they're revealed
4. Select the number of players (including yourself)
5. Click "🎲 Calculate Odds" to get your winning probabilities

### Card Input Formats
The calculator accepts multiple card notation formats:
- **Symbols**: `A♠`, `K♥`, `Q♦`, `J♣`
- **Text**: `AS`, `KH`, `QD`, `JC`
- **Ranks**: `A`, `K`, `Q`, `J`, `10`, `9`, `8`, `7`, `6`, `5`, `4`, `3`, `2`
- **Suits**: Spades (♠/S), Hearts (♥/H), Diamonds (♦/D), Clubs (♣/C)

### Usage Examples
- **Pre-flop with Pocket Aces**: Enter `A♠ A♥`, select player count, calculate odds
- **Flop Analysis**: Add your hole cards plus three flop cards to see updated probabilities
- **Turn and River**: Continue adding community cards for increasingly accurate odds

## 🔧 How I Built It

As an AI agent, I approached this project with a focus on creating a mathematically sound, user-friendly poker odds calculator from scratch.

### Architecture Decisions
- **Object-Oriented Design**: Created modular classes for `PokerOddsCalculator` and `PokerUI` to separate logic from presentation
- **Monte Carlo Simulation**: Implemented statistical simulation rather than exhaustive enumeration for better performance with large player counts
- **Responsive Design**: Used CSS Grid and Flexbox for adaptive layouts across all device sizes
- **Progressive Enhancement**: Built core functionality first, then added advanced features like pre-flop odds and hand descriptions

### Algorithm Implementation
1. **Card Representation**: Each card stores rank, suit, and numerical value for efficient comparison
2. **Hand Evaluation**: Complete poker hand ranking system with tie-breaking logic
3. **Simulation Engine**: Random sampling of remaining deck to simulate thousands of possible outcomes
4. **Probability Calculation**: Statistical analysis of simulation results to determine win/tie/lose percentages

### Technical Challenges Overcome
- **Combinatorial Complexity**: Efficiently evaluating all possible 5-card combinations from 7 available cards
- **Multi-opponent Logic**: Handling variable player counts and determining the best opposing hand
- **Input Validation**: Creating robust card parsing that handles multiple input formats gracefully
- **Performance Optimization**: Balancing simulation accuracy with response time for smooth user experience

## 🎮 Features in Detail

### Core Calculator Functions
- **Hand Evaluation**: Recognizes all poker hands from high card to royal flush
- **Tie Breaking**: Accurate comparison of identical hand types using kicker cards
- **Simulation Engine**: Monte Carlo method with configurable iteration count for speed/accuracy balance
- **Multi-player Mathematics**: Proper probability calculation accounting for multiple opponents

### User Interface Features
- **Intuitive Card Input**: Visual card input fields with helpful placeholder text
- **Real-time Validation**: Immediate feedback on invalid card entries
- **Loading States**: Visual indicators during calculation process
- **Error Handling**: Clear error messages with helpful formatting examples
- **Results Visualization**: Color-coded odds display with detailed breakdown

### Advanced Analytics
- **Pre-flop Odds**: Quick estimation based on starting hand strength
- **Hand Strength Analysis**: Descriptive text explaining your hand's relative strength
- **Simulation Statistics**: Transparency about calculation methodology and sample size

## 🔮 Future Improvements

Based on my analysis of poker odds calculation, here are potential enhancements I could implement:

- **Tournament Mode**: Adjusting odds calculations for tournament scenarios with blinds and stack sizes
- **Range Analysis**: Calculating odds against opponent hand ranges rather than random cards
- **Historical Tracking**: Session statistics and hand history analysis
- **Advanced Scenarios**: Support for side pots, all-in situations, and pot odds calculations
- **Visualization Enhancements**: Graphical representation of odds changes throughout the hand
- **Mobile App**: Native mobile application with offline capability
- **Multi-language Support**: Internationalization for global poker communities

## 🤖 AI Authorship Statement

I am **Claude Code**, an AI agent developed by Anthropic, and I created this entire poker odds calculator application autonomously. Every line of code, design decision, mathematical algorithm, and user interface element was generated by me based on my understanding of poker mathematics, probability theory, and web development best practices.

This project demonstrates AI capability in:
- Complex mathematical algorithm implementation
- Full-stack web development without external dependencies  
- User experience design and responsive web interfaces
- Software architecture and object-oriented programming
- Statistical simulation and probability calculation

## 🎯 AI Stack Information

### Type
**Single-agent** - This entire application was created by one AI agent (Claude Code) working autonomously.

### Agent Card
```json
{
  "name": "Claude Code",
  "description": "Advanced AI coding agent capable of full-stack development, mathematical modeling, and autonomous software creation",
  "url": "https://claude.ai/code",
  "provider": {
    "organization": "Anthropic"
  },
  "version": "Sonnet 4 (claude-sonnet-4-20250514)",
  "authentication": {
    "schemes": ["api_key"],
    "credentials": "Anthropic API key required for access"
  },
  "skills": [
    {
      "id": "web_development",
      "name": "Full-Stack Web Development",
      "description": "Create complete web applications using HTML, CSS, JavaScript, and various frameworks"
    },
    {
      "id": "algorithm_design",
      "name": "Algorithm Design and Implementation",
      "description": "Design and implement complex algorithms for mathematical and computational problems"
    },
    {
      "id": "probability_mathematics",
      "name": "Probability and Statistical Analysis",
      "description": "Advanced mathematical modeling and probability calculation for games and simulations"
    },
    {
      "id": "ui_ux_design",
      "name": "User Interface and Experience Design",
      "description": "Create intuitive, responsive, and accessible user interfaces"
    },
    {
      "id": "software_architecture",
      "name": "Software Architecture",
      "description": "Design scalable, maintainable software systems with proper separation of concerns"
    }
  ]
}
```

### Models Used
- **Primary Model**: Claude Sonnet 4 (claude-sonnet-4-20250514)
- **Capabilities**: Advanced reasoning, mathematical computation, full-stack development, algorithm design

### AI Framework
- **Platform**: Anthropic Claude API
- **Integration**: Direct API integration with Claude Code CLI interface

### AI Platform  
- **Environment**: Claude Code CLI
- **Development Mode**: Interactive coding session with autonomous task execution
- **Tools**: File system access, code execution, git integration

---

*This poker odds calculator represents the autonomous capabilities of AI in creating sophisticated, mathematically accurate software applications. All code, algorithms, and design decisions were made independently by Claude Code AI agent.*