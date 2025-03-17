import { getDeliveryZone } from "../config/Constants.js";

export class CollisionDetector {
  // Check collision between player and car
  static checkPlayerRectCollision(player, rect) {
    return (
      player.x < rect.x + rect.width && // player left edge < car right edge
      player.x + player.width > rect.x && // player right edge > car left edge
      player.y + player.height / 3 < rect.y + rect.height && // player 2 third top edge < car bottom edge
      player.y + player.height > rect.y // player bottom edge > car top edge
    );
  }

  // Check if player is in picking distance of an item
  static checkPlayerItemProximity(player, item) {
    // logic changed to similar with checkPlayerRectCollision()
    const itemSize = item.size;
    return (
      item.x < player.x + player.width &&
      item.x + itemSize > player.x &&
      item.y < player.y + player.height &&
      item.y + itemSize > player.y
    );
  }

  // Check if player is in delivery zone
  static isInDeliveryZone(player) {
    const deliveryZone = getDeliveryZone();
    // logic changed to similar with checkPlayerRectCollision()
    return (
      player.x < deliveryZone.x + deliveryZone.size &&
      player.x + player.width > deliveryZone.x &&
      player.y < deliveryZone.y + deliveryZone.size &&
      player.y + player.height > deliveryZone.y
    );
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
        if (player.x < obstacle.x ) {
          player.x = obstacle.x - player.width; // Push player to the left of the obstacle
        } else if (player.x > obstacle.x) {
          player.x = obstacle.x + obstacle.width; // Push player to the right of the obstacle
        }

        return true;
      }
    }
    return false;
  }
}