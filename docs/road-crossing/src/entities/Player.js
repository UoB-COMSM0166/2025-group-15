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
    this.isHit = false; // Whether hit by a car
    this.hitTime = 0; // Time when hit
    this.hitDuration = 300; // Duration of lying down (milliseconds)
    // Lying down image aspect ratio
    this.lyingWidth = 97;
    this.lyingHeight = 42;
    this.respawnX = 0; // Respawn position X
    this.respawnY = 0; // Respawn position Y
    
    // Walking animation related
    this.animationFrame = 0; // Current animation frame
    this.walkingDelay = 200; // Walking animation frame switch delay (milliseconds)
    this.lastFrameTime = 0; // Last frame switch time
    this.isMoving = false; // Whether is moving
    this.lastX = x; // Last frame X coordinate
    this.lastY = y; // Last frame Y coordinate
  }

  reset() {
    // Position player at the right side of delivery area
    const playerX = width * 0.7 + (width * 0.3) / 2; // Middle of delivery area
    const playerY = height / 2;
    
    this.x = playerX;
    this.y = playerY;
    this.respawnX = playerX;
    this.respawnY = playerY;
    this.speed = this.baseSpeed;
    this.score = 0;
    this.hasItem = false;
    this.currentItem = null;
    this.isHit = false;
    this.animationFrame = 0;
    this.lastFrameTime = 0;
  }

  resetPosition() {
    // Save respawn position, but don't teleport immediately
    this.respawnX = width * 0.7 + (width * 0.3) / 2; // Middle of delivery area
    this.respawnY = height / 2;
    
    // Set hit state, but keep current position
    this.isHit = true;
    this.hitTime = millis();
  }

  update(keys) {
    // Save previous frame position to detect movement
    this.lastX = this.x;
    this.lastY = this.y;
    
    // Check if hit state is over
    if (this.isHit) {
      if (millis() - this.hitTime > this.hitDuration) {
        this.isHit = false;
        // After hit state ends, teleport to respawn point
        this.x = this.respawnX;
        this.y = this.respawnY;
      }
      return; // Can't move in hit state
    }

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
    
    // Detect whether moving
    this.isMoving = (this.x !== this.lastX || this.y !== this.lastY);
    
    // Update animation frame
    if (this.isMoving) {
      const currentTime = millis();
      if (currentTime - this.lastFrameTime > this.walkingDelay) {
        this.animationFrame = (this.animationFrame + 1) % 2; // Toggle between 0 and 1
        this.lastFrameTime = currentTime;
      }
    } else {
      this.animationFrame = 0; // Reset to standing frame when not moving
    }
  }

  draw() {
    push(); // Save current drawing style

    if (this.isHit) {
      if (this.playerOption === "option1") {
        // 使用倒地图片，保持宽高比
        const lyingScale = this.width / 30; // 保持与正常图片相同的比例
        const drawWidth = this.lyingWidth * lyingScale;
        const drawHeight = this.lyingHeight * lyingScale;
        
        // 使用CORNER模式绘制，与行走图片保持一致
        imageMode(CORNER);
        
        image(
          assetManager.getImage("player1Lying"),
          this.x,
          this.y,
          drawWidth,
          drawHeight
        );
      } else if (this.playerOption === "option2") {
        // 角色2倒地图片
        const lyingScale = this.width / 30; // 保持与正常图片相同的比例
        const drawWidth = this.lyingWidth * lyingScale;
        const drawHeight = this.lyingHeight * lyingScale;
        
        // 使用CORNER模式绘制，与行走图片保持一致
        imageMode(CORNER);
        
        image(
          assetManager.getImage("player2Lying"),
          this.x,
          this.y,
          drawWidth,
          drawHeight
        );
      }
    } else if (this.playerOption === "option1") {
      imageMode(CORNER); // 恢复原始模式
      
      // Get aspect ratio information for both image types
      const walkingRatio = assetManager.images["player1WalkingRatio"] || { ratio: 97/42 };
      const sideViewRatio = assetManager.images["player1SideViewRatio"] || { ratio: walkingRatio.ratio };
      
      // Choose different images based on whether player is holding an item
      if (this.hasItem) {
        if (this.isFlipped) {
          scale(-1, 1); // 水平翻转
          
          // 根据动画帧选择不同的图片
          if (this.isMoving && this.animationFrame === 1) {
            image(
              assetManager.getImage("player1WalkingWithCargo"),
              -this.x - this.width, // flipped x coordinate
              this.y,
              this.width,
              this.height
            );
          } else {
            image(
              assetManager.getImage("player1WithCargo"),
              -this.x - this.width, // flipped x coordinate
              this.y,
              this.width,
              this.height
            );
          }
        } else {
          // 根据动画帧选择不同的图片
          if (this.isMoving && this.animationFrame === 1) {
            image(
              assetManager.getImage("player1WalkingWithCargo"),
              this.x,
              this.y,
              this.width,
              this.height
            );
          } else {
            image(
              assetManager.getImage("player1WithCargo"),
              this.x,
              this.y,
              this.width,
              this.height
            );
          }
        }
      } else {
        // Walking animation when not carrying items
        if (this.isFlipped) {
          // Facing right - use right-facing image, alternating when moving
          if (this.isMoving) {
            // Alternate between two images based on animation frame
            if (this.animationFrame === 0) {
              // First frame - use right-facing image
              const drawHeight = this.height;
              const drawWidth = drawHeight * sideViewRatio.ratio;
              
              image(
                assetManager.getImage("player1SideView"),
                this.x,
                this.y,
                drawWidth,
                drawHeight
              );
            } else {
              // Second frame - use flipped left-facing walking image
              push();
              scale(-1, 1); // Horizontal flip
              
              const drawHeight = this.height;
              const drawWidth = drawHeight * walkingRatio.ratio;
              
              image(
                assetManager.getImage("player1Walking"),
                -this.x - drawWidth, 
                this.y,
                drawWidth,
                drawHeight
              );
              pop(); // Restore transformation
            }
          } else {
            // Static - use right-facing standing image
            const drawHeight = this.height;
            const drawWidth = drawHeight * sideViewRatio.ratio;
            
            image(
              assetManager.getImage("player1SideView"),
              this.x,
              this.y,
              drawWidth,
              drawHeight
            );
          }
        } else {
          // Facing left - alternate between walking image and flipped right-facing image
          if (this.isMoving) {
            // Alternate between two images based on animation frame
            if (this.animationFrame === 0) {
              // First frame - use walking image
              const drawHeight = this.height;
              const drawWidth = drawHeight * walkingRatio.ratio;
              
              image(
                assetManager.getImage("player1Walking"),
                this.x,
                this.y,
                drawWidth,
                drawHeight
              );
            } else {
              // Second frame - flip right-facing image
              push();
              scale(-1, 1); // Horizontal flip
              
              // Calculate size based on SideView image ratio
              const drawHeight = this.height;
              const drawWidth = drawHeight * sideViewRatio.ratio;
              
              image(
                assetManager.getImage("player1SideView"),
                -this.x - drawWidth, // 根据实际宽度调整翻转坐标
                this.y,
                drawWidth,
                drawHeight
              );
              pop(); // Restore transformation to avoid affecting subsequent drawing
            }
          } else {
            // Static - use right-facing standing image, but flipped
            push();
            scale(-1, 1); // Horizontal flip
            
            const drawHeight = this.height;
            const drawWidth = drawHeight * sideViewRatio.ratio;
            
            image(
              assetManager.getImage("player1SideView"),
              -this.x - drawWidth, // 根据实际宽度调整翻转坐标
              this.y,
              drawWidth,
              drawHeight
            );
            pop(); // Restore transformation
          }
        }
      }
    } else if (this.playerOption === "option2") {
      imageMode(CORNER); // 恢复原始模式
      
      // Get aspect ratio information for both image types
      const walkingRatio = assetManager.images["player2WalkingRatio"] || { ratio: 97/42 };
      const sideViewRatio = assetManager.images["player2SideViewRatio"] || { ratio: walkingRatio.ratio };
      
      // Choose different images based on whether player is holding an item
      if (this.hasItem) {
        if (this.isFlipped) {
          scale(-1, 1); // 水平翻转
          
          // 根据动画帧选择不同的图片
          if (this.isMoving && this.animationFrame === 1) {
            image(
              assetManager.getImage("player2WalkingWithCargo"),
              -this.x - this.width, // flipped x coordinate
              this.y,
              this.width,
              this.height
            );
          } else {
            image(
              assetManager.getImage("player2WithCargo"),
              -this.x - this.width, // flipped x coordinate
              this.y,
              this.width,
              this.height
            );
          }
        } else {
          // 根据动画帧选择不同的图片
          if (this.isMoving && this.animationFrame === 1) {
            image(
              assetManager.getImage("player2WalkingWithCargo"),
              this.x,
              this.y,
              this.width,
              this.height
            );
          } else {
            image(
              assetManager.getImage("player2WithCargo"),
              this.x,
              this.y,
              this.width,
              this.height
            );
          }
        }
      } else {
        // Walking animation when not carrying items
        if (this.isFlipped) {
          // Facing right - use right-facing image, alternating when moving
          if (this.isMoving) {
            // Alternate between two images based on animation frame
            if (this.animationFrame === 0) {
              // First frame - use right-facing image
              const drawHeight = this.height;
              const drawWidth = drawHeight * sideViewRatio.ratio;
              
              image(
                assetManager.getImage("player2SideView"),
                this.x,
                this.y,
                drawWidth,
                drawHeight
              );
            } else {
              // Second frame - use flipped left-facing walking image
              push();
              scale(-1, 1); // Horizontal flip
              
              const drawHeight = this.height;
              const drawWidth = drawHeight * walkingRatio.ratio;
              
              image(
                assetManager.getImage("player2Walking"),
                -this.x - drawWidth, // 根据实际宽度调整翻转坐标
                this.y,
                drawWidth,
                drawHeight
              );
              pop(); // Restore transformation
            }
          } else {
            // Static - use right-facing standing image
            const drawHeight = this.height;
            const drawWidth = drawHeight * sideViewRatio.ratio;
            
            image(
              assetManager.getImage("player2SideView"),
              this.x,
              this.y,
              drawWidth,
              drawHeight
            );
          }
        } else {
          // Facing left - alternate between walking image and flipped right-facing image
          if (this.isMoving) {
            // Alternate between two images based on animation frame
            if (this.animationFrame === 0) {
              // First frame - use walking image
              const drawHeight = this.height;
              const drawWidth = drawHeight * walkingRatio.ratio;
              
              image(
                assetManager.getImage("player2Walking"),
                this.x,
                this.y,
                drawWidth,
                drawHeight
              );
            } else {
              // Second frame - flip right-facing image
              push();
              scale(-1, 1); // Horizontal flip
              
              // Calculate size based on SideView image ratio
              const drawHeight = this.height;
              const drawWidth = drawHeight * sideViewRatio.ratio;
              
              image(
                assetManager.getImage("player2SideView"),
                -this.x - drawWidth, // 根据实际宽度调整翻转坐标
                this.y,
                drawWidth,
                drawHeight
              );
              pop(); // Restore transformation to avoid affecting subsequent drawing
            }
          } else {
            // Static - use right-facing standing image, but flipped
            push();
            scale(-1, 1); // Horizontal flip
            
            const drawHeight = this.height;
            const drawWidth = drawHeight * sideViewRatio.ratio;
            
            image(
              assetManager.getImage("player2SideView"),
              -this.x - drawWidth, // 根据实际宽度调整翻转坐标
              this.y,
              drawWidth,
              drawHeight
            );
            pop(); // Restore transformation
          }
        }
      }
    }
    pop(); // restore drawing style

    // 不再需要绘制物品矩形，因为使用持有物品的图片
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
}