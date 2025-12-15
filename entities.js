// Game Entities

// Player class (Pikachu)
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 3;
        this.runSpeed = 5;
        this.jumpPower = 12;
        this.gravity = 0.5;
        this.onGround = false;
        this.direction = 1; // 1 = right, -1 = left
        this.alive = true;
        this.invincible = false;
        this.invincibleTimer = 0;
    }

    update(keys, level) {
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
        if (this.velocityY > 15) this.velocityY = 15;

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
        if (this.y > 600) {
            this.alive = false;
        }
    }

    handleCollisions(level) {
        // Platform collisions
        for (let platform of level.platforms) {
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

                    // Break brick blocks
                    if (platform.type === 'brick' && !platform.hit) {
                        platform.hit = true;
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
            this.broken = true;
        } else if (this.type === 'question' && this.hasCoin) {
            this.hasCoin = false;
            this.bounceOffset = -10;
            return 'coin'; // Return item type
        }
    }

    update() {
        if (this.bounceOffset < 0) {
            this.bounceOffset += 2;
        } else {
            this.bounceOffset = 0;
        }
    }

    draw(ctx, cameraX) {
        if (this.broken) return;

        let spriteType = this.type;
        if (this.type === 'question' && !this.hasCoin) {
            spriteType = 'brick'; // Used question block
        }

        const img = assets.getImage(spriteType);
        const drawY = this.y + this.bounceOffset;

        for (let x = 0; x < this.width; x += 32) {
            for (let y = 0; y < this.height; y += 32) {
                ctx.drawImage(img, this.x + x - cameraX, drawY + y, 32, 32);
            }
        }
    }
}

// Enemy class
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityX = -1;
        this.velocityY = 0;
        this.gravity = 0.5;
        this.alive = true;
        this.squashed = false;
    }

    update(level) {
        if (this.squashed) return;

        // Apply gravity
        this.velocityY += this.gravity;
        if (this.velocityY > 10) this.velocityY = 10;

        // Move
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Simple collision with platforms
        let onGround = false;
        for (let platform of level.platforms) {
            if (this.intersects(platform)) {
                if (this.velocityY > 0) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    onGround = true;
                } else if (this.velocityX !== 0) {
                    this.velocityX *= -1; // Turn around when hitting wall
                }
            }
        }

        // Fall off world
        if (this.y > 600) {
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
        const height = this.squashed ? 16 : this.height;
        ctx.drawImage(img, this.x - cameraX, this.y, this.width, height);
    }
}

// Coin class
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.collected = false;
        this.frame = 0;
    }

    update() {
        this.frame++;
    }

    draw(ctx, cameraX) {
        if (this.collected) return;

        const img = assets.getImage('coin');
        const offsetY = Math.sin(this.frame * 0.1) * 3;
        ctx.drawImage(img, this.x - cameraX, this.y + offsetY, this.width, this.height);
    }
}

// Goal flag class
class Goal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 128;
        this.reached = false;
    }

    draw(ctx, cameraX) {
        const img = assets.getImage('flag');
        ctx.drawImage(img, this.x - cameraX, this.y, this.width, this.height);
    }
}
