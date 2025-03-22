class Game {
    constructor() {
        this.currentState = GAME_STATES.MENU;
        this.currentLevel = 1;
        
        // Explicitly set unlocked levels based on game mode
        if (currentGameMode === GAME_MODE.TESTING) {
            this.unlockedLevels = 3;
        } else {
            this.unlockedLevels = this.loadGameProgress();
        }
        
        this.isAudioEnabled = true;
        this.volume = 0.5;
        
        this.player = new Player();
        this.carSystem = new CarSystem(this);
        this.itemSystem = new ItemSystem();
        this.obstacleSystem = new ObstacleSystem();
        this.uiManager = new UIManager(this);
        
        this.gameTime = currentGameMode === GAME_MODE.TESTING ? 10000 : 60;
        this.startTime = 0;
        this.keys = {};
    }
  
  loadGameProgress() {
      this.unlockedLevels = GameStorage.loadGameProgress();
  }
  
  saveGameProgress() {
      GameStorage.saveGameProgress(this.unlockedLevels);
  }
  
  startNewGame(level) {
      this.currentLevel = level;
      this.currentState = GAME_STATES.PLAYING;
      this.resetGame();
  }
  
  resetGame() {
      this.player.reset();
      this.carSystem.reset();
      this.itemSystem.reset();
      this.obstacleSystem.reset();
      
      // Set game time based on mode
      this.gameTime = currentGameMode === GAME_MODE.TESTING ? 10000 : 60;
      
      this.startTime = millis();
      
      // Generate obstacles for level 3
      if (this.currentLevel === 3) {
          this.obstacleSystem.generateObstacles();
      }
  }
  
  update() {
      if (this.currentState !== GAME_STATES.PLAYING) return;
      
      // Update game time
      this.gameTime = currentGameMode === GAME_MODE.TESTING ? 10000 : 60 - floor((millis() - this.startTime) / 1000);
      
      // Generate cars
      if (frameCount % 60 === 0) {
          this.carSystem.generateCars(frameCount);
      }
      
      // Update cars and check for collisions
      const carCollision = this.carSystem.update(this.player);
      
      // Handle car collision
      if (carCollision) {
          this.handleCarCollision();
      }
      
      // Update player position
      this.player.update(this.keys);
      
      // Check obstacle collisions for level 3
      if (this.currentLevel === 3) {
          this.obstacleSystem.checkCollisions(this.player);
      }
      
      // Check game status
      this.checkGameStatus();
  }
  
  handleCarCollision() {
      if (this.player.hasItem) {
          this.itemSystem.handleItemPickupDrop(this.player);
      }
      
      this.player.resetPosition();
  }
  
  checkGameStatus() {
      // Check if time is up
      if (this.gameTime <= 0) {
          this.currentState = GAME_STATES.GAME_OVER;
          return;
      }
      
      // Check if level target is reached
      this.checkLevelComplete();
  }
  
  checkLevelComplete() {
      const config = LEVEL_CONFIG[this.currentLevel];
      if (this.player.score >= config.targetScore) {
          this.currentState = GAME_STATES.LEVEL_COMPLETE;
          
          // Unlock next level if not already unlocked
          if (this.currentLevel === this.unlockedLevels && currentGameMode !== GAME_MODE.TESTING) {
              this.unlockedLevels = Math.min(3, this.unlockedLevels + 1);
              this.saveGameProgress();
          }
      }
  }
  
  drawGame() {
      background(200);
      
      // Draw game areas
      fill(150);
      rect(0, 0, 200, height); // Warehouse
      fill(100);
      rect(200, 0, 350, height); // Road
      fill(150);
      rect(550, 0, 250, height); // Delivery area
      
      // Draw lane dividers
      this.drawLaneLines();
      
      // Update game elements if playing
      if (this.currentState === GAME_STATES.PLAYING) {
          this.update();
      }
      
      // Draw game elements
      this.drawGameElements();
      
      // Show game status
      this.uiManager.drawGameStatus();
  }
  
  drawLaneLines() {
      stroke(255);
      this.setLineDash([10, 10]); // Set dashed line style
      line(325, 0, 325, height);
      line(425, 0, 425, height);
      this.setLineDash([]);  // Reset to solid line
      noStroke();
  }
  
  drawGameElements() {
      // Draw obstacles
      if (this.currentLevel === 3) {
          this.obstacleSystem.draw();
      }
      
      // Draw cars
      this.carSystem.draw();
      
      // Draw items
      this.itemSystem.draw();
      
      // Draw player
      this.player.draw();
  }
  
  setLineDash(list) {
      drawingContext.setLineDash(list);
  }
  
  handleKeyPressed(keyCode) {
      this.keys[keyCode] = true;
      
      if (keyCode === ESCAPE && 
          (this.currentState === GAME_STATES.PLAYING || 
           this.currentState === GAME_STATES.PAUSED)) {
          this.currentState = this.currentState === GAME_STATES.PLAYING ? 
              GAME_STATES.PAUSED : GAME_STATES.PLAYING;
      }
      
      if (keyCode === 32 && this.currentState === GAME_STATES.PLAYING) {
          // Space key for item interaction
          const itemDelivered = this.itemSystem.handleItemPickupDrop(this.player);
          if (itemDelivered) {
              this.checkLevelComplete();
          }
      }
  }
  
  handleKeyReleased(keyCode) {
      this.keys[keyCode] = false;
  }
  
  handleMouseClicked() {
      switch (this.currentState) {
          case GAME_STATES.MENU:
              this.uiManager.handleMainMenuClicks(mouseX, mouseY);
              break;
          case GAME_STATES.LEVEL_SELECT:
              this.uiManager.handleLevelSelectClicks(mouseX, mouseY);
              break;
          case GAME_STATES.PAUSED:
              this.uiManager.handlePauseMenuClicks(mouseX, mouseY);
              break;
          case GAME_STATES.LEVEL_COMPLETE:
              this.uiManager.handleLevelCompleteClicks(mouseX, mouseY);
              break;
          case GAME_STATES.GAME_OVER:
              this.uiManager.handleGameOverClicks(mouseX, mouseY);
              break;
          case GAME_STATES.HELP:
              this.uiManager.handleHelpScreenClicks(mouseX, mouseY);
              break;
          case GAME_STATES.AUDIO:
              this.uiManager.handleAudioSettingsClicks(mouseX, mouseY);
              break;
      }
  }
  
  draw() {
      switch (this.currentState) {
          case GAME_STATES.MENU:
              this.uiManager.drawMainMenu();
              break;
          case GAME_STATES.PLAYING:
              this.drawGame();
              break;
          case GAME_STATES.PAUSED:
              this.drawGame();
              this.uiManager.drawPauseMenu();
              break;
          case GAME_STATES.LEVEL_COMPLETE:
              this.drawGame();
              this.uiManager.drawLevelComplete();
              break;
          case GAME_STATES.GAME_OVER:
              this.drawGame();
              this.uiManager.drawGameOver();
              break;
          case GAME_STATES.LEVEL_SELECT:
              this.uiManager.drawLevelSelect();
              break;
          case GAME_STATES.HELP:
              this.uiManager.drawHelpScreen();
              break;
          case GAME_STATES.AUDIO:
              this.uiManager.drawAudioSettings();
              break;
      }
  }
}