// Asset Management System
class AssetManager {
    constructor() {
        this.images = {};
        this.loaded = 0;
        this.total = 0;
    }

    // Load an image
    loadImage(name, src) {
        this.total++;
        const img = new Image();
        img.onload = () => {
            this.loaded++;
            console.log(`Loaded: ${name} (${this.loaded}/${this.total})`);
        };
        img.onerror = () => {
            console.error(`Failed to load: ${name}`);
            this.loaded++;
        };
        img.src = src;
        this.images[name] = img;
    }

    // Get an image
    getImage(name) {
        return this.images[name];
    }

    // Check if all assets are loaded
    isLoaded() {
        return this.loaded === this.total;
    }

    // Get loading progress
    getProgress() {
        return this.total === 0 ? 1 : this.loaded / this.total;
    }
}

// Create sprite sheet from colors (for simple graphics)
function createColorSprite(width, height, color) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    return canvas;
}

// Create Pikachu sprite (simple pixel art)
function createPikachuSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Yellow body
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(8, 12, 16, 16);
    
    // Ears
    ctx.fillRect(6, 8, 4, 8);
    ctx.fillRect(22, 8, 4, 8);
    ctx.fillStyle = '#000';
    ctx.fillRect(6, 8, 4, 2);
    ctx.fillRect(22, 8, 4, 2);
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(12, 16, 2, 2);
    ctx.fillRect(18, 16, 2, 2);
    
    // Cheeks
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(8, 20, 3, 3);
    ctx.fillRect(21, 20, 3, 3);
    
    // Mouth
    ctx.fillStyle = '#000';
    ctx.fillRect(14, 22, 4, 1);
    
    // Tail
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(24, 16, 6, 4);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(26, 16, 4, 2);
    
    return canvas;
}

// Create block sprite
function createBlockSprite(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    if (type === 'brick') {
        // Brick block
        ctx.fillStyle = '#C84C09';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#E06010';
        ctx.fillRect(2, 2, 28, 28);
        // Brick pattern
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 16, 32, 1);
        ctx.fillRect(16, 0, 1, 16);
        ctx.fillRect(8, 16, 1, 16);
    } else if (type === 'question') {
        // Question block
        ctx.fillStyle = '#F8B800';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#FCE850';
        ctx.fillRect(2, 2, 28, 28);
        // Question mark
        ctx.fillStyle = '#000';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 16, 16);
    } else if (type === 'ground') {
        // Ground block
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(2, 2, 28, 28);
        // Grid pattern
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        for (let i = 0; i < 32; i += 8) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 32);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(32, i);
            ctx.stroke();
        }
    } else if (type === 'pipe') {
        // Green pipe
        ctx.fillStyle = '#00A000';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#00C000';
        ctx.fillRect(4, 4, 24, 24);
        // Pipe highlight
        ctx.fillStyle = '#00E000';
        ctx.fillRect(6, 6, 8, 20);
    }
    
    return canvas;
}

// Create enemy sprite (Goomba-style)
function createEnemySprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Brown mushroom body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(8, 16, 16, 12);
    
    // Head/cap
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(6, 10, 20, 8);
    
    // Eyes
    ctx.fillStyle = '#FFF';
    ctx.fillRect(10, 12, 4, 4);
    ctx.fillRect(18, 12, 4, 4);
    ctx.fillStyle = '#000';
    ctx.fillRect(11, 13, 2, 2);
    ctx.fillRect(19, 13, 2, 2);
    
    // Feet
    ctx.fillStyle = '#654321';
    ctx.fillRect(8, 28, 6, 4);
    ctx.fillRect(18, 28, 6, 4);
    
    return canvas;
}

// Create coin sprite
function createCoinSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(8, 8, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(8, 8, 4, 0, Math.PI * 2);
    ctx.fill();
    
    return canvas;
}

// Create flag sprite
function createFlagSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Pole
    ctx.fillStyle = '#8B8B8B';
    ctx.fillRect(14, 0, 4, 128);
    
    // Flag
    ctx.fillStyle = '#000';
    ctx.fillRect(18, 8, 12, 12);
    
    return canvas;
}

// Initialize all game assets
const assets = new AssetManager();

// Create sprite-based assets
assets.images['pikachu'] = createPikachuSprite();
assets.images['brick'] = createBlockSprite('brick');
assets.images['question'] = createBlockSprite('question');
assets.images['ground'] = createBlockSprite('ground');
assets.images['pipe'] = createBlockSprite('pipe');
assets.images['enemy'] = createEnemySprite();
assets.images['coin'] = createCoinSprite();
assets.images['flag'] = createFlagSprite();

// Mark as loaded (since we're creating sprites, not loading images)
assets.loaded = 8;
assets.total = 8;

console.log('Assets initialized!');
