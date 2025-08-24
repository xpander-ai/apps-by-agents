# Real-time Poker Odds Dashboard

A comprehensive, animated dashboard for visualizing poker odds and probabilities in real-time. This application provides beautiful, smooth animations and multiple visualization methods to analyze poker hands and game states.

## ✨ Features

### 🎯 **Real-time Odds Visualization**
- **Animated Progress Bars**: Win/Tie/Lose percentages with smooth transitions and shimmer effects
- **Interactive Pie Charts**: Dynamic SVG-based probability breakdown with animated arcs
- **Probability Meters**: Gradient-filled gauges showing win probability and hand strength

### 🃏 **Hand Analysis**
- **Hand Strength Indicators**: Visual meter showing relative hand strength (Very Weak to Very Strong)
- **Card Visualization**: Beautifully rendered playing cards with suit colors and hover effects
- **Street Progression**: Deal through Preflop → Flop → Turn → River with realistic timing

### 🎲 **Advanced Analytics**
- **Outs Counter**: Visual display of remaining cards that improve your hand
- **Out Cards Highlight**: Individual card visualization with pulsing animations
- **Improvement Probability**: Real-time percentage chance calculations

### 📊 **Equity Graphs**
- **Dynamic Line Charts**: HTML5 Canvas-based equity tracking across streets
- **Player vs Opponent**: Dual-line visualization showing equity changes
- **Grid System**: Professional chart layout with labeled axes

### 🎨 **Beautiful UI/UX**
- **Smooth Animations**: CSS transitions and keyframe animations throughout
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Professional Theme**: Dark poker table aesthetic with gold accents
- **Hand History**: Real-time logging of actions with timestamps

## 🚀 **Getting Started**

1. **Open the Application**
   ```bash
   open index.html
   ```

2. **Deal Your First Hand**
   - Click "Deal New Hand" to receive pocket cards
   - Watch all metrics update with smooth animations

3. **Progress Through Streets**
   - Click "Next Street" to reveal the flop, turn, and river
   - Observe how odds change dynamically with each card

4. **Analyze Your Hand**
   - Monitor win/tie/lose probabilities in real-time
   - Track hand strength and improvement potential
   - Study equity changes via the interactive graph

## 🎮 **How to Use**

### **Controls**
- **Deal New Hand**: Start a fresh poker hand with new cards
- **Next Street**: Progress from preflop → flop → turn → river
- **Reset Game**: Clear all data and return to initial state

### **Dashboard Sections**

1. **Player Hand**: Your two hole cards with strength indicator
2. **Community Cards**: Five-card board (revealed progressively)  
3. **Progress Bars**: Animated win/tie/lose percentages
4. **Pie Chart**: Circular probability visualization
5. **Probability Meters**: Gradient-filled percentage gauges
6. **Outs Counter**: Number of cards that improve your hand
7. **Equity Graph**: Line chart tracking equity across streets
8. **Hand History**: Chronological log of all actions

## 🎨 **Animation Features**

### **Visual Effects**
- **Fade-in Animations**: Cards appear with staggered timing
- **Shimmer Effects**: Progress bars have moving highlight overlays  
- **Pulse Animations**: Out cards glow to highlight improvement potential
- **Smooth Transitions**: All numeric changes use easing functions
- **Color Gradients**: Win (green), Tie (orange), Lose (red) color coding

### **Performance Optimized**
- **Hardware Acceleration**: CSS transforms for smooth 60fps animations
- **Staggered Timing**: Elements animate in sequence for visual polish
- **Efficient Updates**: Only changed elements are re-rendered

## 🛠 **Technical Details**

### **Technologies Used**
- **HTML5**: Semantic structure and Canvas for charts
- **CSS3**: Advanced animations, gradients, and responsive design  
- **Vanilla JavaScript**: ES6+ with class-based architecture
- **SVG**: Scalable vector graphics for pie charts

### **Browser Support**
- Chrome, Firefox, Safari, Edge (modern versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## 🎯 **Customization**

The dashboard is built with modular CSS and JavaScript, making it easy to:
- Adjust animation timing and easing curves
- Modify color schemes and themes
- Add new visualization types
- Integrate with poker APIs or databases
- Extend with additional metrics and analysis

## 📱 **Responsive Design**

- **Desktop**: Full dashboard with all features
- **Tablet**: Optimized layout with stacked components  
- **Mobile**: Compact view with essential metrics
- **Touch-friendly**: Large buttons and touch targets

## 🎪 **Demo Features**

Since this is a demonstration dashboard, it includes:
- Simulated odds calculations (real implementation would use Monte Carlo)
- Random but realistic probability distributions
- Progressive revelation of community cards
- Animated transitions between all game states

---

**🎲 Ready to analyze some poker hands? Open `index.html` and start dealing!**