document.addEventListener('DOMContentLoaded', () => {
    // Game variables
    let grid = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let gameOver = false;
    let gameWon = false;
    let canMove = true;
    
    // DOM elements
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const tileContainer = document.querySelector('.tile-container');
    const gameMessage = document.querySelector('.game-message');
    const messageText = gameMessage.querySelector('p');
    const newGameButton = document.getElementById('new-game-button');
    const retryButton = document.querySelector('.retry-button');
    
    // Initialize the game
    function initGame() {
        // Reset variables
        grid = createEmptyGrid();
        score = 0;
        gameOver = false;
        gameWon = false;
        canMove = true;
        
        // Update displays
        scoreDisplay.textContent = '0';
        bestScoreDisplay.textContent = bestScore;
        
        // Clear the tile container
        tileContainer.innerHTML = '';
        
        // Hide game message
        gameMessage.style.display = 'none';
        
        // Add initial tiles
        addRandomTile();
        addRandomTile();
    }
    
    // Create an empty 4x4 grid
    function createEmptyGrid() {
        const newGrid = [];
        for (let i = 0; i < 4; i++) {
            newGrid[i] = [0, 0, 0, 0];
        }
        return newGrid;
    }
    
    // Add a random tile (2 or 4) to an empty cell
    function addRandomTile() {
        const emptyCells = [];
        
        // Find all empty cells
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        // If there are empty cells
        if (emptyCells.length > 0) {
            // Choose a random empty cell
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            
            // Set the value (90% chance for 2, 10% chance for 4)
            const value = Math.random() < 0.9 ? 2 : 4;
            grid[randomCell.row][randomCell.col] = value;
            
            // Create and add the tile element
            createTileElement(randomCell.row, randomCell.col, value);
        }
    }
    
    // Create a tile DOM element
    function createTileElement(row, col, value) {
        const tile = document.createElement('div');
        tile.className = `tile tile-${value}`;
        tile.textContent = value;
        
        // Position the tile
        positionTile(tile, row, col);
        
        // Add to the container
        tileContainer.appendChild(tile);
    }
    
    // Position a tile based on its row and column
    function positionTile(tile, row, col) {
        const cellSize = 25; // 25% of container width
        const cellGap = 15; // 15px gap between cells
        
        // Calculate position
        const x = col * (cellSize + cellGap / 4);
        const y = row * (cellSize + cellGap / 4);
        
        // Set position
        tile.style.top = `${y}%`;
        tile.style.left = `${x}%`;
    }
    
    // Update the grid display
    function updateGrid() {
        // Clear the tile container
        tileContainer.innerHTML = '';
        
        // Create tiles for each cell with a value
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (grid[row][col] !== 0) {
                    createTileElement(row, col, grid[row][col]);
                }
            }
        }
    }
    
    // Move tiles in a direction
    function moveTiles(direction) {
        if (!canMove || gameOver) return false;
        
        let moved = false;
        canMove = false;
        
        // Clone the grid for comparison
        const previousGrid = JSON.parse(JSON.stringify(grid));
        
        // Process the grid based on direction
        switch (direction) {
            case 'up':
                moved = moveUp();
                break;
            case 'right':
                moved = moveRight();
                break;
            case 'down':
                moved = moveDown();
                break;
            case 'left':
                moved = moveLeft();
                break;
        }
        
        // If tiles moved, add a new random tile
        if (moved) {
            setTimeout(() => {
                addRandomTile();
                
                // Check if game is over
                if (isGameOver()) {
                    gameOver = true;
                    showGameOver();
                }
                
                canMove = true;
            }, 150);
        } else {
            canMove = true;
        }
        
        return moved;
    }
    
    // Move tiles up
    function moveUp() {
        let moved = false;
        
        for (let col = 0; col < 4; col++) {
            // Process each column from top to bottom
            for (let row = 1; row < 4; row++) {
                if (grid[row][col] !== 0) {
                    let currentRow = row;
                    
                    // Move the tile up as far as possible
                    while (currentRow > 0 && grid[currentRow - 1][col] === 0) {
                        grid[currentRow - 1][col] = grid[currentRow][col];
                        grid[currentRow][col] = 0;
                        currentRow--;
                        moved = true;
                    }
                    
                    // Check for merge
                    if (currentRow > 0 && grid[currentRow - 1][col] === grid[currentRow][col]) {
                        grid[currentRow - 1][col] *= 2;
                        grid[currentRow][col] = 0;
                        moved = true;
                        
                        // Update score
                        updateScore(grid[currentRow - 1][col]);
                        
                        // Check for win
                        if (grid[currentRow - 1][col] === 2048 && !gameWon) {
                            gameWon = true;
                            showGameWon();
                        }
                    }
                }
            }
        }
        
        if (moved) {
            updateGrid();
        }
        
        return moved;
    }
    
    // Move tiles right
    function moveRight() {
        let moved = false;
        
        for (let row = 0; row < 4; row++) {
            // Process each row from right to left
            for (let col = 2; col >= 0; col--) {
                if (grid[row][col] !== 0) {
                    let currentCol = col;
                    
                    // Move the tile right as far as possible
                    while (currentCol < 3 && grid[row][currentCol + 1] === 0) {
                        grid[row][currentCol + 1] = grid[row][currentCol];
                        grid[row][currentCol] = 0;
                        currentCol++;
                        moved = true;
                    }
                    
                    // Check for merge
                    if (currentCol < 3 && grid[row][currentCol + 1] === grid[row][currentCol]) {
                        grid[row][currentCol + 1] *= 2;
                        grid[row][currentCol] = 0;
                        moved = true;
                        
                        // Update score
                        updateScore(grid[row][currentCol + 1]);
                        
                        // Check for win
                        if (grid[row][currentCol + 1] === 2048 && !gameWon) {
                            gameWon = true;
                            showGameWon();
                        }
                    }
                }
            }
        }
        
        if (moved) {
            updateGrid();
        }
        
        return moved;
    }
    
    // Move tiles down
    function moveDown() {
        let moved = false;
        
        for (let col = 0; col < 4; col++) {
            // Process each column from bottom to top
            for (let row = 2; row >= 0; row--) {
                if (grid[row][col] !== 0) {
                    let currentRow = row;
                    
                    // Move the tile down as far as possible
                    while (currentRow < 3 && grid[currentRow + 1][col] === 0) {
                        grid[currentRow + 1][col] = grid[currentRow][col];
                        grid[currentRow][col] = 0;
                        currentRow++;
                        moved = true;
                    }
                    
                    // Check for merge
                    if (currentRow < 3 && grid[currentRow + 1][col] === grid[currentRow][col]) {
                        grid[currentRow + 1][col] *= 2;
                        grid[currentRow][col] = 0;
                        moved = true;
                        
                        // Update score
                        updateScore(grid[currentRow + 1][col]);
                        
                        // Check for win
                        if (grid[currentRow + 1][col] === 2048 && !gameWon) {
                            gameWon = true;
                            showGameWon();
                        }
                    }
                }
            }
        }
        
        if (moved) {
            updateGrid();
        }
        
        return moved;
    }
    
    // Move tiles left
    function moveLeft() {
        let moved = false;
        
        for (let row = 0; row < 4; row++) {
            // Process each row from left to right
            for (let col = 1; col < 4; col++) {
                if (grid[row][col] !== 0) {
                    let currentCol = col;
                    
                    // Move the tile left as far as possible
                    while (currentCol > 0 && grid[row][currentCol - 1] === 0) {
                        grid[row][currentCol - 1] = grid[row][currentCol];
                        grid[row][currentCol] = 0;
                        currentCol--;
                        moved = true;
                    }
                    
                    // Check for merge
                    if (currentCol > 0 && grid[row][currentCol - 1] === grid[row][currentCol]) {
                        grid[row][currentCol - 1] *= 2;
                        grid[row][currentCol] = 0;
                        moved = true;
                        
                        // Update score
                        updateScore(grid[row][currentCol - 1]);
                        
                        // Check for win
                        if (grid[row][currentCol - 1] === 2048 && !gameWon) {
                            gameWon = true;
                            showGameWon();
                        }
                    }
                }
            }
        }
        
        if (moved) {
            updateGrid();
        }
        
        return moved;
    }
    
    // Update the score
    function updateScore(value) {
        score += value;
        scoreDisplay.textContent = score;
        
        // Update best score if needed
        if (score > bestScore) {
            bestScore = score;
            bestScoreDisplay.textContent = bestScore;
            localStorage.setItem('bestScore', bestScore);
        }
    }
    
    // Check if the game is over
    function isGameOver() {
        // Check if there are any empty cells
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (grid[row][col] === 0) {
                    return false;
                }
            }
        }
        
        // Check if there are any possible merges
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                // Check adjacent cells for possible merges
                if (
                    (row < 3 && grid[row][col] === grid[row + 1][col]) ||
                    (col < 3 && grid[row][col] === grid[row][col + 1])
                ) {
                    return false;
                }
            }
        }
        
        // No empty cells and no possible merges
        return true;
    }
    
    // Show game over message
    function showGameOver() {
        messageText.textContent = 'Game Over!';
        gameMessage.className = 'game-message game-over';
        gameMessage.style.display = 'flex';
    }
    
    // Show game won message
    function showGameWon() {
        messageText.textContent = 'You Win!';
        gameMessage.className = 'game-message game-won';
        gameMessage.style.display = 'flex';
    }
    
    // Handle keyboard events
    document.addEventListener('keydown', (event) => {
        if (canMove && !gameOver) {
            switch (event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    moveTiles('up');
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    moveTiles('right');
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    moveTiles('down');
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    moveTiles('left');
                    break;
            }
        }
    });
    
    // Handle touch events for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (event) => {
        if (!canMove || gameOver) return;
        
        touchEndX = event.changedTouches[0].clientX;
        touchEndY = event.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Determine swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 50) {
                moveTiles('right');
            } else if (deltaX < -50) {
                moveTiles('left');
            }
        } else {
            // Vertical swipe
            if (deltaY > 50) {
                moveTiles('down');
            } else if (deltaY < -50) {
                moveTiles('up');
            }
        }
    }, { passive: true });
    
    // New game button event
    newGameButton.addEventListener('click', initGame);
    retryButton.addEventListener('click', initGame);
    
    // Initialize the game on load
    initGame();
});