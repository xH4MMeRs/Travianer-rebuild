const player = {
    worldX: 10 * TILE_W + 390, 
    worldY: 10 * TILE_H + 230,
    vx: 0, vy: 0,
    accel: 0.6,      // Etwas spritziger beim Anlaufen
    friction: 0.82,   // Sorgt für direktes Stoppen auf dem Punkt
    maxSpeed: 2.2,    // Höhere Endgeschwindigkeit auf der Schnur
    footOffset: 20,
    isMoving: false, 
    direction: 'right',
    waypoints: [],    // Hier wird der Pfad aus pathfinding.js gespeichert
    currentFrame: 0, lastFrameUpdate: 0,
    imgStand: new Image(), imgWalk: new Image()
};

player.imgStand.src = 'res/sprites/roemer_stand.png';
player.imgWalk.src = 'res/sprites/roemer_walk_right.png';

function updateMovement() {
    if (player.waypoints.length > 0) {
        player.isMoving = true;
        
        const target = player.waypoints[0];
        const dx = target.x - player.worldX;
        // Die Füße stehen auf der 14px-Linie
        const dy = target.y - (player.worldY + player.footOffset); 
        const dist = Math.sqrt(dx * dx + dy * dy);

        const speed = player.maxSpeed;

        if (dist < speed) {
            // Bei feinem Gitter: Wenn Punkt nah, sofort zum nächsten, 
            // damit die Bewegung flüssig bleibt.
            player.worldX = target.x;
            player.worldY = target.y - player.footOffset;
            player.waypoints.shift();
        } else {
            player.worldX += (dx / dist) * speed;
            player.worldY += (dy / dist) * speed;
            player.direction = (dx < 0) ? 'left' : 'right';
        }
        
        // Wichtig für die Animation in der draw()
        player.vx = dx; 
        player.vy = dy;
    } else {
        player.isMoving = false;
        player.vx = 0;
        player.vy = 0;
    }
}