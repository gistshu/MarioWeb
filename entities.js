// Game Entities with scaling

const TILE_SIZE = 64; // New 2x tile size (originally 32)
const GRAVITY = 0.8;
const JUMP_POWER = 16;
const SPEED = 5;
const RUN_SPEED = 8;

// Particle class for brick debris
class Particle {
    constructor(x, y, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.gravity = 0.5;
        this.life = 60; // Frames to live
    }

    update() {
        this.velocityY += this.gravity;
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.life--;
    }

    draw(ctx, cameraX) {
        if (this.life <= 0) return;
        const img = assets.getImage('debris');
        ctx.save();
        ctx.translate(this.x - cameraX + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.life * 0.2);
        ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

// Player class (Pikachu)
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE; // 64
        this.height = TILE_SIZE; // 64
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = SPEED;
        this.runSpeed = RUN_SPEED;
        this.jumpPower = JUMP_POWER;
        this.gravity = GRAVITY;
        this.onGround = false;
        this.direction = 1; // 1 = right, -1 = left
        this.alive = true;
        this.invincible = false;
        this.invincibleTimer = 0;
    }

    update(keys, level) {
        if (!this.alive) return; // Don't move if dead

        // Handle input
        let moveSpeed = this.speed;
        if (keys['b'] || keys['B']) {
            moveSpeed = this.runSpeed;
        }

        if (keys['ArrowLeft']) {
            this.velocityX = -moveSpeed;
            this.direction = -1;
        } else if (keys['ArrowRight']) {
            this.velocityX = moveSpeed;
            this.direction = 1;
        } else {
            this.velocityX *= 0.8; // Friction
        }

        // Jump
        if ((keys['a'] || keys['A']) && this.onGround) {
            this.velocityY = -this.jumpPower;
            this.onGround = false;
        }

        // Apply gravity
        this.velocityY += this.gravity;

        // Terminal velocity
        if (this.velocityY > 20) this.velocityY = 20;

        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Collision detection
        this.onGround = false;
        this.handleCollisions(level);

        // Update invincibility
        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }

        // Fall off world
        if (this.y > 800) {
            this.alive = false;
        }
    }

    handleCollisions(level) {
        // Platform collisions
        for (let platform of level.platforms) {
            if (platform.broken) continue; // Skip broken platforms (empty space)

            if (this.intersects(platform)) {
                // Determine collision direction
                const overlapLeft = (this.x + this.width) - platform.x;
                const overlapRight = (platform.x + platform.width) - this.x;
                const overlapTop = (this.y + this.height) - platform.y;
                const overlapBottom = (platform.y + platform.height) - this.y;

                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                if (minOverlap === overlapTop && this.velocityY > 0) {
                    // Collision from top (landing on platform)
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.onGround = true;
                } else if (minOverlap === overlapBottom && this.velocityY < 0) {
                    // Collision from bottom (hitting head)
                    this.y = platform.y + platform.height;
                    this.velocityY = 0;

                    // Break brick blocks or hit question blocks
                    if (!platform.hit) {
                        platform.hit = true;
                        if (platform.type === 'brick') {
                            // Create debris
                            level.addDebris(platform.x, platform.y);
                        }
                        platform.break();
                    }
                } else if (minOverlap === overlapLeft) {
                    // Collision from left
                    this.x = platform.x - this.width;
                    this.velocityX = 0;
                } else if (minOverlap === overlapRight) {
                    // Collision from right
                    this.x = platform.x + platform.width;
                    this.velocityX = 0;
                }
            }
        }
    }

    intersects(obj) {
        return this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.y + this.height > obj.y;
    }

    takeDamage() {
        if (!this.invincible) {
            this.alive = false;
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(this.invincibleTimer / 5) % 2 === 0) {
            return; // Flashing effect
        }

        ctx.save();

        // Flip sprite based on direction
        if (this.direction === -1) {
            ctx.translate(this.x - cameraX + this.width, this.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.x - cameraX, this.y);
        }

        ctx.drawImage(assets.getImage('pikachu'), 0, 0, this.width, this.height);
        ctx.restore();
    }
}

// Platform/Block class
class Platform {
    constructor(x, y, width, height, type = 'ground') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.hit = false;
        this.broken = false;
        this.hasCoin = (type === 'question');
        this.bounceOffset = 0;
    }

    break() {
        if (this.type === 'brick') {
            this.broken = true; // Mark as broken, so it becomes empty space
        } else if (this.type === 'question' && this.hasCoin) {
            this.hasCoin = false;
            this.bounceOffset = -15; // Bigger bounce
            return 'coin'; // Return item type
        }
    }

    update() {
        if (this.bounceOffset < 0) {
            this.bounceOffset += 3;
        } else {
            this.bounceOffset = 0;
        }
    }

    draw(ctx, cameraX) {
        if (this.broken) return; // Don't draw broken bricks

        let spriteType = this.type;
        if (this.type === 'question' && !this.hasCoin) {
            spriteType = 'brick'; // Used question block looks like brick
        }

        const img = assets.getImage(spriteType);
        const drawY = this.y + this.bounceOffset;

        for (let x = 0; x < this.width; x += TILE_SIZE) {
            for (let y = 0; y < this.height; y += TILE_SIZE) {
                ctx.drawImage(img, this.x + x - cameraX, drawY + y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

// Enemy class
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
        this.velocityX = -2; // Faster enemies
        this.velocityY = 0;
        this.gravity = GRAVITY;
        this.alive = true;
        this.squashed = false;
    }

    update(level) {
        if (this.squashed) return;

        // Apply gravity
        this.velocityY += this.gravity;
        if (this.velocityY > 20) this.velocityY = 20;

        // Move
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Simple collision with platforms
        for (let platform of level.platforms) {
            if (platform.broken) continue;

            if (this.intersects(platform)) {
                if (this.velocityY > 0) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                } else if (this.velocityX !== 0) {
                    this.velocityX *= -1; // Turn around when hitting wall
                }
            }
        }

        // Fall off world
        if (this.y > 800) {
            this.alive = false;
        }
    }

    intersects(obj) {
        return this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.y + this.height > obj.y;
    }

    squash() {
        this.squashed = true;
        this.alive = false;
    }

    draw(ctx, cameraX) {
        if (!this.alive) return;

        const img = assets.getImage('enemy');
        const height = this.squashed ? TILE_SIZE / 2 : this.height;
        ctx.drawImage(img, this.x - cameraX, this.y + (this.height - height), this.width, height);
    }
}

// Coin class
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32; // Scaled up
        this.height = 32;
        this.collected = false;
        this.frame = 0;
    }

    update() {
        this.frame++;
    }

    draw(ctx, cameraX) {
        if (this.collected) return;

        const img = assets.getImage('coin');
        const offsetY = Math.sin(this.frame * 0.1) * 5;
        ctx.drawImage(img, this.x - cameraX, this.y + offsetY, this.width, this.height);
    }
}

// Goal flag class
class Goal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE;
        this.height = 400; // Taller flag (approx 3/4 screen height)
        this.reached = false;
    }

    draw(ctx, cameraX) {
        const img = assets.getImage('flag');
        ctx.drawImage(img, this.x - cameraX, this.y, this.width, this.height);
    }
}
