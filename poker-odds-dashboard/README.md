# 🎰 Poker Odds Visualization Dashboard

A real-time, animated poker odds visualization dashboard featuring beautiful progress bars, pie charts, probability meters, hand strength indicators, and equity graphs. Built with vanilla JavaScript and Chart.js for smooth, dynamic updates.

## ✨ Features

### 📊 Real-Time Odds Visualization
- **Animated Progress Bars**: Win/Tie/Lose percentages with smooth transitions and shine effects
- **Interactive Pie Charts**: Dynamic probability distribution with animated updates
- **Probability Meters**: Circular gauges showing equity and hand strength with rotation animations

### 🎯 Hand Analysis Tools
- **Hand Strength Indicator**: Visual ranking system from High Card to Straight Flush
- **Outs Counter**: Shows improving cards with visual card highlights and floating animations
- **Current Hand Display**: Real-time hand evaluation with glowing effects

### 📈 Advanced Analytics
- **Equity Timeline Graph**: Line chart showing equity changes across all streets (Pre-flop → River)
- **Street-by-Street Analysis**: Detailed breakdown of odds progression
- **Dynamic Card Rendering**: Realistic playing cards with hover effects and suit colors

### 🎨 Beautiful Animations
- **Gradient Backgrounds**: Animated color transitions and glass morphism effects
- **Card Animations**: 3D hover effects, pulse animations, and floating movements
- **Smooth Transitions**: All metrics update with cubic-bezier easing functions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection (for Chart.js CDN)

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Start exploring poker odds!

### Usage
1. **Deal New Hand**: Click "Deal New Hand" to get fresh hole cards
2. **Progress Streets**: Click "Next Street" to advance from Pre-flop → Flop → Turn → River
3. **Watch Live Updates**: All charts and metrics update automatically as cards are revealed
4. **Analyze Hands**: Monitor hand strength, outs, and equity changes in real-time

## 🎮 Dashboard Components

### 📋 Cards Section
- **Player Cards**: Your hole cards with suit-colored display
- **Community Cards**: Board cards with placeholder cards for unrevealed streets
- **Card Highlighting**: Special effects for cards that improve your hand

### 📊 Odds Section
- **Progress Bars**: Animated bars for Win/Tie/Lose probabilities
- **Pie Chart**: Donut chart with smooth rotation animations
- **Live Meters**: Circular gauges for equity and hand strength

### 🔍 Analysis Section
- **Hand Strength Ladder**: Visual indicator showing current hand ranking
- **Outs Display**: Shows cards that can improve your hand
- **Real-time Updates**: All analysis updates dynamically with card changes

### 📈 Equity Graph
- **Timeline Visualization**: Line chart showing equity progression
- **Street Markers**: Clear indicators for Pre-flop, Flop, Turn, River
- **Smooth Animations**: Fluid transitions between data points

## 🛠 Technical Features

### Performance Optimizations
- **Efficient Calculations**: Optimized poker hand evaluation algorithms
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Responsive Charts**: Dynamic chart updates without recreation
- **Memory Management**: Proper cleanup of animation intervals

### Animation System
- **CSS Keyframes**: Complex animations for cards, progress bars, and meters
- **JavaScript Transitions**: Coordinated timing for multiple element updates
- **Easing Functions**: Professional cubic-bezier transitions
- **Performance Monitoring**: Optimized for 60 FPS rendering

### Chart.js Integration
- **Real-time Updates**: Charts update without destroying/recreating
- **Custom Styling**: Dark theme with poker-appropriate colors
- **Responsive Design**: Charts adapt to container size changes
- **Animation Callbacks**: Coordinated animations with other dashboard elements

## 🎨 Design System

### Color Palette
- **Win**: Green gradients (#51cf66 → #40c057)
- **Tie**: Yellow gradients (#ffd43b → #fab005)  
- **Lose**: Red gradients (#ff6b6b → #e03131)
- **Accent**: Blue gradients (#4dabf7 → #74c0fc)
- **Background**: Dark theme with glass morphism effects

### Typography
- **Primary Font**: Segoe UI system font stack
- **Sizes**: Responsive typography from 0.9rem to 3rem
- **Weights**: Strategic use of 400, 600, and 700 weights
- **Colors**: High contrast white text on dark backgrounds

## 🔮 Future Enhancements

### Planned Features
- **Multi-Player Support**: Compare odds against multiple opponents
- **Historical Analysis**: Track and analyze hand history
- **Advanced Calculations**: Monte Carlo simulations for precise odds
- **Tournament Mode**: ICM calculations and bubble factors
- **Export Features**: Save equity graphs and hand analysis

### Technical Improvements
- **WebGL Rendering**: 3D card animations and effects
- **WebWorkers**: Background calculations for complex odds
- **PWA Features**: Offline mode and app installation
- **Real-time Multiplayer**: WebSocket integration for live games

## 📱 Browser Compatibility

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests for:
- Bug fixes and performance improvements
- New visualization types and chart options
- Enhanced poker logic and hand evaluation
- Mobile optimization and accessibility features
- Additional animation effects and transitions

## 📄 License

This project is open source and available under the MIT License.

---

*Enjoy exploring poker odds with beautiful, real-time visualizations! 🎰✨*