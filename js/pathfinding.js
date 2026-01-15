// js/pathfinding.js

const GRID_SIZE = 7; 

const maskCanvas = document.createElement('canvas');
const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
maskCanvas.width = TILE_W;
maskCanvas.height = TILE_H;

let lastMaskId = null;

function isPositionWalkable(x, y) {
    const tx = Math.floor(x / TILE_W);
    const ty = Math.floor(y / TILE_H);
    if (!walkableSet.has(`${tx},${ty}`)) return false;

    const mask = getMaskImage(tx, ty);
    if (mask.exists && mask.ready) {
        const localX = Math.floor(x % TILE_W);
        const localY = Math.floor(y % TILE_H);
        
        const currentMaskId = `${tx},${ty}`;
        if (lastMaskId !== currentMaskId) {
            maskCtx.clearRect(0, 0, TILE_W, TILE_H);
            maskCtx.drawImage(mask.img, 0, 0);
            lastMaskId = currentMaskId;
        }
        
        const imageData = maskCtx.getImageData(localX, localY, 1, 1).data;
        return imageData[0] > 128; 
    }
    return !mask.exists; 
}

function calculatePath(startX, startY, endX, endY) {
    // Falls Ziel im Schwarzen liegt: Sofort abbrechen
    if (!isPositionWalkable(endX, endY)) return null;

    const startNode = { x: Math.round(startX / GRID_SIZE), y: Math.round(startY / GRID_SIZE) };
    const endNode = { x: Math.round(endX / GRID_SIZE), y: Math.round(endY / GRID_SIZE) };

    let openList = [startNode];
    let closedList = new Set();
    let parentMap = new Map();
    
    startNode.g = 0;
    startNode.f = getDistance(startNode, endNode);

    const maxIterations = 3000; 
    let iterations = 0;

    while (openList.length > 0 && iterations < maxIterations) {
        iterations++;
        
        let currentIndex = 0;
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < openList[currentIndex].f) currentIndex = i;
        }
        let current = openList[currentIndex];

        if (current.x === endNode.x && current.y === endNode.y) {
            // PFAD GEFUNDEN: Erst jetzt geben wir das Array zurück
            return reconstructPath(parentMap, current);
        }

        openList.splice(currentIndex, 1);
        closedList.add(`${current.x},${current.y}`);

        const neighbors = [
            { x: current.x + 1, y: current.y }, { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 }, { x: current.x, y: current.y - 1 }
        ];

        for (let neighbor of neighbors) {
            const neighborKey = `${neighbor.x},${neighbor.y}`;
            if (closedList.has(neighborKey)) continue;

            if (!isPositionWalkable(neighbor.x * GRID_SIZE, neighbor.y * GRID_SIZE)) {
                closedList.add(neighborKey);
                continue;
            }

            let tentativeG = current.g + 1;
            let neighborInOpen = openList.find(n => n.x === neighbor.x && n.y === neighbor.y);

            if (!neighborInOpen || tentativeG < neighbor.g) {
                neighbor.g = tentativeG;
                neighbor.f = neighbor.g + getDistance(neighbor, endNode);
                parentMap.set(neighborKey, current);
                if (!neighborInOpen) openList.push(neighbor);
            }
        }
    }
    return null; 
}

function getDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(parentMap, current) {
    const path = [];
    while (current) {
        let worldX = current.x * GRID_SIZE;
        let worldY = current.y * GRID_SIZE;

        // --- OPTIMIERTE ZENTRIERUNG (X & Y) ---
        let left = worldX, right = worldX, top = worldY, bottom = worldY;

        // Horizontale Mitte finden
        for (let i = 0; i < 10; i++) { if (isPositionWalkable(worldX - i, worldY)) left = worldX - i; else break; }
        for (let i = 0; i < 10; i++) { if (isPositionWalkable(worldX + i, worldY)) right = worldX + i; else break; }
        
        // Vertikale Mitte finden
        for (let i = 0; i < 10; i++) { if (isPositionWalkable(worldX, worldY - i)) top = worldY - i; else break; }
        for (let i = 0; i < 10; i++) { if (isPositionWalkable(worldX, worldY + i)) bottom = worldY + i; else break; }

        path.push({ 
            x: (left + right) / 2, 
            y: (top + bottom) / 2 
        });
        current = parentMap.get(`${current.x},${current.y}`);
    }
    return path.reverse(); 
}