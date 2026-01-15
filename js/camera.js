// js/camera.js
let offsetX = 0;
let offsetY = 0;
let viewX = 0;
let viewY = 0;
const zoom = 1.0; 

// Wir fügen dt als Parameter hinzu
function updateCamera(pX, pY, canvasW, canvasH, dt) {
    // 1. Das Ziel: Die Mitte des aktuellen Tiles, auf dem der Spieler steht
    const currentTileX = Math.floor(pX / TILE_W);
    const currentTileY = Math.floor(pY / TILE_H);

    const tileCenterX = (currentTileX * TILE_W) + (TILE_W / 2);
    const tileCenterY = (currentTileY * TILE_H) + (TILE_H / 2);

    const targetX = tileCenterX - (canvasW / 2);
    const targetY = tileCenterY - (canvasH / 2);
    
    // 2. Zeitbasierte Glättung (Lerp)
    // Die Formel: (Ziel - Aktuell) * Geschwindigkeit * Zeit
    // 2.5 ist ein guter Wert für "geschmeidig, aber zügig"
    const lerpSpeed = 2.5; 
    
    offsetX += (targetX - offsetX) * lerpSpeed * dt;
    offsetY += (targetY - offsetY) * lerpSpeed * dt;

    // 3. Sichtbereich für das Tile-Rendering berechnen
    viewX = Math.floor(offsetX / TILE_W);
    viewY = Math.floor(offsetY / TILE_H);
}