class CollisionDetector {
    // Check collision between player (circle) and rectangular object
    static checkPlayerRectCollision(player, rect) {
        return (
            player.x < rect.x + rect.width &&
            player.x + player.size > rect.x &&
            player.y < rect.y + rect.height &&
            player.y + player.size > rect.y
        );
    }
    
    // Check if player is in picking distance of an item
    static checkPlayerItemProximity(player, item) {
        return dist(player.x, player.y, item.x, item.y) < 30;
    }
    
    // Check if player is in delivery zone
    static isInDeliveryZone(player) {
        return player.x > 550;
    }
    
    // Check for collision between player and all cars
    static checkCarCollisions(player, cars) {
        for (const laneType in cars) {
            for (const car of cars[laneType]) {
                if (this.checkPlayerRectCollision(player, car)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    // Check for collision between player and obstacles
    static handleObstacleCollisions(player, obstacles) {
        for (const obstacle of obstacles) {
            if (this.checkPlayerRectCollision(player, obstacle)) {
                // Push player outside the obstacle
                if (player.x < obstacle.x) {
                    player.x = obstacle.x - player.size;
                } else if (player.x > obstacle.x) {
                    player.x = obstacle.x + obstacle.width;
                }
                return true;
            }
        }
        return false;
    }
}