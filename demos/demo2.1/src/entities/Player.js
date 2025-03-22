export class Player {
  constructor(x, y, playerOption = "option1") {
    this.x = x || (width * 0.7 + (width * 0.3) / 2); // Default to middle of delivery area
    this.y = y || height / 2;
    this.width = 30;
    this.height = 97 / 42 * this.width; // 97/42 is the aspect ratio of the player image
    this.baseSpeed = 2.67; // Reduced from 4 to 2.67 (2/3 of original)
    this.speed = this.baseSpeed;
    this.score = 0;
    this.hasItem = false;
    this.currentItem = null;
    this.playerOption = playerOption || "option1"; // default character option1
    this.isFlipped = false; // if player is flipped
  }


  reset() {
    // Position player at the right side of delivery area
    const playerX = width * 0.7 + (width * 0.3) / 2; // Middle of delivery area
    const playerY = height / 2;
    
    this.x = playerX;
    this.y = playerY;
    this.speed = this.baseSpeed;
    this.score = 0;
    this.hasItem = false;
    this.currentItem = null;
  }

  resetPosition() {
    // Position player at the right side of delivery area
    const playerX = width * 0.7 + (width * 0.3) / 2; // Middle of delivery area
    const playerY = height / 2;
    
    this.x = playerX;
    this.y = playerY;
  }

  update(keys) {
    // Check both arrow keys and WASD keys
    if (keys[LEFT_ARROW] || keys[65]) { // LEFT_ARROW or 'A'
      this.x = Math.max(0, this.x - this.speed);
      this.isFlipped = false;
    }
    if (keys[RIGHT_ARROW] || keys[68]) { // RIGHT_ARROW or 'D'
      this.x = Math.min(width - this.width, this.x + this.speed);
      this.isFlipped = true;
    }
    if (keys[UP_ARROW] || keys[87]) { // UP_ARROW or 'W'
      this.y = Math.max(0, this.y - this.speed);
    }
    if (keys[DOWN_ARROW] || keys[83]) { // DOWN_ARROW or 'S'
      this.y = Math.min(height - this.height, this.y + this.speed);
    }
  }

  draw() {
    push(); // Save current drawing style
    if (this.playerOption === "option1") {
      if (this.isFlipped) {
        scale(-1, 1); // flip horizontally, first parameter is for x-axis, second is for y-axis, 
        image(
          assetManager.getImage("player1"),
          -this.x - this.width, // flipped x coordinate
          this.y,
          this.width,
          this.height
        );
      } else {
        image(
          assetManager.getImage("player1"),
          this.x,
          this.y,
          this.width,
          this.height
        );
      }
    } else if (this.playerOption === "option2") {
      if (this.isFlipped) {
        scale(-1, 1); // flip horizontally  
        image(
          assetManager.getImage("player2"),
          -this.x - this.width, // flipped x coordinate
          this.y,
          this.width,
          this.height
        );
      } else {
        image(
          assetManager.getImage("player2"),
          this.x,
          this.y,
          this.width,
          this.height
        );
      }
    }
    pop(); // restore drawing style

    // Draw item if player has one
    if (this.hasItem) {
      fill(0, 255, 0);
      // Draw item with size based on weight if player has one
      const itemSize = 10 * (0.8 + this.currentItem.weight * 0.1);
      rect(this.x + 10, this.y + 20, itemSize, itemSize);
    }
  }

  pickupItem(item) {
    this.hasItem = true;
    this.currentItem = item;
    // Adjust speed based on item weight
    // Keep the same formula but with reduced base speed
    this.speed = this.baseSpeed / (0.7 + item.weight * 0.15);
  }

  dropItem() {
    const droppedItem = this.currentItem;
    this.hasItem = false;
    this.currentItem = null;
    // Reset speed
    this.speed = this.baseSpeed;
    return droppedItem;
  }

  deliverItem() {
    const deliveredItem = this.currentItem;
    this.score += deliveredItem.value;
    this.hasItem = false;
    this.currentItem = null;
    // Reset speed
    this.speed = this.baseSpeed;
    return deliveredItem;
  }


  canPickupItem(item) {
    let distance = Math.sqrt((this.x - item.x) ** 2 + (this.y - item.y) ** 2);
    return distance < 50; // 设定拾取范围
}

pickupItem(item) {
  this.hasItem = true;
  this.currentItem = item;
  this.speed = this.baseSpeed / (0.7 + item.weight * 0.15);
}

}