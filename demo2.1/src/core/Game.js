// Import all the classes used
import { CarSystem } from "../systems/CarSystem.js";
import { ItemSystem } from "../systems/ItemSystem.js";
import { ObstacleSystem } from "../systems/ObstacleSystem.js";
import { UiManager } from "../ui/UiManager.js";
import { GameStates } from "../config/Constants.js";
import { GameMode } from "../config/GameMode.js";
import { LevelConfig } from "../config/LevelConfig.js";
import { GameStorage } from "../utils/GameStorage.js";

export class Game {
  constructor() {
    this.currentState = GameStates.MENU;
    this.currentLevel = 1;
    this.selectedCharacter = "option1"; // default character option1

    // Explicitly set unlocked levels based on game mode
    if (currentGameMode === GameMode.TESTING) {
      this.unlockedLevels = 3;
    } else {
      this.unlockedLevels = this.loadGameProgress();
    }

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
  }

  loadGameProgress() {
    this.unlockedLevels = GameStorage.loadGameProgress();
  }

  saveGameProgress() {
    GameStorage.saveGameProgress(this.unlockedLevels);
  }

  startNewGame(level) {
    this.currentLevel = level;
    this.currentState = GameStates.PLAYING;
    this.resetGame();
  }

  resetGame() {
    this.player.reset();
    this.carSystem.reset();
    this.itemSystem.reset();
    this.obstacleSystem.reset();

    // Set game time based on mode
    this.gameTime = currentGameMode === GameMode.TESTING ? 10000 : 60;

    this.startTime = millis();

    // Generate obstacles for level 3
    if (this.currentLevel === 3) {
      this.obstacleSystem.generateObstacles();
    }
  }

  update() {
    if (this.currentState !== GameStates.PLAYING) return;

    // Update game time
    this.gameTime =
      currentGameMode === GameMode.TESTING
        ? 10000
        : 60 - floor((millis() - this.startTime) / 1000);

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
    if (this.currentState === GameStates.PLAYING) {
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
    this.setLineDash([]); // Reset to solid line
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

    if (keyCode === 32 && this.currentState === GameStates.PLAYING) {
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
    }
  }
}
