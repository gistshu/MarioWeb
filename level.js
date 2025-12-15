// Level 1-1 Design with 2x Scale
// 6400px width (unchanged logic, just fewer larger tiles effectively)
// Screen height is 600px. TILE_SIZE is 64px.
// Floor at 600 - 64 = 536.

class Level {
    constructor() {
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        this.particles = [];
        this.goal = null;
        this.width = 12000; // Wider world for bigger tiles
        this.height = 600;
        this.buildLevel();
    }

    addDebris(x, y) {
        // Create 4 debris particles
        this.particles.push(new Particle(x, y, -2, -4));
        this.particles.push(new Particle(x, y, 2, -4));
        this.particles.push(new Particle(x, y, -2, -2));
        this.particles.push(new Particle(x, y, 2, -2));
    }

    buildLevel() {
        const TILE = 64; // New larger tile size

        // Ground floor (full length)
        for (let x = 0; x < this.width; x += TILE) {
            this.platforms.push(new Platform(x, 536, TILE, TILE * 2, 'ground'));
        }

        // Starting area platforms
        this.platforms.push(new Platform(10 * TILE, 350, TILE * 3, TILE, 'brick'));

        // Question blocks section
        this.platforms.push(new Platform(14 * TILE, 350, TILE, TILE, 'question'));
        this.platforms.push(new Platform(16 * TILE, 350, TILE, TILE, 'question'));
        this.platforms.push(new Platform(17 * TILE, 350, TILE, TILE, 'question'));
        this.platforms.push(new Platform(18 * TILE, 350, TILE, TILE, 'brick'));
        this.platforms.push(new Platform(19 * TILE, 350, TILE, TILE, 'question'));

        // Floating platforms
        this.platforms.push(new Platform(25 * TILE, 400, TILE * 2, TILE, 'brick'));
        this.platforms.push(new Platform(29 * TILE, 350, TILE * 2, TILE, 'brick'));
        this.platforms.push(new Platform(33 * TILE, 300, TILE * 2, TILE, 'brick'));

        // Brick pyramid
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4 - row; col++) {
                this.platforms.push(new Platform(
                    (40 + col) * TILE,
                    536 - (row + 1) * TILE,
                    TILE,
                    TILE,
                    'brick'
                ));
            }
        }

        // Question block series
        this.platforms.push(new Platform(48 * TILE, 350, TILE, TILE, 'question'));
        this.platforms.push(new Platform(51 * TILE, 350, TILE, TILE, 'question'));
        this.platforms.push(new Platform(54 * TILE, 350, TILE, TILE, 'question'));

        // Pipe section (Adjusted for size)
        this.platforms.push(new Platform(60 * TILE, 472, TILE * 2, TILE + 64, 'pipe'));
        this.platforms.push(new Platform(70 * TILE, 408, TILE * 2, TILE * 2 + 64, 'pipe'));

        // Underground section - elevated platform
        this.platforms.push(new Platform(85 * TILE, 400, TILE * 8, TILE, 'brick'));

        // Final staircase
        for (let step = 0; step < 8; step++) {
            for (let h = 0; h <= step; h++) {
                this.platforms.push(new Platform(
                    (100 + step) * TILE,
                    536 - (h + 1) * TILE,
                    TILE,
                    TILE,
                    'brick'
                ));
            }
        }

        // === ENEMIES ===
        this.enemies.push(new Enemy(18 * TILE, 450));
        this.enemies.push(new Enemy(28 * TILE, 450));
        this.enemies.push(new Enemy(45 * TILE, 450));
        this.enemies.push(new Enemy(55 * TILE, 450));
        this.enemies.push(new Enemy(65 * TILE, 450));
        this.enemies.push(new Enemy(88 * TILE, 350)); // On platform

        // === COINS ===
        for (let i = 25; i < 30; i++) {
            this.coins.push(new Coin(i * TILE + 16, 300));
        }
        for (let i = 48; i < 55; i += 3) {
            this.coins.push(new Coin(i * TILE + 16, 250));
        }

        // === GOAL ===
        this.goal = new Goal(115 * TILE, 136); // Position adjusted for new height
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

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
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

        // Draw clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 15; i++) {
            const x = (i * 1000) - (cameraX * 0.3);
            ctx.beginPath();
            ctx.arc(x % (this.width + 400), 100 + (i % 3) * 80, 50, 0, Math.PI * 2);
            ctx.arc(x % (this.width + 400) + 40, 100 + (i % 3) * 80, 60, 0, Math.PI * 2);
            ctx.arc(x % (this.width + 400) + 80, 100 + (i % 3) * 80, 50, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw platforms
        for (let platform of this.platforms) {
            platform.draw(ctx, cameraX);
        }

        // Draw debris
        for (let particle of this.particles) {
            particle.draw(ctx, cameraX);
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
