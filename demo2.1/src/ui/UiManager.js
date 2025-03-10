import { Button } from "./components/Button.js";
import { GameStates, getGameAreas } from "../config/Constants.js";
import { LevelConfig } from "../config/LevelConfig.js";
import { GameMode } from "../config/GameMode.js";
import { Player } from "../entities/Player.js";

export class UiManager {
  constructor(game) {
    this.game = game;
    this.buttons = {};
    this.selectedCharacter = null;
    this.initializeButtons();
  }

  initializeButtons() {
    // Main menu buttons
    this.buttons.mainMenu = [
      new Button(width / 2 - 100, 200, 200, 50, "Start Game", true),
      new Button(width / 2 - 100, 270, 200, 50, "Select Level", true),
      new Button(width / 2 - 100, 340, 200, 50, "Settings", true),
      new Button(width / 2 - 100, 410, 200, 50, "Help", true),
      new Button(width / 2 - 100, 480, 200, 50, "Cheating Mode", true),
    ];

    // Character selection buttons
    this.buttons.characterSelect = [
      new Button(width / 2 - 150, 300, 100, 50, "Option1", true),
      new Button(width / 2 + 55, 300, 100, 50, "Option2", true),
      new Button(width / 2 - 100, 430, 200, 50, "Start Game", true),
      new Button(width / 2 - 100, 500, 200, 50, "Return to Main Menu", true),
    ];

    // Level selection buttons - initially all false
    this.buttons.levelSelect = [
      new Button(width / 2 - 100, 220, 200, 50, "Level 1", false),
      new Button(width / 2 - 100, 290, 200, 50, "Level 2", false),
      new Button(width / 2 - 100, 360, 200, 50, "Level 3", false),
      new Button(width / 2 - 100, 500, 200, 50, "Return to Main Menu", true),
    ];

    // Settings menu buttons
    this.buttons.settings = [
      new Button(width / 2 - 100, 400, 200, 50, "Audio Settings", true),
      new Button(width / 2 - 100, 470, 200, 50, "Return to Main Menu", true),
    ];

    // Pause menu buttons
    this.buttons.pause = [
      new Button(width / 2 - 100, height / 2 - 60, 200, 40, "Continue Game", true),
      new Button(width / 2 - 100, height / 2, 200, 40, "Restart", true),
      new Button(width / 2 - 100, height / 2 + 60, 200, 40, "Return to Main Menu", true),
      new Button(width / 2 - 100, height / 2 + 120, 200, 40, "Settings", true),
    ];

    // Level complete buttons
    this.buttons.levelComplete = [
      new Button(width / 2 - 150, height / 2, 300, 40, "Next Level", true),
      new Button(width / 2 - 150, height / 2 + 60, 300, 40, "Replay Level", true),
      new Button(width / 2 - 150, height / 2 + 120, 300, 40, "Return to Main Menu", true),
    ];

    // Game over buttons
    this.buttons.gameOver = [
      new Button(width / 2 - 150, height / 2 + 50, 300, 40, "Try Again", true),
      new Button(width / 2 - 150, height / 2 + 110, 300, 40, "Return to Main Menu", true),
    ];

    // Help screen button
    this.buttons.help = [
      new Button(width / 2 - 100, height - 100, 200, 40, "Return to Main Menu", true),
    ];

    // Audio settings button
    this.buttons.audio = [
      new Button(width / 2 - 100, height - 100, 200, 40, "Return", true)
    ];
  }

  updateLevelSelectButtons() {
    // Always unlock all levels in testing mode
    const levelsToUnlock =
      currentGameMode === GameMode.TESTING ? 3 : this.game.unlockedLevels;

    for (let i = 0; i < 3; i++) {
      const isUnlocked = i + 1 <= levelsToUnlock;
      this.buttons.levelSelect[i].isActive = isUnlocked;
      this.buttons.levelSelect[i].label = `Level ${i + 1}${
        isUnlocked ? "" : " (Locked)"
      }`;
    }
  }
  
  updateLevelCompleteButtons() {
    // Update "Next Level" button if on the final level
    const isLastLevel = this.game.currentLevel >= 3;
    this.buttons.levelComplete[0].label = isLastLevel
      ? "Congratulations!"
      : "Next Level";
    this.buttons.levelComplete[0].isActive = !isLastLevel;
  }

  handleMainMenuClicks(mx, my) {
    if (this.buttons.mainMenu[0].isClicked(mx, my)) {
      // choose level 1 by default
      this.game.selectedLevel = 1; 
      this.game.currentState = GameStates.CHARACTER_SELECT;
    } else if (this.buttons.mainMenu[1].isClicked(mx, my)) {
      this.game.currentState = GameStates.LEVEL_SELECT;
      this.updateLevelSelectButtons();
    } else if (this.buttons.mainMenu[2].isClicked(mx, my)) {
      this.game.currentState = GameStates.SETTINGS;
    } else if (this.buttons.mainMenu[3].isClicked(mx, my)) {
      this.game.currentState = GameStates.HELP;
    } else if (this.buttons.mainMenu[4].isClicked(mx, my)) {
      currentGameMode = GameMode.TESTING;
      // Visual feedback for mode change
      this.buttons.mainMenu[4].label = currentGameMode === GameMode.TESTING ? 
        "Normal Mode" : "Cheating Mode";
    }
  }

  handleLevelSelectClicks(mx, my) {
    for (let i = 0; i < 3; i++) {
      if (this.buttons.levelSelect[i].isClicked(mx, my)) {
        this.game.selectedLevel = i + 1;
        this.game.currentState = GameStates.CHARACTER_SELECT;
        return;
      }
    }

    if (this.buttons.levelSelect[3].isClicked(mx, my)) {
      this.game.currentState = GameStates.MENU;
    }
  }

  handleCharacterSelectClicks(mx, my) {
    if (this.buttons.characterSelect[0].isClicked(mx, my)) {
      this.selectedCharacter = "option1";
    } else if (this.buttons.characterSelect[1].isClicked(mx, my)) {
      this.selectedCharacter = "option2";
    } else if (this.buttons.characterSelect[2].isClicked(mx, my)) {
      if (this.selectedCharacter) {
        // Player position will be set in the Player constructor based on canvas size
        this.game.player = new Player(null, null, this.selectedCharacter); // instantiate player
        this.game.startNewGame(this.game.selectedLevel); // start game with selected level
      }
    } else if (this.buttons.characterSelect[3].isClicked(mx, my)) {
      this.game.currentState = GameStates.MENU;
    }
  }

  handlePauseMenuClicks(mx, my) {
    if (this.buttons.pause[0].isClicked(mx, my)) {
      this.game.currentState = GameStates.PLAYING;
    } else if (this.buttons.pause[1].isClicked(mx, my)) {
      this.game.startNewGame(this.game.currentLevel);
    } else if (this.buttons.pause[2].isClicked(mx, my)) {
      this.game.currentState = GameStates.MENU;
    } else if (this.buttons.pause[3].isClicked(mx, my)) {
      this.game.currentState = GameStates.SETTINGS;
    }
  }

  handleLevelCompleteClicks(mx, my) {
    this.updateLevelCompleteButtons();
    
    if (
      this.game.currentLevel < 3 &&
      this.buttons.levelComplete[0].isClicked(mx, my)
    ) {
      this.game.startNewGame(this.game.currentLevel + 1);
    } else if (this.buttons.levelComplete[1].isClicked(mx, my)) {
      this.game.startNewGame(this.game.currentLevel);
    } else if (this.buttons.levelComplete[2].isClicked(mx, my)) {
      this.game.currentState = GameStates.MENU;
    }
  }

  handleGameOverClicks(mx, my) {
    if (this.buttons.gameOver[0].isClicked(mx, my)) {
      this.game.startNewGame(this.game.currentLevel);
    } else if (this.buttons.gameOver[1].isClicked(mx, my)) {
      this.game.currentState = GameStates.MENU;
    }
  }

  handleHelpScreenClicks(mx, my) {
    if (this.buttons.help[0].isClicked(mx, my)) {
      this.game.currentState = GameStates.MENU;
    }
  }

  handleSettingsScreenClicks(mx, my) {
    if (this.buttons.settings[0].isClicked(mx, my)) {
      this.game.currentState = GameStates.AUDIO;
    } else if (this.buttons.settings[1].isClicked(mx, my)) {
      this.game.currentState = GameStates.MENU;
    }
  }

  handleAudioSettingsClicks(mx, my) {
    // Volume slider click
    const sliderX = width / 2 - 150;
    const sliderWidth = 300;
    
    if (my >= height / 2 - 10 && my <= height / 2 + 10 && mx >= sliderX && mx <= sliderX + sliderWidth) {
      this.game.volume = constrain((mx - sliderX) / sliderWidth, 0, 1);
    }

    // Audio toggle click
    const toggleX = width / 2 - 50;
    const toggleY = height / 2 + 60;
    if (mx >= toggleX && mx <= toggleX + 100 && my >= toggleY - 15 && my <= toggleY + 15) {
      this.game.isAudioEnabled = !this.game.isAudioEnabled;
    }

    // Return button
    if (this.buttons.audio[0].isClicked(mx, my)) {
      const prevState = this.game.prevState || GameStates.SETTINGS;
      this.game.currentState = prevState;
    }
  }

  drawMainMenu() {
    background(200);
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(0);
    text("Road Crossing Game", width / 2, height * 0.15);

    // Testing mode indicator
    if (currentGameMode === GameMode.TESTING) {
      textSize(20);
      fill(0, 128, 0); // Green
      text(
        "Testing Mode Enabled: Unlimited Time | All Levels Unlocked",
        width / 2,
        height * 0.22
      );
    }

    // Draw menu buttons
    for (const button of this.buttons.mainMenu) {
      button.draw();
    }
  }

  drawCharacterSelect() {
    background(200);
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(0);
    text("Select Your Character", width / 2, height * 0.15);

    // Draw character images
    const charSize = Math.min(100, height * 0.15);
    const charY = height * 0.3;
    image(assetManager.getImage("player1"), width / 2 - 150, charY, charSize, charSize);
    image(assetManager.getImage("player2"), width / 2 + 50, charY, charSize, charSize);

    // Draw character select buttons
    for (let i = 0; i < this.buttons.characterSelect.length; i++) {
      if (i < 2) {
        //two character buttons
        if (
          (i === 0 && this.selectedCharacter === "option1") ||
          (i === 1 && this.selectedCharacter === "option2")
        ) {
          // fill selected button with yellow
          this.buttons.characterSelect[i].draw(true);
        } else {
          this.buttons.characterSelect[i].draw();
        }
      } else {
        // other buttons
        this.buttons.characterSelect[i].draw();
      }
    }
  }

  drawLevelSelect() {
    // Update level select buttons
    this.updateLevelSelectButtons();

    background(200);
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(0);
    text("Select Level", width / 2, height * 0.15);

    // Testing mode indicator
    if (currentGameMode === GameMode.TESTING) {
      textSize(20);
      fill(0, 128, 0); // Green
      text("Testing Mode: All Levels Unlocked", width / 2, height * 0.22);
    }

    // Draw level select buttons
    for (const button of this.buttons.levelSelect) {
      button.draw();
    }
  }

  drawPauseMenu() {
    // Semi-transparent background
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // Pause menu window
    fill(255);
    rect(width / 2 - 175, height / 2 - 150, 350, 330);

    textAlign(CENTER);
    textSize(28);
    fill(0);
    text("Game Paused", width / 2, height / 2 - 100);

    // Draw buttons
    for (const button of this.buttons.pause) {
      button.draw();
    }
  }

  drawLevelComplete() {
    // Update buttons for level complete screen
    this.updateLevelCompleteButtons();
    
    // Semi-transparent background
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // Dialog box
    const boxWidth = Math.min(400, width * 0.8);
    const boxHeight = Math.min(300, height * 0.5);
    fill(255);
    rect(width / 2 - boxWidth/2, height / 2 - boxHeight/2, boxWidth, boxHeight);

    textAlign(CENTER, CENTER);
    fill(0);
    textSize(28);
    text("Level Complete!", width / 2, height / 2 - 70);
    textSize(24);
    text(`Score: ${this.game.player.score}`, width / 2, height / 2 - 30);

    // Draw buttons
    for (const button of this.buttons.levelComplete) {
      button.draw();
    }
  }

  drawGameOver() {
    // Semi-transparent background
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // Dialog box
    const boxWidth = Math.min(400, width * 0.8);
    const boxHeight = Math.min(300, height * 0.5);
    fill(255);
    rect(width / 2 - boxWidth/2, height / 2 - boxHeight/2, boxWidth, boxHeight);

    textAlign(CENTER, CENTER);
    fill(0);
    textSize(28);
    text("Game Over", width / 2, height / 2 - 70);
    textSize(20);
    text(`Final Score: ${this.game.player.score}`, width / 2, height / 2 - 30);
    text(
      `Target Score: ${LevelConfig[this.game.currentLevel].targetScore}`,
      width / 2,
      height / 2
    );

    // Draw buttons
    for (const button of this.buttons.gameOver) {
      button.draw();
    }
  }

  drawHelpScreen() {
    background(200);
    
    // Title
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(0);
    text("Game Instructions", width / 2, height * 0.1);
    
    // Instructions
    textAlign(LEFT);
    textSize(20);
    fill(0);
    
    const leftMargin = width * 0.1;
    const lineHeight = 30;
    let y = height * 0.2;
    
    text("- Use arrow keys or WASD to move character", leftMargin, y); y += lineHeight;
    text("- Press SPACE or E to pick up/drop items", leftMargin, y); y += lineHeight;
    text("- Press ESC to pause the game", leftMargin, y); y += lineHeight;
    text("- Avoid cars and carry items from left to right", leftMargin, y); y += lineHeight;
    text("- Heavier items (higher value) slow you down", leftMargin, y); y += lineHeight;
    text("- If hit by a car, you'll return to start position", leftMargin, y); y += lineHeight;
    text("- Reach the target score to complete the level", leftMargin, y); y += lineHeight;

    // Testing mode features
    if (currentGameMode === GameMode.TESTING) {
      y += lineHeight;
      fill(0, 128, 0); // Green
      text("Testing Mode Features:", leftMargin, y); y += lineHeight;
      text("- Game Time: 10000 seconds", leftMargin, y); y += lineHeight;
      text("- All levels unlocked", leftMargin, y);
    }

    // Draw return button
    this.buttons.help[0].draw();
  }

  drawSettingsScreen() {
    background(200);
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(0);
    text("Settings", width / 2, height * 0.15);

    // Draw buttons
    for (const button of this.buttons.settings) {
      button.draw();
    }
  }

  drawAudioSettings() {
    // Store the previous state if coming from pause menu
    if (this.game.currentState === GameStates.PAUSED) {
      this.game.prevState = GameStates.PAUSED;
    }
    
    background(200);
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(0);
    text("Audio Settings", width / 2, height * 0.15);

    textSize(24);
    text("Volume: " + floor(this.game.volume * 100) + "%", width / 2, height * 0.35);

    // Volume slider
    const sliderX = width / 2 - 150;
    const sliderWidth = 300;
    
    fill(150);
    rect(sliderX, height / 2 - 10, sliderWidth, 20);
    fill(0, 0, 255);
    rect(sliderX, height / 2 - 10, sliderWidth * this.game.volume, 20);

    // Audio toggle
    text("Audio:", width / 2 - 100, height / 2 + 60);
    fill(
      this.game.isAudioEnabled ? 0 : 255,
      0,
      this.game.isAudioEnabled ? 255 : 0
    );
    rect(width / 2 - 50, height / 2 + 45, 100, 30);
    fill(255);
    text(this.game.isAudioEnabled ? "ON" : "OFF", width / 2, height / 2 + 60);

    // Draw return button
    this.buttons.audio[0].draw();
  }

  drawGameStatus() {
    // Get the game areas to position UI elements
    const areas = getGameAreas(width, height);
    
    // Background for status area on the left
    fill(150, 150, 150, 100);
    rect(0, 0, areas.warehouse.width, 220);
    
    // Background for score and level on the right
    fill(150, 150, 150, 100);
    rect(areas.delivery.start, 0, areas.delivery.width, 100);
    
    fill(0);
    textSize(20);
    textAlign(LEFT);
    
    const leftPadding = 20;
    const rightPadding = areas.delivery.start + 20;
    
    // Show game mode on the left
    if (currentGameMode === GameMode.TESTING) {
      fill(0, 128, 0); // Green
      text(`Testing Mode`, leftPadding, 30);
      fill(0);
    } else {
      fill(0, 128, 0); // Green
      text(`Normal Mode`, leftPadding, 30);
      fill(0);
    }
    
    // Level info moved to left side, above time
    text(`Level: ${this.game.currentLevel}`, leftPadding, 60);
    
    // Game time on the left
    text(`Time: ${this.game.gameTime}`, leftPadding, 90);
    
    // If player is carrying an item, show its weight and speed on the left
    if (this.game.player && this.game.player.hasItem) {
      text(`Weight: ${this.game.player.currentItem.weight.toFixed(1)}`, leftPadding, 120);
      text(`Speed: ${this.game.player.speed.toFixed(1)}`, leftPadding, 150);
    }
    
    // Score info on the right
    text(`Score: ${this.game.player.score}`, rightPadding, 30);
    text(`Target: ${LevelConfig[this.game.currentLevel].targetScore}`, rightPadding, 60);
    
    // Draw audio indicator at top-right
    const audioImg = this.game.isAudioEnabled ? 
      assetManager.getImage("volumeOn") : 
      assetManager.getImage("volumeOff");
    if (audioImg) {
      image(audioImg, width - 50, 20, 30, 30);
    }
    
    // Draw pause button at top-right
    const pauseImg = assetManager.getImage("pause");
    if (pauseImg) {
      image(pauseImg, width - 90, 20, 30, 30);
    }
  }
}