import { getDeliveryZone } from "../config/Constants.js";

export class Player {
  // reference value in ideal design
  static designWidth = 30;
  static designHeight = 97 / 42 * Player.designWidth; // 970/420 is the aspect ratio of the player image
  static designBaseSpeed = 3.5; // add from 2.67 to 3.5 after reducing from 4 to 2.67 (2/3 of original)

  constructor(x, y, playerOption = "option1") {
    //if no position available, set player at the right side of delivery area
    if (x !== null && y !== null) {
      this.relativeX = x / width;  // store relative position
      this.relativeY = y / height;
      this.x = x;
      this.y = y;
    } else {
      // default position at left of delivery zone
      const deliveryZone = getDeliveryZone();
      this.relativeX = (deliveryZone.x - scaler.scale(30)) / width;
      this.relativeY = deliveryZone.y / height;
      this.x = deliveryZone.x - scaler.scale(30);
      this.y = deliveryZone.y;
    }

    this.width = scaler.scale(Player.designWidth);
    this.height = scaler.scale(Player.designHeight);
    this.baseSpeed = Player.designBaseSpeed;
    this.speed = this.baseSpeed;
    this.score = 0;
    this.hasItem = false;
    this.currentItem = null;
    this.playerOption = playerOption || "option1";
    this.isFlipped = false;
  }

  reset() {
    const deliveryZone = getDeliveryZone();
    this.relativeX = (deliveryZone.x - scaler.scale(30)) / width;
    this.relativeY = deliveryZone.y / height;
    this.x = deliveryZone.x - scaler.scale(30);
    this.y = deliveryZone.y;
    
    this.speed = this.baseSpeed;
    this.score = 0;
    this.hasItem = false;
    this.currentItem = null;
  }

  resetPosition() {
    this.relativeX = 0.85; // 70% + 15% of the remaining width
    this.relativeY = 0.5;  // middle of height
    this.x = width * this.relativeX;
    this.y = height * this.relativeY;
  }

  updateSizeAndPosition() {
    // Update player size based on scaling
    this.width = scaler.scale(Player.designWidth);
    this.height = scaler.scale(Player.designHeight);
    
    // Update position based on relative coordinates
    this.x = width * this.relativeX;
    this.y = height * this.relativeY;
  }

  update(keys) {
    // Check both arrow keys and WASD keys
    if (keys[LEFT_ARROW] || keys[65]) { // LEFT_ARROW or 'A'
      this.relativeX = Math.max(0, this.relativeX - this.speed / width);
      this.x = width * this.relativeX;
      this.isFlipped = false;
    }
    if (keys[RIGHT_ARROW] || keys[68]) { // RIGHT_ARROW or 'D'
      this.relativeX = Math.min(1 - this.width / width, this.relativeX + this.speed / width);
      this.x = width * this.relativeX;
      this.isFlipped = true;
    }
    if (keys[UP_ARROW] || keys[87]) { // UP_ARROW or 'W'
      this.relativeY = Math.max(0, this.relativeY - this.speed / height);
      this.y = height * this.relativeY;
    }
    if (keys[DOWN_ARROW] || keys[83]) { // DOWN_ARROW or 'S'
      this.relativeY = Math.min(1 - this.height / height, this.relativeY + this.speed / height);
      this.y = height * this.relativeY;
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
      // if (this.playerOption === "option1") {
      //   image(assetManager.getImage("player1Pickup"), this.x, this.y, this.width, this.height);
      // } else {
      //   image(assetManager.getImage("player2Pickup"), this.x, this.y, this.width, this.height);
      // }
      fill(0, 255, 0);
      // Draw item with size based on weight if player has one
      const itemSize = 10 * (0.8 + this.currentItem.weight * 0.1);
      rect(this.x + 10, this.y + 20, itemSize, itemSize);
    }
  }

  pickupItem(item) {
    this.hasItem = true;
    this.currentItem = item;
    // Adjust speed based on item weight - speed decreases as weight increases
    // With weight range 1-5, speed will be between 3.5 and 2.0
    this.speed = this.baseSpeed * (1 - item.weight * 0.1);
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
}
