// Main Game Engine

// Game states
const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameover',
    WIN: 'win'
};

// Game class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = GameState.MENU;
        this.keys = {};
        this.score = 0;
        this.coins = 0;
        this.time = 400;
        this.cameraX = 0;

        // Menu elements
        this.menuScreen = document.getElementById('menuScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.coinCountDisplay = document.getElementById('coinCount');
        this.coinButton = document.getElementById('coinButton');
        this.startButton = document.getElementById('startButton');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.winScreen = document.getElementById('winScreen');

        // Game objects
        this.player = null;
        this.level = null;

        // Menu coins
        this.menuCoins = 0;

        this.setupCanvas();
        this.setupEventListeners();
        this.showMenu();
    }

    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Menu controls
            if (this.state === GameState.MENU) {
                if (e.key === 'x' || e.key === 'X') {
                    this.addMenuCoin();
                } else if (e.key === ' ' && this.menuCoins > 0) {
                    e.preventDefault();
                    this.startGame();
                }
            }

            // Game over / win screen
            if ((this.state === GameState.GAME_OVER || this.state === GameState.WIN) && e.key === ' ') {
                e.preventDefault();
                this.returnToMenu();
            }

            // Pause
            if (this.state === GameState.PLAYING && e.key === 'Escape') {
                this.state = GameState.PAUSED;
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Button events
        this.coinButton.addEventListener('click', () => {
            this.addMenuCoin();
        });

        this.startButton.addEventListener('click', () => {
            if (this.menuCoins > 0) {
                this.startGame();
            }
        });

        // Resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        this.handleResize();
    }

    handleResize() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const scale = Math.min(
            containerWidth / this.canvas.width,
            containerHeight / this.canvas.height
        );

        this.canvas.style.width = `${this.canvas.width * scale}px`;
        this.canvas.style.height = `${this.canvas.height * scale}px`;
    }

    addMenuCoin() {
        this.menuCoins++;
        this.coinCountDisplay.textContent = this.menuCoins;
        this.startButton.disabled = false;

        // Animation effect
        this.coinCountDisplay.style.transform = 'scale(1.3)';
        setTimeout(() => {
            this.coinCountDisplay.style.transform = 'scale(1)';
        }, 200);
    }

    showMenu() {
        this.state = GameState.MENU;
        this.menuScreen.classList.add('active');
        this.gameScreen.classList.remove('active');
    }

    startGame() {
        this.state = GameState.PLAYING;
        this.menuScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        this.gameOverScreen.classList.remove('active');
        this.winScreen.classList.remove('active');

        // Use a coin
        this.menuCoins--;

        // Initialize game
        this.score = 0;
        this.coins = 0;
        this.time = 400;
        this.cameraX = 0;
        this.player = new Player(100, 400);
        this.level = new Level();
        this.keys = {};

        // Start game loop
        this.lastTime = performance.now();
        this.gameLoop();
    }

    returnToMenu() {
        this.showMenu();
        this.coinCountDisplay.textContent = this.menuCoins;
        this.startButton.disabled = this.menuCoins === 0;
    }

    gameLoop(currentTime = performance.now()) {
        if (this.state !== GameState.PLAYING) {
            return;
        }

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // Update timer (roughly every second)
        if (Math.random() < 0.016) {
            this.time--;
            if (this.time <= 0) {
                this.gameOver();
                return;
            }
        }

        // Update player
        this.player.update(this.keys, this.level);

        // Update level
        this.level.update();

        // Camera follows player
        this.cameraX = Math.max(0, Math.min(
            this.player.x - this.canvas.width / 3,
            this.level.width - this.canvas.width
        ));

        // Check player-enemy collisions
        for (let enemy of this.level.enemies) {
            if (!enemy.alive) continue;

            if (this.player.intersects(enemy)) {
                // Check if player is falling on enemy
                if (this.player.velocityY > 0 &&
                    this.player.y + this.player.height - 10 < enemy.y + enemy.height / 2) {
                    // Squash enemy
                    enemy.squash();
                    this.player.velocityY = -8; // Bounce
                    this.score += 100;
                } else {
                    // Player takes damage
                    this.player.takeDamage();
                }
            }
        }

        // Check coin collection
        for (let coin of this.level.coins) {
            if (coin.collected) continue;

            if (this.player.intersects(coin)) {
                coin.collected = true;
                this.coins++;
                this.score += 50;
            }
        }

        // Check goal reached
        if (this.level.goal && this.player.intersects(this.level.goal)) {
            this.level.goal.reached = true;
            this.win();
        }

        // Check if player died
        if (!this.player.alive) {
            this.gameOver();
        }

        // Update UI
        this.updateUI();
    }

    updateUI() {
        document.getElementById('scoreDisplay').textContent =
            this.score.toString().padStart(6, '0');
        document.getElementById('timeDisplay').textContent =
            this.time.toString();
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw level
        this.level.draw(this.ctx, this.cameraX);

        // Draw player
        this.player.draw(this.ctx, this.cameraX);

        // Draw pause overlay
        if (this.state === GameState.PAUSED) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '40px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    gameOver() {
        this.state = GameState.GAME_OVER;
        this.gameOverScreen.classList.add('active');
    }

    win() {
        this.state = GameState.WIN;
        this.winScreen.classList.add('active');
        this.score += this.time * 10; // Bonus points
        this.updateUI();
    }
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    console.log('Initializing game...');

    // Wait for assets to load
    const checkAssets = setInterval(() => {
        if (assets.isLoaded()) {
            clearInterval(checkAssets);
            game = new Game();
            console.log('Game initialized!');
        }
    }, 100);
});
