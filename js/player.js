// js/player.js

const player = {
    worldX: 10 * TILE_W + 390, 
    worldY: 10 * TILE_H + 230,
    vx: 0, 
    vy: 0,
    maxSpeed: 140, 
    footOffset: 20,
    isMoving: false, 
    direction: 'right',
    waypoints: [], 
    currentFrame: 0, 
    lastFrameUpdate: 0,
    imgStand: new Image(), 
    imgWalk: new Image()
};

player.imgStand.src = 'res/sprites/roemer_stand.png';
player.imgWalk.src = 'res/sprites/roemer_walk_right.png';

function updateMovement(dt) {
    // 1. Grundsätzliche Prüfung: Haben wir überhaupt Ziele?
    if (player.waypoints.length > 0) {
        const target = player.waypoints[0];
        const dx = target.x - player.worldX;
        const dy = target.y - (player.worldY + player.footOffset); 
        const dist = Math.sqrt(dx * dx + dy * dy);

        const moveDistance = player.maxSpeed * dt;

        // 2. Zielpunkt-Logik
        if (dist < moveDistance || dist < 0.5) {
            // Punkt erreicht: Teleport auf exakte Zielposition
            player.worldX = target.x;
            player.worldY = target.y - player.footOffset;
            player.waypoints.shift();
            
            // WICHTIG: Wenn das das Ende war, sofort Bewegung stoppen
            if (player.waypoints.length === 0) {
                player.isMoving = false;
                player.vx = 0;
                player.vy = 0;
            }
        } else {
            // 3. Aktive Bewegung
            player.isMoving = true;
            
            // Richtung berechnen
            const moveX = (dx / dist) * moveDistance;
            const moveY = (dy / dist) * moveDistance;
            
            player.worldX += moveX;
            player.worldY += moveY;
            
            // Nur Richtung ändern, wenn die Bewegung signifikant ist (gegen Flackern)
            if (Math.abs(dx) > 0.1) {
                player.direction = (dx < 0) ? 'left' : 'right';
            }

            // vx/vy für die Animation in game.js bereitstellen
            player.vx = dx; 
            player.vy = dy;
        }
    } else {
        // Absoluter Stillstand
        player.isMoving = false;
        player.vx = 0;
        player.vy = 0;
    }
}