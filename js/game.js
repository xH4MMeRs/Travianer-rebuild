// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;
ctx.imageSmoothingEnabled = false;

// Initialisierung mit der aktuellen Zeit, um einen sauberen Start zu garantieren
let lastTimestamp = performance.now();

function draw(timestamp) {
    // 1. Zeitberechnung (Delta Time)
    // Wir rechnen die Millisekunden in Sekunden um
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    
    // Schutz gegen riesige Sprünge (z.B. wenn man den Tab wechselt)
    const dt = Math.min(deltaTime, 0.1);

    // 2. Logik-Updates
    // Hier wird die neue dt-basierte Bewegung genutzt (Pixel pro Sekunde)
    updateMovement(dt);
    updateCamera(player.worldX, player.worldY, canvas.width, canvas.height, dt);
    
    // --- Kontinuierlicher Animation-Timer ---
    // Der Frame schaltet jetzt IMMER weiter (für Atmen im Stand oder Laufen)
    if (timestamp - player.lastFrameUpdate > 120) { 
        player.currentFrame = (player.currentFrame + 1) % 10;
        player.lastFrameUpdate = timestamp;
    }

    // 3. Zeichnen vorbereiten
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

    // Sprite-Auswahl basierend auf der präzisen isMoving-Logik aus player.js
    let img = player.isMoving ? player.imgWalk : player.imgStand;
    
    ctx.save();
    if (player.direction === 'left') {
        ctx.translate(sX, sY); 
        ctx.scale(-1, 1);
        // Zeichnet den aktuellen Frame (0-9) aus dem Spritesheet
        ctx.drawImage(img, player.currentFrame * 50, 0, 50, 50, -25, -25, 50, 50);
    } else {
        ctx.drawImage(img, player.currentFrame * 50, 0, 50, 50, sX - 25, sY - 25, 50, 50);
    }
    ctx.restore();

    // --- SCHICHT 3: Vordergrund (Layer 2 - Häuser, Bäume etc.) ---
    for (let x = viewX - 2; x <= viewX + 4; x++) {
        for (let y = viewY - 2; y <= viewY + 4; y++) {
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

// KLICK-STEUERUNG
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoom + offsetX;
    const clickY = (e.clientY - rect.top) / zoom + offsetY;
    
    // Pathfinding aufrufen
    const path = calculatePath(player.worldX, player.worldY + player.footOffset, clickX, clickY);
    if (path) {
        player.waypoints = path;
        // isMoving wird hier getriggert, player.js übernimmt die Feinsteuerung
        player.isMoving = true; 
    }
});

// Startschuss
requestAnimationFrame(draw);