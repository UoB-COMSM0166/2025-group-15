// Import all the classes used
import { CarSystem } from "../systems/CarSystem.js";
import { ItemSystem } from "../systems/ItemSystem.js";
import { ObstacleSystem } from "../systems/ObstacleSystem.js";
import { UiManager } from "../ui/UiManager.js";
import { GameStates, getLaneConfiguration, getGameAreas, getDeliveryZone } from "../config/Constants.js";
import { GameMode } from "../config/GameMode.js";
import { LevelConfig } from "../config/LevelConfig.js";
import { GameStorage } from "../utils/GameStorage.js";
import { Item } from "../entities/Item.js";  // Add Item import for use in handleCarCollision
import { AssetManager } from "../ui/AssetManager.js";

export class Game {
  constructor() {
    this.currentState = GameStates.MENU;
    this.currentLevel = 1;
    this.selectedCharacter = "option1"; // default character option1

    // Explicitly set unlocked levels based on game mode
    if (currentGameMode === GameMode.TESTING) {
      //this.unlockedLevels = 3;

      // Default: Normal Mode
      this.currentGameMode = GameMode.NORMAL;  
      
    } else {
      // directly call the static method of GameStorage class
      this.unlockedLevels = GameStorage.loadGameProgress();
    }

    // clear progress before starting a new game
    GameStorage.clearProgress();

    this.isAudioEnabled = true;
    this.volume = 0.5;

    this.player = null;
    this.carSystem = new CarSystem(this);
    this.itemSystem = new ItemSystem();
    this.obstacleSystem = new ObstacleSystem();
    this.uiManager = new UiManager(this);

    this.gameTime = currentGameMode === GameMode.TESTING ? 10000 : 60;
    this.startTime = 0;
    this.keys = {};
    
    // Get dynamic lanes based on canvas size
    this.updateGameDimensions();
  }

  // Add method to update game dimensions when canvas size changes
  updateGameDimensions() {
    this.lanes = getLaneConfiguration();
    this.gameAreas = getGameAreas();

    // update buttons size when updating game dimensions
    if (this.uiManager) {
      this.uiManager.updateAllButtons();
    }
    if (this.player) {
      this.player.updateSizeAndPosition();
    }
    if (this.carSystem) {
      this.carSystem.updateSizeAndPosition();
    }
    if (this.itemSystem) {
      this.itemSystem.update();
    }
    if (this.obstacleSystem) {
      this.obstacleSystem.update();
    }
  }

  saveGameProgress() {
    GameStorage.saveGameProgress(this.unlockedLevels);
  }

  startNewGame(level) {
    this.currentLevel = level;
    
    // preload current level background
    assetManager.loadLevelBackground(this.currentLevel);
    
    this.resetGame();
    this.currentState = GameStates.PLAYING;
      
    // If audio is enabled, play background music
    if (this.isAudioEnabled) {
      const bgMusic = assetManager.getSound("bgMusic");
      if (bgMusic && !bgMusic.isPlaying()) {
        bgMusic.loop();
      }
    }
  }


  resetGame() {
    this.player.reset();
    this.carSystem.reset();
    this.itemSystem.reset();
    this.obstacleSystem.reset();

    //  Make sure the game time is updated correctly each time you switch modes
    if (currentGameMode === GameMode.TESTING) {
        this.gameTime = 10000;  // Cheating Mode - Infinite time
    } else {
        this.gameTime = 60;  //Normal Mode - 60s
    }

    console.log(`reset game - current modek: ${currentGameMode}, setting time: ${this.gameTime}`);

    this.startTime = millis();

    if (this.currentLevel === 3) {
        this.obstacleSystem.generateObstacles();
    }

    this.carSystem.generateInitialCars();
}

  resetGame() {

    console.log("Reset the current mode in the game:", this.currentGameMode);

    this.player.reset();
    this.carSystem.reset();
    this.itemSystem.reset();
    this.obstacleSystem.reset();

    console.log("Reset successfully: current model:", this.currentGameMode);


    // Set game time based on mode
    this.gameTime = currentGameMode === GameMode.TESTING ? 10000 : 60;

    this.startTime = millis();

    // Generate obstacles for level 3
    if (this.currentLevel === 3) {
      this.obstacleSystem.generateObstacles();
    }
    
    // Generate initial cars to ensure there are cars at start
    this.carSystem.generateInitialCars();
  }

update() {
    if (this.currentState !== GameStates.PLAYING) return;

    // Update game time
    this.gameTime =
      currentGameMode === GameMode.TESTING
        ? 10000
        : 60 - floor((millis() - this.startTime) / 1000);

    // Generate cars every frame instead of every 60 frames
    // This is more reliable and ensures the car generator is called frequently
    this.carSystem.generateCars(frameCount);

    // Update cars and check for collisions
    const carCollision = this.carSystem.update(this.player);

    // Handle car collision
    if (carCollision) {
      this.handleCarCollision();
    }

    // Update player position
    this.player.update(this.keys);

    // Always update and check obstacles for level 3
    if (this.currentLevel === 3) {
      this.obstacleSystem.update(); 
      this.obstacleSystem.checkCollisions(this.player);
    }

    // Check game status
    this.checkGameStatus();
  }

  handleCarCollision() {
    // Revert to the original method which used itemSystem to handle item drop
    // This ensures compatibility with the existing game logic
    if (this.player.hasItem) {
      this.itemSystem.handleItemPickupDrop(this.player);
    }

    this.player.resetPosition();
  }

  checkGameStatus() {
    // Check if time is up
    if (this.gameTime <= 0) {
      this.currentState = GameStates.GAME_OVER;
      return;
    }

    // Check if level target is reached
    this.checkLevelComplete();
  }

  checkLevelComplete() {
    const config = LevelConfig[this.currentLevel];
    if (this.player.score >= config.targetScore) {
      this.currentState = GameStates.LEVEL_COMPLETE;

      // Unlock next level if not already unlocked
      if (
        this.currentLevel === this.unlockedLevels &&
        currentGameMode !== GameMode.TESTING
      ) {
        this.unlockedLevels = Math.min(3, this.unlockedLevels + 1);
        this.saveGameProgress();
      }
    }
  }

  drawGame() {
    // Draw background of every level, default is 200
    const bgImage = assetManager.getLevelBackground(this.currentLevel);

    if (bgImage) {
      image(bgImage, 0, 0, width, height);
    } else {
      background(200); // Default background if image not found
      // try to load background image if it's not already loaded
      if (!assetManager.loadLevelBackground(this.currentLevel)) {}
    }

    // Update dimensions in case of window resize
    this.updateGameDimensions();

    // // Draw game areas with proportional sizing
    // const areas = this.gameAreas;
    
    // fill(150);
    // rect(0, 0, areas.warehouse.width, height); // Warehouse
    // fill(100);
    // rect(areas.road.start, 0, areas.road.width, height); // Road
    // fill(150);
    // rect(areas.delivery.start, 0, areas.delivery.width, height); // Delivery area

    // Draw lane dividers
    this.drawLaneLines();

    // Update game elements if playing
    if (this.currentState === GameStates.PLAYING) {
      this.update();
    }

    // Draw game elements
    this.drawGameElements();

    // Show game status
    //this.uiManager.drawGameStatus();
    this.drawStatusBar();  // new top status
  }

  drawLaneLines() {
    const roadStart = this.gameAreas.road.start;
    const laneWidth = this.lanes.SLOW.width;
    
    stroke(255);
    this.setLineDash([scaler.scale(10), scaler.scale(10)]); // Set dashed line style
    line(roadStart + laneWidth, 0, roadStart + laneWidth, height);
    line(roadStart + laneWidth * 2, 0, roadStart + laneWidth * 2, height);
    this.setLineDash([]); // Reset to solid line
    noStroke();
  }

  drawGameElements() {
    // Draw obstacles
    if (this.currentLevel === 3) {
      this.obstacleSystem.draw();
    }

    // Draw delivery zone
    const deliveryZone = getDeliveryZone();
    fill(deliveryZone.color);
    rect(deliveryZone.x, deliveryZone.y, deliveryZone.size, deliveryZone.size);
    image(assetManager.getImage("cargoBase"), deliveryZone.x, deliveryZone.y, deliveryZone.size, deliveryZone.size);

    // Draw cars
    this.carSystem.draw();

    // Draw items
    this.itemSystem.draw();

    // Draw player
    this.player.draw();
  }



   //new top status bar
   drawStatusBar() {

    const barHeight = 45;
    fill(0,0,0,150);
    //fill(60, 140, 60, 220); // green
    noStroke();
    rect(0, 0, width, barHeight);
    
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);

    // Set the button area width
    const buttonAreaWidth = 50 * 2 + 20; 

    //status information area(screen width minus right button area)
    const availableWidth = width - buttonAreaWidth;

    const sections = 4; // Level, Time, Score, Target
    const sectionWidth = availableWidth / sections;
    
    //
    text(`Level: ${this.currentLevel}`, sectionWidth * 0.5, barHeight / 2);
    text(`Time: ${floor(this.gameTime)}`, sectionWidth * 1.5, barHeight / 2);
    text(`Score: ${this.player ? this.player.score : 0}`, sectionWidth * 2.5, barHeight / 2);
    text(`Target: ${LevelConfig[this.currentLevel].targetScore}`, sectionWidth * 3.5, barHeight / 2);


   
    const buttonSize = 24;  // Adjust button size (originally 30x30, now 24x24)

    const audioImg = this.isAudioEnabled ? assetManager.getImage("volumeOn") : assetManager.getImage("volumeOff");
    if (audioImg) {
      image(audioImg, width - 70, 8, buttonSize, buttonSize);   
    }

    const pauseImg = assetManager.getImage("pause");
    if (pauseImg) {
      image(pauseImg, width - 35, 8, buttonSize, buttonSize);  
    }
  }


  setLineDash(list) {
    drawingContext.setLineDash(list);
  }

  handleKeyPressed(keyCode) {
    this.keys[keyCode] = true;

    if (
      keyCode === ESCAPE &&
      (this.currentState === GameStates.PLAYING ||
        this.currentState === GameStates.PAUSED)
    ) {
      this.currentState =
        this.currentState === GameStates.PLAYING
          ? GameStates.PAUSED
          : GameStates.PLAYING;
    }

    if ((keyCode === 32 || keyCode === 69) && this.currentState === GameStates.PLAYING) {
      // Space key or 'E' for item interaction
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
    const btnSize = 24;  // button size
      const margin = 10;   // button margin
      const volumeX = width - 70; // Volume button X coordinates
      const pauseX = width - 35;  // Pause button X coordinates
      const btnY = 8; //Button Y coordinate (near the top)）
  
      //Detect the mouse click directly in the volume button area
      if (
          mouseX >= volumeX &&
          mouseX <= volumeX + btnSize &&
          mouseY >= btnY &&
          mouseY <= btnY + btnSize
      ) {
          this.isAudioEnabled = !this.isAudioEnabled; // change volume status
          console.log("Audio button is clicked, current status:", this.isAudioEnabled ? "on" : "off");
          return;
      }
  
      //Detect the mouse click directly in the pause button area
      if (
          mouseX >= pauseX &&
          mouseX <= pauseX + btnSize &&
          mouseY >= btnY &&
          mouseY <= btnY + btnSize
      ) {
          this.currentState =
              this.currentState === GameStates.PLAYING
                  ? GameStates.PAUSED
                  : GameStates.PLAYING;
          console.log("Pause button is clicked, current status:", this.currentState);
          return;
      }


    // Check if pause button is clicked
    if (this.currentState === GameStates.PLAYING) {
      if (this.uiManager.checkPauseButtonClick(mouseX, mouseY)) {
        return; // If pause button is clicked, do not process other clicks
      }
      
      // Check if audio button is clicked
      if (this.uiManager.checkAudioButtonClick(mouseX, mouseY)) {
        return; // If audio button is clicked, do not process other clicks
      }
    }
    
    switch (this.currentState) {
      case GameStates.MENU:
        this.uiManager.handleMainMenuClicks(mouseX, mouseY);
        break;
      case GameStates.CHARACTER_SELECT:
        this.uiManager.handleCharacterSelectClicks(mouseX, mouseY);
        break;
      case GameStates.LEVEL_SELECT:
        this.uiManager.handleLevelSelectClicks(mouseX, mouseY);
        break;
      case GameStates.PAUSED:
        this.uiManager.handlePauseMenuClicks(mouseX, mouseY);
        break;
      case GameStates.LEVEL_COMPLETE:
        this.uiManager.handleLevelCompleteClicks(mouseX, mouseY);
        break;
      case GameStates.GAME_OVER:
        this.uiManager.handleGameOverClicks(mouseX, mouseY);
        break;
      case GameStates.HELP:
        this.uiManager.handleHelpScreenClicks(mouseX, mouseY);
        break;
      case GameStates.AUDIO:
        this.uiManager.handleAudioSettingsClicks(mouseX, mouseY);
        break;
      case GameStates.SETTINGS:
        this.uiManager.handleSettingsScreenClicks(mouseX, mouseY);
        break;
    }
  }

  draw() {
    switch (this.currentState) {
      case GameStates.MENU:
        this.uiManager.drawMainMenu();
        break;
      case GameStates.CHARACTER_SELECT:
        this.uiManager.drawCharacterSelect();
        break;
      case GameStates.PLAYING:
        this.drawGame();
        break;
      case GameStates.PAUSED:
        this.drawGame();
        this.uiManager.drawPauseMenu();
        break;
      case GameStates.LEVEL_COMPLETE:
        this.drawGame();
        this.uiManager.drawLevelComplete();
        break;
      case GameStates.GAME_OVER:
        this.drawGame();
        this.uiManager.drawGameOver();
        break;
      case GameStates.LEVEL_SELECT:
        this.uiManager.drawLevelSelect();
        break;
      case GameStates.HELP:
        this.uiManager.drawHelpScreen();
        break;
      case GameStates.AUDIO:
        this.uiManager.drawAudioSettings();
        break;
      case GameStates.SETTINGS:
        this.uiManager.drawSettingsScreen();
        break;
    }
  }
}