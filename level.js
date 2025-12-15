// Level 1-1 Design
class Level {
    constructor() {
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        this.goal = null;
        this.width = 6400; // Level width
        this.height = 600; // Level height
        this.buildLevel();
    }

    buildLevel() {
        const TILE = 32;

        // Ground floor (full length)
        for (let x = 0; x < this.width; x += TILE) {
            this.platforms.push(new Platform(x, 560, TILE, TILE * 2, 'ground'));
        }

        // Starting area platforms
        this.platforms.push(new Platform(16 * TILE, 400, TILE * 3, TILE, 'brick'));

        // Question blocks section
        this.platforms.push(new Platform(20 * TILE, 400, TILE, TILE, 'question'));
        this.platforms.push(new Platform(22 * TILE, 400, TILE, TILE, 'question'));
        this.platforms.push(new Platform(23 * TILE, 400, TILE, TILE, 'question'));
        this.platforms.push(new Platform(24 * TILE, 400, TILE, TILE, 'brick'));
        this.platforms.push(new Platform(25 * TILE, 400, TILE, TILE, 'question'));

        // Floating platforms
        this.platforms.push(new Platform(30 * TILE, 450, TILE * 2, TILE, 'brick'));
        this.platforms.push(new Platform(34 * TILE, 400, TILE * 2, TILE, 'brick'));
        this.platforms.push(new Platform(38 * TILE, 350, TILE * 2, TILE, 'brick'));

        // Brick pyramid
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4 - row; col++) {
                this.platforms.push(new Platform(
                    (45 + col) * TILE,
                    560 - (row + 1) * TILE,
                    TILE,
                    TILE,
                    'brick'
                ));
            }
        }

        // Question block series
        this.platforms.push(new Platform(52 * TILE, 400, TILE, TILE, 'question'));
        this.platforms.push(new Platform(55 * TILE, 400, TILE, TILE, 'question'));
        this.platforms.push(new Platform(58 * TILE, 400, TILE, TILE, 'question'));

        // Pipe section
        this.platforms.push(new Platform(65 * TILE, 480, TILE * 2, TILE * 2.5, 'pipe'));
        this.platforms.push(new Platform(75 * TILE, 450, TILE * 2, TILE * 3.5, 'pipe'));
        this.platforms.push(new Platform(85 * TILE, 420, TILE * 2, TILE * 4.5, 'pipe'));

        // Underground section - elevated platform
        this.platforms.push(new Platform(95 * TILE, 450, TILE * 8, TILE, 'brick'));

        // More question blocks
        this.platforms.push(new Platform(105 * TILE, 400, TILE, TILE, 'question'));
        this.platforms.push(new Platform(107 * TILE, 350, TILE, TILE, 'question'));
        this.platforms.push(new Platform(109 * TILE, 400, TILE, TILE, 'question'));

        // Final staircase
        for (let step = 0; step < 8; step++) {
            for (let h = 0; h <= step; h++) {
                this.platforms.push(new Platform(
                    (120 + step) * TILE,
                    560 - (h + 1) * TILE,
                    TILE,
                    TILE,
                    'brick'
                ));
            }
        }

        // Staircase down
        for (let step = 0; step < 8; step++) {
            for (let h = 0; h <= (7 - step); h++) {
                this.platforms.push(new Platform(
                    (128 + step) * TILE,
                    560 - (h + 1) * TILE,
                    TILE,
                    TILE,
                    'brick'
                ));
            }
        }

        // === ENEMIES ===
        this.enemies.push(new Enemy(25 * TILE, 500));
        this.enemies.push(new Enemy(35 * TILE, 500));
        this.enemies.push(new Enemy(50 * TILE, 500));
        this.enemies.push(new Enemy(60 * TILE, 500));
        this.enemies.push(new Enemy(70 * TILE, 500));
        this.enemies.push(new Enemy(80 * TILE, 500));
        this.enemies.push(new Enemy(100 * TILE, 500));
        this.enemies.push(new Enemy(110 * TILE, 500));

        // === COINS ===
        for (let i = 30; i < 35; i++) {
            this.coins.push(new Coin(i * TILE + 8, 350));
        }
        for (let i = 52; i < 60; i += 3) {
            this.coins.push(new Coin(i * TILE + 8, 300));
        }
        for (let i = 95; i < 103; i++) {
            this.coins.push(new Coin(i * TILE + 8, 380));
        }

        // === GOAL ===
        this.goal = new Goal(137 * TILE, 432);
    }

    update() {
        // Update all platforms
        for (let platform of this.platforms) {
            platform.update();
        }

        // Update all enemies
        for (let enemy of this.enemies) {
            enemy.update(this);
        }

        // Update all coins
        for (let coin of this.coins) {
            coin.update();
        }
    }

    draw(ctx, cameraX) {
        // Draw sky background
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#5c94fc');
        gradient.addColorStop(0.7, '#5c94fc');
        gradient.addColorStop(1, '#8B7355');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, this.height);

        // Draw clouds (simple white circles)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 10; i++) {
            const x = (i * 800) - (cameraX * 0.3);
            ctx.beginPath();
            ctx.arc(x % (this.width + 400), 100 + (i % 3) * 50, 30, 0, Math.PI * 2);
            ctx.arc(x % (this.width + 400) + 25, 100 + (i % 3) * 50, 35, 0, Math.PI * 2);
            ctx.arc(x % (this.width + 400) + 50, 100 + (i % 3) * 50, 30, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw platforms
        for (let platform of this.platforms) {
            platform.draw(ctx, cameraX);
        }

        // Draw coins
        for (let coin of this.coins) {
            coin.draw(ctx, cameraX);
        }

        // Draw enemies
        for (let enemy of this.enemies) {
            enemy.draw(ctx, cameraX);
        }

        // Draw goal
        if (this.goal) {
            this.goal.draw(ctx, cameraX);
        }
    }
}
