const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;
ctx.imageSmoothingEnabled = false;

let lastTimestamp = 0;

function draw(timestamp) {
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    const dt = Math.min(deltaTime, 0.1);

    // 1. Logik-Updates
    updateMovement(dt);
    updateCamera(player.worldX, player.worldY, canvas.width, canvas.height, dt);
    
    // Animation-Timer
    if (player.isMoving) {
        if (timestamp - player.lastFrameUpdate > 100) { 
            player.currentFrame = (player.currentFrame + 1) % 10;
            player.lastFrameUpdate = timestamp;
        }
    } else {
        player.currentFrame = 0;
    }

    // 2. Zeichnen vorbereiten
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(zoom, zoom); 

    // --- SCHICHT 1: Boden-Tiles (Layer 1) ---
    for (let x = viewX - 2; x <= viewX + 4; x++) {
        for (let y = viewY - 2; y <= viewY + 4; y++) {
            if (walkableSet.has(`${x},${y}`)) {
                const tile = getTileImage(x, y);
                if (tile.ready) {
                    ctx.drawImage(
                        tile.img, 
                        Math.floor(x * TILE_W - offsetX), 
                        Math.floor(y * TILE_H - offsetY), 
                        TILE_W + 1, TILE_H + 1
                    );
                }
            }
        }
    }

    // --- SCHICHT 2: Der Spieler (Zwischen den Layern) ---
    const sX = Math.floor(player.worldX - offsetX);
    const sY = Math.floor(player.worldY - offsetY);
    
    // Schatten
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(sX, sY + 22, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sprite
    let img = player.isMoving ? player.imgWalk : player.imgStand;
    ctx.save();
    if (player.direction === 'left') {
        ctx.translate(sX, sY); 
        ctx.scale(-1, 1);
        ctx.drawImage(img, player.currentFrame * 50, 0, 50, 50, -25, -25, 50, 50);
    } else {
        ctx.drawImage(img, player.currentFrame * 50, 0, 50, 50, sX - 25, sY - 25, 50, 50);
    }
    ctx.restore();

    // --- SCHICHT 3: Vordergrund (Layer 2) ---
    // Wir loopen nochmal über die sichtbaren Tiles für die Überdeckung
    for (let x = viewX - 2; x <= viewX + 4; x++) {
        for (let y = viewY - 2; y <= viewY + 4; y++) {
            // Wir brauchen eine Funktion getLayer2Image in deiner assets.js
            const tileL2 = getLayer2Image(x, y); 
            if (tileL2 && tileL2.exists && tileL2.ready) {
                ctx.drawImage(
                    tileL2.img, 
                    Math.floor(x * TILE_W - offsetX), 
                    Math.floor(y * TILE_H - offsetY), 
                    TILE_W + 1, TILE_H + 1
                );
            }
        }
    }

    ctx.restore(); 
    requestAnimationFrame(draw);
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoom + offsetX;
    const clickY = (e.clientY - rect.top) / zoom + offsetY;
    
    const path = calculatePath(player.worldX, player.worldY + player.footOffset, clickX, clickY);
    if (path) {
        player.waypoints = path;
        player.isMoving = true; 
    }
});

requestAnimationFrame(draw);