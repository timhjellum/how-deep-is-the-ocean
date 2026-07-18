# 🎮 Breakout Game

A modern, feature-rich Breakout game built with HTML5 Canvas and JavaScript. Experience the classic arcade game with beautiful visuals, smooth animations, and engaging gameplay across 10 unique levels.

## ✨ Features

### 🎯 Gameplay
- **10 Unique Levels**: Each level features different brick patterns and increasing difficulty
- **Multi-Ball Support**: Powerups can create multiple balls for exciting gameplay
- **Progressive Difficulty**: Levels get harder with more bricks, health, and complex patterns
- **Smooth Physics**: Realistic ball physics with angle-based paddle hits

### 🎨 Visual Effects
- **Gradient Animations**: Beautiful color-shifting title and UI elements
- **Ball Trails**: Smooth trailing effects on the ball
- **Glow Effects**: Paddle and powerup glow animations
- **Brick Health Indicators**: Visual feedback for multi-health bricks
- **Pulse Effects**: Dynamic visual feedback on collisions

### 🔊 Audio System
- **Web Audio API**: High-quality synthesized sound effects
- **Contextual Sounds**: Different sounds for walls, paddle, bricks, and powerups
- **Victory/Defeat Themes**: Musical sequences for game events

### 🚀 Powerups
- **Widen Paddle** (W): Makes paddle wider for easier gameplay
- **Narrow Paddle** (N): Makes paddle narrower for challenge
- **Slow Ball** (S): Reduces ball speed for precision
- **Fast Ball** (F): Increases ball speed for excitement
- **Multi-Ball** (M): Creates additional balls for chaos!

### 🎮 Controls
- **Arrow Keys** or **A/D**: Move paddle left/right
- **Spacebar**: Launch ball or start game
- **Mouse/Touch**: Responsive touch controls for mobile

## 🎯 Level Design

### Level 1-3: Introduction
- **Level 1**: Simple grid pattern - learn the basics
- **Level 2**: Pyramid pattern - introduces strategic thinking
- **Level 3**: Inverted pyramid - challenges angle control

### Level 4-6: Intermediate
- **Level 4**: Checkerboard pattern - requires precision
- **Level 5**: Multi-health bricks - introduces durability mechanics
- **Level 6**: Spiral pattern - complex brick placement

### Level 7-9: Advanced
- **Level 7**: Diamond pattern - strategic gaps and angles
- **Level 8**: Zigzag pattern - multi-health challenge
- **Level 9**: Complex gaps - requires careful planning

### Level 10: Boss Level
- **Final Challenge**: Maximum difficulty with complex patterns and high-health bricks

## 🛠️ Technical Features

### Performance
- **60 FPS Game Loop**: Smooth, responsive gameplay
- **Efficient Collision Detection**: Optimized for multiple balls
- **Memory Management**: Proper cleanup of destroyed objects

### Responsive Design
- **Mobile-Friendly**: Works on tablets and phones
- **Adaptive Canvas**: Scales to different screen sizes
- **Touch Controls**: Optimized for touch devices

### Modern Web Standards
- **ES6+ JavaScript**: Modern syntax and features
- **HTML5 Canvas**: Hardware-accelerated rendering
- **CSS3 Animations**: Smooth UI transitions
- **Web Audio API**: High-quality sound synthesis

## 🚀 Quick Start

1. **Clone or Download** the project files
2. **Open `index.html`** in a modern web browser
3. **Click "START GAME"** or press Spacebar
4. **Use arrow keys** to move the paddle
5. **Press Spacebar** to launch the ball
6. **Collect powerups** for special abilities
7. **Complete all 10 levels** to win!

## 📁 Project Structure

```
breakout-like/
├── index.html              # Main game page
├── styles/
│   └── main.css           # Game styling and animations
├── scripts/
│   ├── game.js            # Main game controller
│   ├── ball.js            # Ball physics and rendering
│   ├── paddle.js          # Paddle controls and effects
│   ├── bricks.js          # Brick management and levels
│   ├── powerups.js        # Powerup system
│   └── sound.js           # Audio effects manager
└── README.md              # This file
```

## 🎮 Game Mechanics

### Scoring System
- **Basic Bricks**: 10-60 points based on level
- **Multi-Health Bricks**: Points × health remaining
- **Powerup Collection**: Bonus points for special abilities

### Lives System
- **3 Lives**: Start with 3 lives
- **Ball Loss**: Lose a life when all balls fall
- **Level Completion**: No life bonus (challenge mode)

### Powerup System
- **10% Drop Rate**: Random powerup drops from destroyed bricks
- **Duration**: Most powerups are permanent until level completion
- **Stacking**: Multiple powerups can be active simultaneously

## 🌐 Deployment

### Local Testing
```bash
# Simply open index.html in a browser
# Or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

### GitHub Pages Deployment
1. **Push to GitHub**: Upload all files to a GitHub repository
2. **Enable Pages**: Go to Settings → Pages → Source → Deploy from branch
3. **Select Branch**: Choose main/master branch
4. **Access URL**: Your game will be available at `https://username.github.io/repository-name`

### Netlify Deployment
1. **Drag & Drop**: Upload the project folder to Netlify
2. **Auto-Deploy**: Changes to GitHub will auto-deploy
3. **Custom Domain**: Optionally add a custom domain

## 🔧 Customization

### Adding New Levels
Edit `scripts/bricks.js` and add new level creation methods:
```javascript
createLevel11() {
    // Your custom level design
    const colors = ['#your', '#colors'];
    // Add brick creation logic
}
```

### Modifying Powerups
Edit `scripts/powerups.js` to add new powerup types:
```javascript
case 'newpowerup':
    this.color = '#yourcolor';
    this.symbol = 'X';
    break;
```

### Adjusting Difficulty
Modify these parameters in `scripts/game.js`:
- `this.lives = 3` - Starting lives
- `this.ball.speed = 5` - Ball speed
- `this.paddle.speed = 8` - Paddle speed

## 🐛 Troubleshooting

### Common Issues
- **No Sound**: Check browser audio permissions
- **Slow Performance**: Close other browser tabs
- **Touch Not Working**: Ensure mobile browser supports touch events

### Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile Browsers**: Touch controls supported

## 📝 License

This project is open source and available under the MIT License. Feel free to modify, distribute, and use for educational or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new levels
- Improve visual effects
- Add new powerups
- Optimize performance
- Fix bugs

---

**Enjoy the game! 🎮✨** 