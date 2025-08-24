class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.camera = { x: 0, y: 0 };
        this.gravity = 0.5;
        this.friction = 0.8;
        
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.gameState = 'playing';
        
        this.keys = {};
        this.gameSpeed = 60;
        
        this.init();
    }
    
    init() {
        this.mario = new Mario(100, 300, this);
        this.level = new Level(this);
        this.setupEventListeners();
        this.updateUI();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.nextLevel();
        });
    }
    
    gameLoop() {
        if (this.gameState === 'playing') {
            this.update();
            this.render();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.mario.update();
        this.level.update();
        this.updateCamera();
        this.checkCollisions();
        this.checkGameConditions();
    }
    
    updateCamera() {
        this.camera.x = this.mario.x - this.width / 2;
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.level.width - this.width));
        this.camera.y = 0;
    }
    
    checkCollisions() {
        this.level.platforms.forEach(platform => {
            if (this.mario.checkCollision(platform)) {
                this.mario.handlePlatformCollision(platform);
            }
        });
        
        this.level.enemies.forEach((enemy, index) => {
            if (this.mario.checkCollision(enemy)) {
                if (this.mario.vy > 0 && this.mario.y < enemy.y) {
                    this.mario.vy = -8;
                    this.level.enemies.splice(index, 1);
                    this.addScore(100);
                } else {
                    this.mario.takeDamage();
                }
            }
        });
        
        this.level.coins.forEach((coin, index) => {
            if (this.mario.checkCollision(coin)) {
                this.level.coins.splice(index, 1);
                this.collectCoin();
            }
        });
        
        if (this.mario.checkCollision(this.level.flag)) {
            this.levelComplete();
        }
    }
    
    checkGameConditions() {
        if (this.mario.y > this.height + 100) {
            this.mario.takeDamage();
        }
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    collectCoin() {
        this.coins++;
        this.addScore(200);
        this.updateUI();
    }
    
    addScore(points) {
        this.score += points;
        this.updateUI();
    }
    
    loseLive() {
        this.lives--;
        this.updateUI();
        this.mario.reset();
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('coins').textContent = this.coins;
        document.getElementById('lives').textContent = this.lives;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').classList.remove('hidden');
    }
    
    levelComplete() {
        this.gameState = 'levelComplete';
        this.addScore(1000);
        document.getElementById('level-score').textContent = this.score;
        document.getElementById('level-complete').classList.remove('hidden');
    }
    
    restart() {
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.gameState = 'playing';
        this.mario.reset();
        this.level = new Level(this);
        this.updateUI();
        document.getElementById('game-over').classList.add('hidden');
    }
    
    nextLevel() {
        this.gameState = 'playing';
        this.mario.reset();
        this.level = new Level(this);
        document.getElementById('level-complete').classList.add('hidden');
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        this.renderBackground();
        this.level.render(this.ctx);
        this.mario.render(this.ctx);
        
        this.ctx.restore();
    }
    
    renderBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#5C94FC');
        gradient.addColorStop(1, '#87CEEB');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.camera.x, 0, this.width, this.height);
        
        for (let i = 0; i < this.level.width; i += 100) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.fillRect(i, this.height - 150, 60, 60);
            this.ctx.fillRect(i + 30, this.height - 100, 40, 40);
        }
    }
}

class Mario {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.width = 32;
        this.height = 32;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.jumpPower = 12;
        this.onGround = false;
        this.facing = 1;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
    }
    
    update() {
        this.handleInput();
        this.applyPhysics();
        this.updateInvulnerability();
    }
    
    handleInput() {
        if (this.game.keys['ArrowLeft'] || this.game.keys['a']) {
            this.vx = -this.speed;
            this.facing = -1;
        } else if (this.game.keys['ArrowRight'] || this.game.keys['d']) {
            this.vx = this.speed;
            this.facing = 1;
        } else {
            this.vx *= this.game.friction;
        }
        
        if ((this.game.keys[' '] || this.game.keys['ArrowUp'] || this.game.keys['w']) && this.onGround) {
            this.vy = -this.jumpPower;
            this.onGround = false;
        }
    }
    
    applyPhysics() {
        this.vy += this.game.gravity;
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.y > this.game.height - this.height - 50) {
            this.y = this.game.height - this.height - 50;
            this.vy = 0;
            this.onGround = true;
        }
    }
    
    updateInvulnerability() {
        if (this.invulnerable) {
            this.invulnerabilityTime--;
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
            }
        }
    }
    
    checkCollision(obj) {
        return this.x < obj.x + obj.width &&
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height &&
               this.y + this.height > obj.y;
    }
    
    handlePlatformCollision(platform) {
        const overlapX = Math.min(this.x + this.width - platform.x, platform.x + platform.width - this.x);
        const overlapY = Math.min(this.y + this.height - platform.y, platform.y + platform.height - this.y);
        
        if (overlapX < overlapY) {
            if (this.x < platform.x) {
                this.x = platform.x - this.width;
            } else {
                this.x = platform.x + platform.width;
            }
            this.vx = 0;
        } else {
            if (this.y < platform.y) {
                this.y = platform.y - this.height;
                this.vy = 0;
                this.onGround = true;
            } else {
                this.y = platform.y + platform.height;
                this.vy = 0;
            }
        }
    }
    
    takeDamage() {
        if (!this.invulnerable) {
            this.game.loseLive();
            this.invulnerable = true;
            this.invulnerabilityTime = 120;
        }
    }
    
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
    }
    
    render(ctx) {
        ctx.save();
        
        if (this.invulnerable && Math.floor(this.invulnerabilityTime / 10) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        if (this.facing === -1) {
            ctx.scale(-1, 1);
            ctx.translate(-this.x - this.width, 0);
        }
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.facing === -1 ? 0 : this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#FF6B35';
        ctx.fillRect(this.facing === -1 ? 4 : this.x + 4, this.y + 4, 24, 8);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.facing === -1 ? 8 : this.x + 8, this.y + 12, 16, 8);
        
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(this.facing === -1 ? 0 : this.x, this.y + 20, this.width, 12);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.facing === -1 ? 6 : this.x + 6, this.y + 26, 8, 6);
        ctx.fillRect(this.facing === -1 ? 18 : this.x + 18, this.y + 26, 8, 6);
        
        ctx.restore();
    }
}

class Level {
    constructor(game) {
        this.game = game;
        this.width = 3200;
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        this.flag = null;
        this.generateLevel();
    }
    
    generateLevel() {
        for (let x = 0; x < this.width; x += 64) {
            this.platforms.push(new Platform(x, this.game.height - 50, 64, 50));
        }
        
        this.platforms.push(new Platform(300, 350, 128, 32));
        this.platforms.push(new Platform(500, 280, 96, 32));
        this.platforms.push(new Platform(700, 320, 128, 32));
        this.platforms.push(new Platform(950, 250, 96, 32));
        this.platforms.push(new Platform(1200, 300, 128, 32));
        this.platforms.push(new Platform(1450, 220, 96, 32));
        this.platforms.push(new Platform(1700, 280, 128, 32));
        this.platforms.push(new Platform(2000, 200, 96, 32));
        this.platforms.push(new Platform(2300, 260, 128, 32));
        this.platforms.push(new Platform(2600, 180, 96, 32));
        this.platforms.push(new Platform(2900, 240, 128, 32));
        
        this.enemies.push(new Goomba(400, 380));
        this.enemies.push(new Goomba(600, 380));
        this.enemies.push(new Goomba(1000, 380));
        this.enemies.push(new Goomba(1300, 380));
        this.enemies.push(new Goomba(1800, 380));
        this.enemies.push(new Goomba(2200, 380));
        this.enemies.push(new Goomba(2500, 380));
        
        this.coins.push(new Coin(320, 310));
        this.coins.push(new Coin(520, 240));
        this.coins.push(new Coin(720, 280));
        this.coins.push(new Coin(970, 210));
        this.coins.push(new Coin(1220, 260));
        this.coins.push(new Coin(1470, 180));
        this.coins.push(new Coin(1720, 240));
        this.coins.push(new Coin(2020, 160));
        this.coins.push(new Coin(2320, 220));
        this.coins.push(new Coin(2620, 140));
        
        this.flag = new Flag(3000, this.game.height - 200);
    }
    
    update() {
        this.enemies.forEach(enemy => enemy.update());
    }
    
    render(ctx) {
        this.platforms.forEach(platform => platform.render(ctx));
        this.enemies.forEach(enemy => enemy.render(ctx));
        this.coins.forEach(coin => coin.render(ctx));
        this.flag.render(ctx);
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    render(ctx) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, 4);
        
        for (let i = 0; i < this.width; i += 16) {
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(this.x + i, this.y, 2, this.height);
        }
    }
}

class Goomba {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.vx = -1;
        this.vy = 0;
    }
    
    update() {
        this.x += this.vx;
        
        if (this.x < 0 || this.x > 3200) {
            this.vx *= -1;
        }
    }
    
    render(ctx) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, 8);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 4, this.y + 4, 4, 4);
        ctx.fillRect(this.x + 16, this.y + 4, 4, 4);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 2, this.y + 18, 6, 6);
        ctx.fillRect(this.x + 16, this.y + 18, 6, 6);
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.rotation = 0;
    }
    
    render(ctx) {
        this.rotation += 0.1;
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(-this.width / 2 + 2, -this.height / 2 + 2, this.width - 4, this.height - 4);
        
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-this.width / 2 + 4, -this.height / 2 + 4, this.width - 8, this.height - 8);
        
        ctx.restore();
    }
}

class Flag {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 150;
    }
    
    render(ctx) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 24, this.y, 8, this.height);
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x, this.y + 20, 24, 16);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x, this.y + 36, 24, 16);
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x, this.y + 52, 24, 16);
    }
}

window.addEventListener('load', () => {
    new Game();
});