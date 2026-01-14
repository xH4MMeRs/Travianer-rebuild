// js/camera.js
let offsetX = 0;
let offsetY = 0;
let viewX = 0;
let viewY = 0;
const zoom = 1.0; // Wir gehen zurück auf 100% Schärfe

function updateCamera(pX, pY, canvasW, canvasH) {
    // 1. Tile finden
    const currentTileX = Math.floor(pX / TILE_W);
    const currentTileY = Math.floor(pY / TILE_H);

    // 2. Mitte des Tiles berechnen
    const tileCenterX = (currentTileX * TILE_W) + (TILE_W / 2);
    const tileCenterY = (currentTileY * TILE_H) + (TILE_H / 2);

    // 3. Ziel (Da zoom 1.0 ist, brauchen wir keine Division mehr)
    const targetX = tileCenterX - (canvasW / 2);
    const targetY = tileCenterY - (canvasH / 2);
    
    // 4. Sanftes Gleiten
    offsetX += (targetX - offsetX) * 0.04;
    offsetY += (targetY - offsetY) * 0.04;

    viewX = Math.floor(offsetX / TILE_W);
    viewY = Math.floor(offsetY / TILE_H);
}