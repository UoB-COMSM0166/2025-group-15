export class Player {
  constructor(x, y, playerOption = "option1") {
    this.x = x || 700;
    this.y = y || 300;
    this.width = 50;
    this.height = 50;
    this.speed = 4;
    this.score = 0;
    this.hasItem = false;
    this.currentItem = null;
    this.playerOption = playerOption || "option1"; // default character option1
    this.isFlipped = false; // if player is flipped
  }

  reset() {
    this.x = 700;
    this.y = 300;
    this.score = 0;
    this.hasItem = false;
    this.currentItem = null;
  }

  resetPosition() {
    this.x = 700;
    this.y = 300;
  }

  update(keys) {
    if (keys[LEFT_ARROW]) {
      this.x = Math.max(0, this.x - this.speed);
      this.isFlipped = false;
    }
    if (keys[RIGHT_ARROW]) {
      this.x = Math.min(width - this.width, this.x + this.speed);
      this.isFlipped = true;
    }
    if (keys[UP_ARROW]) {
      this.y = Math.max(0, this.y - this.speed);
    }
    if (keys[DOWN_ARROW]) {
      this.y = Math.min(height - this.height, this.y + this.speed);
    }
  }

  draw() {
    push(); // Save current drawing style
    if (this.playerOption === "option1") {
      if (this.isFlipped) {
        scale(-1, 1); // flip horizontally
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
      rect(this.x+10, this.y + 20, 10, 10);
    }
  }

  pickupItem(item) {
    this.hasItem = true;
    this.currentItem = item;
  }

  dropItem() {
    const droppedItem = this.currentItem;
    this.hasItem = false;
    this.currentItem = null;
    return droppedItem;
  }

  deliverItem() {
    const deliveredItem = this.currentItem;
    this.score += deliveredItem.value;
    this.hasItem = false;
    this.currentItem = null;
    return deliveredItem;
  }
}
