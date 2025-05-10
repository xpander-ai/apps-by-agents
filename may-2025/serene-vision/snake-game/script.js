/**
 * Snake Game
 * A modern implementation of the classic Snake game with multiple difficulty levels,
 * responsive design, and touch controls for mobile devices.
 */

// Game configuration
const config = {
    // Canvas dimensions
    canvasWidth: 400,
    canvasHeight: 400,
    
    // Game settings
    gridSize: 20,
    initialSnakeLength: 3,
    
    // Speed settings (milliseconds between updates)
    speeds: {
        easy: 150,
        medium: 100,
        hard: 70
    },
    
    // Colors
    colors: {
        background: '#f9f9f9',
        snake: '#4CAF50',
        snakeHead: '#388E3C',
        food: '#FF5722',
        border: '#4CAF50'
    },
    
    // Direction constants
    directions: {
        UP: { x: 0, y: -1 },
        DOWN: { x: 0, y: 1 },
        LEFT: { x: -1, y: 0 },
        RIGHT: { x: 1, y: 0 }
    }
};

// Game state
const gameState = {
    snake: [],
    food: { x: 0, y: 0 },
    direction: { ...config.directions.RIGHT },
    nextDirection: { ...config.directions.RIGHT },
    score: 0,
    highScore: 0,
    gameSpeed: config.speeds.medium,
    gameLoop: null,
    isRunning: false,
    isPaused: false,
    gameOver: false,
    lastRenderTime: 0,
    touchStartX: 0,
    touchStartY: 0
};

// DOM Elements
const elements = {
    canvas: document.getElementById('gameCanvas'),
    scoreDisplay: document.getElementById('score'),
    highScoreDisplay: document.getElementById('highScore'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    restartBtn: document.getElementById('restartBtn'),
    difficultySelect: document.getElementById('difficultySelect'),
    gameOverModal: document.getElementById('gameOverModal'),
    finalScoreDisplay: document.getElementById('finalScore'),
    directionBtns: {
        up: document.getElementById('upBtn'),
        down: document.getElementById('downBtn'),
        left: document.getElementById('leftBtn'),
        right: document.getElementById('rightBtn')
    }
};

// Get the 2D rendering context
const ctx = elements.canvas.getContext('2d');

// Initialize the game
function initGame() {
    // Set canvas dimensions
    elements.canvas.width = config.canvasWidth;
    elements.canvas.height = config.canvasHeight;
    
    // Load high score from local storage
    loadHighScore();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial render
    render();
}

// Load high score from local storage
function loadHighScore() {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
        gameState.highScore = parseInt(savedHighScore);
        elements.highScoreDisplay.textContent = gameState.highScore;
    }
}

// Save high score to local storage
function saveHighScore() {
    localStorage.setItem('snakeHighScore', gameState.highScore.toString());
}

// Set up event listeners
function setupEventListeners() {
    // Keyboard controls
    window.addEventListener('keydown', handleKeyPress);
    
    // Button controls
    elements.startBtn.addEventListener('click', startGame);
    elements.pauseBtn.addEventListener('click', togglePause);
    elements.restartBtn.addEventListener('click', restartGame);
    elements.difficultySelect.addEventListener('change', changeDifficulty);
    
    // Mobile direction buttons
    Object.keys(elements.directionBtns).forEach(key => {
        if (elements.directionBtns[key]) {
            elements.directionBtns[key].addEventListener('click', () => {
                handleDirectionButtonPress(key);
            });
        }
    });
    
    // Touch controls
    elements.canvas.addEventListener('touchstart', handleTouchStart, false);
    elements.canvas.addEventListener('touchmove', handleTouchMove, false);
    
    // Prevent scrolling when touching the canvas
    elements.canvas.addEventListener('touchmove', function(e) {
        if (gameState.isRunning) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Window resize event
    window.addEventListener('resize', handleResize);
    
    // Initial resize
    handleResize();
}

// Handle window resize
function handleResize() {
    const container = elements.canvas.parentElement;
    const containerWidth = container.clientWidth - 40; // Account for padding
    
    if (containerWidth < config.canvasWidth) {
        const scale = containerWidth / config.canvasWidth;
        elements.canvas.style.width = `${containerWidth}px`;
        elements.canvas.style.height = `${config.canvasHeight * scale}px`;
    } else {
        elements.canvas.style.width = `${config.canvasWidth}px`;
        elements.canvas.style.height = `${config.canvasHeight}px`;
    }
}

// Handle key press events
function handleKeyPress(event) {
    if (gameState.gameOver) return;
    
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { ...config.directions.UP };
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { ...config.directions.DOWN };
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { ...config.directions.LEFT };
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { ...config.directions.RIGHT };
            }
            break;
        case ' ':
            if (gameState.isRunning) {
                togglePause();
            } else if (!gameState.gameOver) {
                startGame();
            }
            break;
    }
}

// Handle direction button press
function handleDirectionButtonPress(direction) {
    if (gameState.gameOver) return;
    
    switch (direction) {
        case 'up':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { ...config.directions.UP };
            }
            break;
        case 'down':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { ...config.directions.DOWN };
            }
            break;
        case 'left':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { ...config.directions.LEFT };
            }
            break;
        case 'right':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { ...config.directions.RIGHT };
            }
            break;
    }
}

// Handle touch start event
function handleTouchStart(event) {
    if (!gameState.isRunning || gameState.gameOver) return;
    
    const touch = event.touches[0];
    gameState.touchStartX = touch.clientX;
    gameState.touchStartY = touch.clientY;
}

// Handle touch move event
function handleTouchMove(event) {
    if (!gameState.isRunning || gameState.gameOver || !gameState.touchStartX || !gameState.touchStartY) return;
    
    const touch = event.touches[0];
    const diffX = touch.clientX - gameState.touchStartX;
    const diffY = touch.clientY - gameState.touchStartY;
    
    // Determine swipe direction based on the greatest difference
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && gameState.direction.x === 0) {
            // Swipe right
            gameState.nextDirection = { ...config.directions.RIGHT };
        } else if (diffX < 0 && gameState.direction.x === 0) {
            // Swipe left
            gameState.nextDirection = { ...config.directions.LEFT };
        }
    } else {
        // Vertical swipe
        if (diffY > 0 && gameState.direction.y === 0) {
            // Swipe down
            gameState.nextDirection = { ...config.directions.DOWN };
        } else if (diffY < 0 && gameState.direction.y === 0) {
            // Swipe up
            gameState.nextDirection = { ...config.directions.UP };
        }
    }
    
    // Reset touch start position
    gameState.touchStartX = touch.clientX;
    gameState.touchStartY = touch.clientY;
}

// Change game difficulty
function changeDifficulty() {
    const difficulty = elements.difficultySelect.value;
    gameState.gameSpeed = config.speeds[difficulty];
}

// Start the game
function startGame() {
    if (gameState.isRunning && !gameState.isPaused) return;
    
    if (gameState.gameOver || !gameState.isRunning) {
        // Reset game state for a new game
        resetGame();
    }
    
    // Update UI
    elements.startBtn.disabled = true;
    elements.pauseBtn.disabled = false;
    elements.difficultySelect.disabled = true;
    
    // Start game loop
    gameState.isRunning = true;
    gameState.isPaused = false;
    gameLoop();
}

// Toggle pause state
function togglePause() {
    if (!gameState.isRunning || gameState.gameOver) return;
    
    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
        // Pause the game
        cancelAnimationFrame(gameState.gameLoop);
        elements.pauseBtn.textContent = 'Resume';
    } else {
        // Resume the game
        elements.pauseBtn.textContent = 'Pause';
        gameLoop();
    }
}

// Reset the game state
function resetGame() {
    // Reset snake
    gameState.snake = [];
    const centerX = Math.floor(config.canvasWidth / config.gridSize / 2) * config.gridSize;
    const centerY = Math.floor(config.canvasHeight / config.gridSize / 2) * config.gridSize;
    
    // Create initial snake segments
    for (let i = 0; i < config.initialSnakeLength; i++) {
        gameState.snake.push({
            x: centerX - (i * config.gridSize),
            y: centerY
        });
    }
    
    // Reset direction
    gameState.direction = { ...config.directions.RIGHT };
    gameState.nextDirection = { ...config.directions.RIGHT };
    
    // Reset score
    gameState.score = 0;
    elements.scoreDisplay.textContent = '0';
    
    // Generate initial food
    generateFood();
    
    // Reset game state flags
    gameState.gameOver = false;
    gameState.isPaused = false;
    
    // Update difficulty
    changeDifficulty();
    
    // Hide game over modal
    elements.gameOverModal.classList.remove('show');
    elements.gameOverModal.style.display = 'none';
}

// Restart the game
function restartGame() {
    elements.gameOverModal.style.display = 'none';
    elements.startBtn.disabled = false;
    elements.pauseBtn.disabled = true;
    elements.pauseBtn.textContent = 'Pause';
    elements.difficultySelect.disabled = false;
    
    gameState.isRunning = false;
    resetGame();
    render();
}

// Generate food at a random position
function generateFood() {
    // Calculate grid dimensions
    const gridWidth = config.canvasWidth / config.gridSize;
    const gridHeight = config.canvasHeight / config.gridSize;
    
    // Generate random position
    let newFood;
    let foodOnSnake;
    
    do {
        foodOnSnake = false;
        newFood = {
            x: Math.floor(Math.random() * gridWidth) * config.gridSize,
            y: Math.floor(Math.random() * gridHeight) * config.gridSize
        };
        
        // Check if food is on snake
        for (const segment of gameState.snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);
    
    gameState.food = newFood;
}

// Main game loop
function gameLoop(currentTime) {
    if (gameState.gameOver || gameState.isPaused) return;
    
    gameState.gameLoop = requestAnimationFrame(gameLoop);
    
    // Calculate time since last update
    if (!currentTime) {
        gameState.lastRenderTime = performance.now();
        return;
    }
    
    const timeSinceLastRender = currentTime - gameState.lastRenderTime;
    
    // Only update at the specified game speed
    if (timeSinceLastRender < gameState.gameSpeed) return;
    
    gameState.lastRenderTime = currentTime;
    
    update();
    render();
}

// Update game state
function update() {
    // Update direction
    gameState.direction = { ...gameState.nextDirection };
    
    // Create new head
    const head = { ...gameState.snake[0] };
    head.x += gameState.direction.x * config.gridSize;
    head.y += gameState.direction.y * config.gridSize;
    
    // Check for collision with walls
    if (
        head.x < 0 || 
        head.x >= config.canvasWidth || 
        head.y < 0 || 
        head.y >= config.canvasHeight
    ) {
        endGame();
        return;
    }
    
    // Check for collision with self
    for (let i = 0; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            endGame();
            return;
        }
    }
    
    // Add new head to snake
    gameState.snake.unshift(head);
    
    // Check for food collision
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        // Increase score
        gameState.score += 10;
        elements.scoreDisplay.textContent = gameState.score;
        
        // Generate new food
        generateFood();
    } else {
        // Remove tail if no food was eaten
        gameState.snake.pop();
    }
}

// Render the game
function render() {
    // Clear canvas
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
    
    // Draw border
    ctx.strokeStyle = config.colors.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, config.canvasWidth, config.canvasHeight);
    
    // Draw snake
    gameState.snake.forEach((segment, index) => {
        // Use different color for head
        ctx.fillStyle = index === 0 ? config.colors.snakeHead : config.colors.snake;
        
        ctx.fillRect(segment.x, segment.y, config.gridSize, config.gridSize);
        
        // Add inner border to segments for better visibility
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(segment.x, segment.y, config.gridSize, config.gridSize);
    });
    
    // Draw food
    ctx.fillStyle = config.colors.food;
    ctx.beginPath();
    const foodRadius = config.gridSize / 2;
    ctx.arc(
        gameState.food.x + foodRadius,
        gameState.food.y + foodRadius,
        foodRadius,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// End the game
function endGame() {
    gameState.gameOver = true;
    gameState.isRunning = false;
    cancelAnimationFrame(gameState.gameLoop);
    
    // Update high score if needed
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        elements.highScoreDisplay.textContent = gameState.highScore;
        saveHighScore();
    }
    
    // Update UI
    elements.startBtn.disabled = false;
    elements.pauseBtn.disabled = true;
    elements.difficultySelect.disabled = false;
    elements.finalScoreDisplay.textContent = gameState.score;
    
    // Show game over modal
    elements.gameOverModal.style.display = 'flex';
    elements.gameOverModal.classList.add('show');
}

// Initialize the game when the page loads
window.addEventListener('load', initGame);