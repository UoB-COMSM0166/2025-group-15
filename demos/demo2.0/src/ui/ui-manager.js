class UIManager {
    constructor(game) {
        this.game = game;
        this.buttons = {};
        this.initializeButtons();
    }

    initializeButtons() {
        // Main menu buttons
        this.buttons.mainMenu = [
            new Button(width/2 - 100, 200, 200, 50, "Start Game", true),
            new Button(width/2 - 100, 270, 200, 50, "Select Level", true),
            new Button(width/2 - 100, 340, 200, 50, "Help", true)
        ];
        
        // Level selection buttons - initially all false
        this.buttons.levelSelect = [
            new Button(width/2 - 100, 220, 200, 50, "Level 1", false),
            new Button(width/2 - 100, 290, 200, 50, "Level 2", false),
            new Button(width/2 - 100, 360, 200, 50, "Level 3", false),
            new Button(width/2 - 100, 500, 200, 50, "Return to Main Menu", true)
        ];
        
        // Pause menu buttons
        this.buttons.pause = [
            new Button(300, 250, 200, 40, "Continue Game", true),
            new Button(300, 300, 200, 40, "Restart", true),
            new Button(300, 350, 200, 40, "Return to Main Menu", true),
            new Button(300, 400, 200, 40, "Audio Settings", true)
        ];
        
        // Level complete buttons
        this.buttons.levelComplete = [
            new Button(250, 300, 300, 40, "Next Level", true),
            new Button(250, 350, 300, 40, "Replay Level", true),
            new Button(250, 400, 300, 40, "Return to Main Menu", true)
        ];
        
        // Game over buttons
        this.buttons.gameOver = [
            new Button(250, 350, 300, 40, "Try Again", true),
            new Button(250, 400, 300, 40, "Return to Main Menu", true)
        ];
        
        // Help screen button
        this.buttons.help = [
            new Button(300, 500, 200, 40, "Return to Main Menu", true)
        ];
        
        // Audio settings button
        this.buttons.audio = [
            new Button(300, 500, 200, 40, "Return", true)
        ];
    }

    updateLevelSelectButtons() {
        // Always unlock all levels in testing mode
        const levelsToUnlock = currentGameMode === GAME_MODE.TESTING ? 3 : this.game.unlockedLevels;
        
        for (let i = 0; i < 3; i++) {
            const isUnlocked = i + 1 <= levelsToUnlock;
            this.buttons.levelSelect[i].isActive = isUnlocked;
            this.buttons.levelSelect[i].label = `Level ${i + 1}${isUnlocked ? '' : ' (Locked)'}`;
        }
    }
    updateLevelCompleteButtons() {
        // Update "Next Level" button if on the final level
        const isLastLevel = this.game.currentLevel >= 3;
        this.buttons.levelComplete[0].label = isLastLevel ? "Congratulations!" : "Next Level";
        this.buttons.levelComplete[0].isActive = !isLastLevel;
    }

    handleMainMenuClicks(mx, my) {
        if (this.buttons.mainMenu[0].isClicked(mx, my)) {
            this.game.startNewGame(1);
        } else if (this.buttons.mainMenu[1].isClicked(mx, my)) {
            this.game.currentState = GAME_STATES.LEVEL_SELECT;
        } else if (this.buttons.mainMenu[2].isClicked(mx, my)) {
            this.game.currentState = GAME_STATES.HELP;
        }
    }

    handleLevelSelectClicks(mx, my) {
        for (let i = 0; i < 3; i++) {
            if (this.buttons.levelSelect[i].isClicked(mx, my)) {
                this.game.startNewGame(i + 1);
                return;
            }
        }
        
        if (this.buttons.levelSelect[3].isClicked(mx, my)) {
            this.game.currentState = GAME_STATES.MENU;
        }
    }

    handlePauseMenuClicks(mx, my) {
        if (this.buttons.pause[0].isClicked(mx, my)) {
            this.game.currentState = GAME_STATES.PLAYING;
        } else if (this.buttons.pause[1].isClicked(mx, my)) {
            this.game.startNewGame(this.game.currentLevel);
        } else if (this.buttons.pause[2].isClicked(mx, my)) {
            this.game.currentState = GAME_STATES.MENU;
        } else if (this.buttons.pause[3].isClicked(mx, my)) {
            this.game.currentState = GAME_STATES.AUDIO;
        }
    }

    handleLevelCompleteClicks(mx, my) {
        if (this.game.currentLevel < 3 && this.buttons.levelComplete[0].isClicked(mx, my)) {
            this.game.startNewGame(this.game.currentLevel + 1);
        } else if (this.buttons.levelComplete[1].isClicked(mx, my)) {
            this.game.startNewGame(this.game.currentLevel);
        } else if (this.buttons.levelComplete[2].isClicked(mx, my)) {
            this.game.currentState = GAME_STATES.MENU;
        }
    }

    handleGameOverClicks(mx, my) {
        if (this.buttons.gameOver[0].isClicked(mx, my)) {
            this.game.startNewGame(this.game.currentLevel);
        } else if (this.buttons.gameOver[1].isClicked(mx, my)) {
            this.game.currentState = GAME_STATES.MENU;
        }
    }

    handleHelpScreenClicks(mx, my) {
        if (this.buttons.help[0].isClicked(mx, my)) {
            this.game.currentState = GAME_STATES.MENU;
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
            this.game.currentState = GAME_STATES.PAUSED;
        }
    }

    drawMainMenu() {
        background(200);
        textAlign(CENTER, CENTER);
        textSize(32);
        fill(0);
        text("Road Crossing Game", width/2, 100);
        
        // Testing mode indicator
        if (currentGameMode === GAME_MODE.TESTING) {
            textSize(18);
            fill(0, 128, 0); // Green
            text("Testing Mode Enabled: Unlimited Time | All Levels Unlocked", width/2, 140);
        }
        
        // Draw menu buttons
        for (const button of this.buttons.mainMenu) {
            button.draw();
        }
    }

    drawLevelSelect() {
        // 在绘制关卡选择界面时先更新按钮状态
        this.updateLevelSelectButtons();
    
        background(200);
        textAlign(CENTER, CENTER);
        textSize(32);
        fill(0);
        text("Select Level", width/2, 100);
        
        // Testing mode indicator
        if (currentGameMode === GAME_MODE.TESTING) {
            textSize(20);
            fill(0, 128, 0); // Green
            text("Testing Mode: All Levels Unlocked", width/2, 140);
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
        text("Game Paused", width/2, 230);
        
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
        text("Level Complete!", width/2, 200);
        text(`Score: ${this.game.player.score}`, width/2, 250);
        
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
        text("Game Over", width/2, 200);
        text(`Final Score: ${this.game.player.score}`, width/2, 250);
        text(`Target Score: ${LEVEL_CONFIG[this.game.currentLevel].targetScore}`, width/2, 280);
        
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
        if (currentGameMode === GAME_MODE.TESTING) {
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
        text("Audio Settings", width/2, 100);
        
        text("Volume: " + floor(this.game.volume * 100) + "%", width/2, 200);
        
        // Volume slider
        fill(150);
        rect(250, 250, 300, 20);
        fill(0, 0, 255);
        rect(250, 250, 300 * this.game.volume, 20);
        
        // Audio toggle
        text("Audio:", 300, 350);
        fill(this.game.isAudioEnabled ? 0 : 255, 0, this.game.isAudioEnabled ? 255 : 0);
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
        text(`Score: ${this.game.player.score}`, 20, 30);
        text(`Target: ${LEVEL_CONFIG[this.game.currentLevel].targetScore}`, 20, 60);
        
        // Show game mode
        if (currentGameMode === GAME_MODE.TESTING) {
            fill(0, 128, 0); // Green
            text(`Testing Mode`, 20, 90);
            fill(0);
        }
        
        text(`Time: ${this.game.gameTime}`, 20, 120);
        text(`Level: ${this.game.currentLevel}`, 20, 150);
    }
}