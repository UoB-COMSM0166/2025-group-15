import { Button } from "./components/Button.js";
import { GameStates } from "../config/Constants.js";
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
      new Button(width / 2 - 100, 340, 200, 50, "Help", true),
      new Button(width / 2 - 100, 410, 200, 50, "Cheating Mode", true),
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

    // Pause menu buttons
    this.buttons.pause = [
      new Button(300, 250, 200, 40, "Continue Game", true),
      new Button(300, 300, 200, 40, "Restart", true),
      new Button(300, 350, 200, 40, "Return to Main Menu", true),
      new Button(300, 400, 200, 40, "Audio Settings", true),
    ];

    // Level complete buttons
    this.buttons.levelComplete = [
      new Button(250, 300, 300, 40, "Next Level", true),
      new Button(250, 350, 300, 40, "Replay Level", true),
      new Button(250, 400, 300, 40, "Return to Main Menu", true),
    ];

    // Game over buttons
    this.buttons.gameOver = [
      new Button(250, 350, 300, 40, "Try Again", true),
      new Button(250, 400, 300, 40, "Return to Main Menu", true),
    ];

    // Help screen button
    this.buttons.help = [
      new Button(300, 500, 200, 40, "Return to Main Menu", true),
    ];

    // Audio settings button
    this.buttons.audio = [new Button(300, 500, 200, 40, "Return", true)];
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
    } else if (this.buttons.mainMenu[2].isClicked(mx, my)) {
      this.game.currentState = GameStates.HELP;
    } else if (this.buttons.mainMenu[3].isClicked(mx, my)) {
      currentGameMode = GameMode.TESTING;
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
        this.game.player = new Player(700, 300, this.selectedCharacter); // instantiate player
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
      this.game.currentState = GameStates.AUDIO;
    }
  }

  handleLevelCompleteClicks(mx, my) {
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

  handleAudioSettingsClicks(mx, my) {
    // Volume slider click
    if (my >= 250 && my <= 270 && mx >= 250 && mx <= 550) {
      this.game.volume = constrain((mx - 250) / 300, 0, 1);
    }

    // Audio toggle click
    if (mx >= 400 && mx <= 500 && my >= 330 && my <= 360) {
      this.game.isAudioEnabled = !this.game.isAudioEnabled;
    }

    // Return button
    if (this.buttons.audio[0].isClicked(mx, my)) {
      this.game.currentState = GameStates.PAUSED;
    }
  }

  drawMainMenu() {
    background(200);
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(0);
    text("Road Crossing Game", width / 2, 100);

    // Testing mode indicator
    if (currentGameMode === GameMode.TESTING) {
      textSize(18);
      fill(0, 128, 0); // Green
      text(
        "Testing Mode Enabled: Unlimited Time | All Levels Unlocked",
        width / 2,
        140
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
    textSize(32);
    fill(0);
    text("Select Your Character", width / 2, 100);

    // draw character images
    //fill(0, 0, 255);
    //circle(width / 2 - 100, 250, 50);
    image(assetManager.getImage("player1"), width / 2 - 150, 200, 100, 100);
    //fill(255, 0, 0);
    //circle(width / 2 + 100, 250, 50);
    image(assetManager.getImage("player2"), width / 2 + 50, 200, 100, 100);

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
    textSize(32);
    fill(0);
    text("Select Level", width / 2, 100);

    // Testing mode indicator
    if (currentGameMode === GameMode.TESTING) {
      textSize(20);
      fill(0, 128, 0); // Green
      text("Testing Mode: All Levels Unlocked", width / 2, 140);
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
    rect(250, 200, 300, 300);

    textAlign(CENTER);
    textSize(24);
    fill(0);
    text("Game Paused", width / 2, 230);

    // Draw buttons
    for (const button of this.buttons.pause) {
      button.draw();
    }
  }

  drawLevelComplete() {
    // Semi-transparent background
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // Dialog box
    fill(255);
    rect(200, 150, 400, 300);

    textAlign(CENTER, CENTER);
    fill(0);
    textSize(24);
    text("Level Complete!", width / 2, 200);
    text(`Score: ${this.game.player.score}`, width / 2, 250);

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
    fill(255);
    rect(200, 150, 400, 300);

    textAlign(CENTER, CENTER);
    fill(0);
    textSize(24);
    text("Game Over", width / 2, 200);
    text(`Final Score: ${this.game.player.score}`, width / 2, 250);
    text(
      `Target Score: ${LevelConfig[this.game.currentLevel].targetScore}`,
      width / 2,
      280
    );

    // Draw buttons
    for (const button of this.buttons.gameOver) {
      button.draw();
    }
  }

  drawHelpScreen() {
    background(200);
    textAlign(LEFT);
    textSize(20);
    fill(0);

    let y = 100;
    text("Game Instructions:", 50, y);
    y += 40;
    text("- Use arrow keys to move character", 50, y);
    y += 30;
    text("- Press space to pick up/drop items", 50, y);
    y += 30;
    text("- Press ESC to pause the game", 50, y);
    y += 30;
    text("- Avoid cars and carry items from left to right", 50, y);
    y += 30;
    text("- If hit by a car, you'll return to start position", 50, y);
    y += 30;
    text("- Reach the target score to complete the level", 50, y);

    // Testing mode features
    if (currentGameMode === GameMode.TESTING) {
      y += 40;
      fill(0, 128, 0); // Green
      text("Testing Mode Features:", 50, y);
      y += 30;
      text("- Game Time: 10000 seconds", 50, y);
      y += 30;
      text("- All levels unlocked", 50, y);
    }

    // Draw return button
    this.buttons.help[0].draw();
  }

  drawAudioSettings() {
    background(200);
    textAlign(CENTER);
    textSize(24);
    fill(0);
    text("Audio Settings", width / 2, 100);

    text("Volume: " + floor(this.game.volume * 100) + "%", width / 2, 200);

    // Volume slider
    fill(150);
    rect(250, 250, 300, 20);
    fill(0, 0, 255);
    rect(250, 250, 300 * this.game.volume, 20);

    // Audio toggle
    text("Audio:", 300, 350);
    fill(
      this.game.isAudioEnabled ? 0 : 255,
      0,
      this.game.isAudioEnabled ? 255 : 0
    );
    rect(400, 330, 100, 30);
    fill(255);
    text(this.game.isAudioEnabled ? "ON" : "OFF", 450, 350);

    // Draw return button
    this.buttons.audio[0].draw();
  }

  drawGameStatus() {
    fill(0);
    textSize(20);
    textAlign(LEFT);
    // Show game mode
    if (currentGameMode === GameMode.TESTING) {
      fill(0, 128, 0); // Green
      text(`Testing Mode`, 20, 30);
      fill(0);
    } else {
      fill(0, 128, 0); // Green
      text(`Normal Mode`, 20, 30);
      fill(0);
    }
    text(`Score: ${this.game.player.score}`, 20, 90);
    text(`Target: ${LevelConfig[this.game.currentLevel].targetScore}`, 20, 60);

    text(`Time: ${this.game.gameTime}`, 20, 120);
    text(`Level: ${this.game.currentLevel}`, 20, 150);
  }
}
