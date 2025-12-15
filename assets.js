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

// Global scaling factor
const SCALE = 2; // Making everything 2x bigger (64px tiles)

// Create Pikachu sprite (simple pixel art)
function createPikachuSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 32 * SCALE;
    canvas.height = 32 * SCALE;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.scale(SCALE, SCALE);

    // Yellow body
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(8, 12, 16, 16);

    // Ears
    ctx.fillRect(6, 4, 4, 12); // Longer ears
    ctx.fillRect(22, 4, 4, 12);
    ctx.fillStyle = '#000';
    ctx.fillRect(6, 4, 4, 3);
    ctx.fillRect(22, 4, 4, 3);

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(12, 16, 2, 2);
    ctx.fillRect(18, 16, 2, 2);

    // Cheeks - Bigger cheeks
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(7, 19, 4, 4);
    ctx.fillRect(21, 19, 4, 4);

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
    canvas.width = 32 * SCALE;
    canvas.height = 32 * SCALE;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.scale(SCALE, SCALE);

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
    } else if (type === 'debris') {
        // Brick debris
        ctx.fillStyle = '#C84C09';
        ctx.fillRect(0, 0, 8, 8);
    }

    return canvas;
}

// Create enemy sprite (Goomba-style)
function createEnemySprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 32 * SCALE;
    canvas.height = 32 * SCALE;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.scale(SCALE, SCALE);

    // Brown mushroom body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(4, 12, 24, 16); // Wider body

    // Head/cap
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(2, 8, 28, 10);

    // Eyes
    ctx.fillStyle = '#FFF';
    ctx.fillRect(8, 14, 6, 6);
    ctx.fillRect(18, 14, 6, 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(10, 16, 2, 2);
    ctx.fillRect(20, 16, 2, 2);

    // Feet
    ctx.fillStyle = '#654321';
    ctx.fillRect(6, 28, 8, 4);
    ctx.fillRect(18, 28, 8, 4);

    return canvas;
}

// Create coin sprite
function createCoinSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 16 * SCALE; // Smaller than blocks, but scaled
    canvas.height = 16 * SCALE;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.scale(SCALE, SCALE);

    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(8, 8, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(8, 8, 5, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
}

// Create flag sprite
function createFlagSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 32 * SCALE;
    canvas.height = 400; // Much taller flag pole
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Pole
    ctx.fillStyle = '#8B8B8B';
    ctx.fillRect(14 * SCALE, 0, 4 * SCALE, 400);

    // Flag
    ctx.fillStyle = '#000';
    ctx.fillRect(18 * SCALE, 20, 12 * SCALE * 2, 12 * SCALE * 2);
    ctx.fillStyle = '#FF0000'; // Red flag
    // Triangle flag
    ctx.beginPath();
    ctx.moveTo(18 * SCALE, 20);
    ctx.lineTo(18 * SCALE + 60, 45);
    ctx.lineTo(18 * SCALE, 70);
    ctx.fill();

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
assets.images['debris'] = createBlockSprite('debris'); // New debris
assets.images['enemy'] = createEnemySprite();
assets.images['coin'] = createCoinSprite();
assets.images['flag'] = createFlagSprite();

// Mark as loaded
assets.loaded = 9;
assets.total = 9;

console.log('Assets initialized with 2x Scale!');
