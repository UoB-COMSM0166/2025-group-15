export class CollisionDetector {
  // Check collision between player and car
  static checkPlayerRectCollision(player, rect) {
    return (
      player.x < rect.x + rect.width && // player left edge < car right edge
      player.x + player.width > rect.x &&// player right edge > car left edge
      player.y+player.height/2 < rect.y + rect.height &&// player half bottom edge < car bottom edge
      player.y + player.height > rect.y // player bottom edge > car top edge
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
      // Handle left-right collision (already implemented)
      if (player.x + player.width / 2 < obstacle.x + obstacle.width / 2) {
        player.x = obstacle.x - player.width; // Push player to the left of the obstacle
      } else if (player.x > obstacle.x + obstacle.width) {
        player.x = obstacle.x + obstacle.width; // Push player to the right of the obstacle
      }

      // Handle top-bottom collision
      if (player.y + player.height / 2 < obstacle.y + obstacle.height / 2) {
        player.y = obstacle.y - player.height; // Push player to the top of the obstacle
      } else if (player.y > obstacle.y + obstacle.height) {
        player.y = obstacle.y + obstacle.height; // Push player to the bottom of the obstacle
      }

      return true;
    }
  }
  return false;
}
}
