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
    // designed button locations and sizes based on 1000x750 canvas
    const buttonDesign = {
      mainMenu: [
        { x: 400, y: 250, w: 200, h: 50, label: "Start Game" },
        { x: 400, y: 320, w: 200, h: 50, label: "Select Level" },
        { x: 400, y: 390, w: 200, h: 50, label: "Settings" },
        { x: 400, y: 460, w: 200, h: 50, label: "Help" },
        { x: 400, y: 530, w: 200, h: 50, label: "Cheating Mode" },
      ],
      characterSelect: [
        { x: 350 - 100 / 2, y: 470, w: 100, h: 50, label: "Option1" }, // should align vertically with character selection images in drawCharacterSelect()
        { x: 650 - 100 / 2, y: 470, w: 100, h: 50, label: "Option2" }, // should align vertically with character selection images in drawCharacterSelect()
        { x: 400, y: 540, w: 220, h: 50, label: "Start Game" },
        { x: 400, y: 610, w: 220, h: 50, label: "Return to Main Menu" },
      ],
      levelSelect: [
        { x: 220, y: 300, w: 120, h: 120, label: "Level 1" },
        { x: 440, y: 300, w: 120, h: 120, label: "Level 2" },
        { x: 660, y: 300, w: 120, h: 120, label: "Level 3" },
        { x: 400, y: 500, w: 220, h: 50, label: "Return to Main Menu" },
      ],
      settings: [
        { x: 230, y: 450, w: 220, h: 50, label: "Audio Settings" },
        { x: 550, y: 450, w: 220, h: 50, label: "Return to Main Menu" },
      ],
      pause: [
        { x: 400, y: 310, w: 200, h: 40, label: "Continue Game" },
        { x: 400, y: 370, w: 200, h: 40, label: "Restart" },
        { x: 400, y: 430, w: 200, h: 40, label: "Return to Main Menu" },
        { x: 400, y: 490, w: 200, h: 40, label: "Settings" },
      ],
      levelComplete: [
        { x: 400, y: 335, w: 200, h: 40, label: "Next Level" },
        { x: 400, y: 395, w: 200, h: 40, label: "Replay Level" },
        { x: 400, y: 455, w: 200, h: 40, label: "Return to Main Menu" },
      ],
      gameOver: [
        { x: 400, y: 395, w: 200, h: 40, label: "Try Again" },
        { x: 400, y: 455, w: 200, h: 40, label: "Return to Main Menu" },
      ],
      help: [{ x: 400, y: 550, w: 220, h: 50, label: "Return to Main Menu" }],
      audio: [{ x: 400, y: 550, w: 220, h: 50, label: "Return" }],
    };

    // Main menu buttons
    this.buttons = [];
    this.buttons.mainMenu = buttonDesign.mainMenu.map(
      (btn) => new Button(btn.x, btn.y, btn.w, btn.h, btn.label, true)
    );

    // Character selection buttons
    this.buttons.characterSelect = buttonDesign.characterSelect.map(
      (btn) => new Button(btn.x, btn.y, btn.w, btn.h, btn.label, true)
    );

    // Level selection buttons - initially all false
    this.buttons.levelSelect = buttonDesign.levelSelect.map(
      (btn, index) =>
        new Button(btn.x, btn.y, btn.w, btn.h, btn.label, index === 3)
    );
    // this.buttons.levelSelect = [
    //   new Button(width / 2 - 100, 220, 200, 50, "Level 1", false),
    //   new Button(width / 2 - 100, 290, 200, 50, "Level 2", false),
    //   new Button(width / 2 - 100, 360, 200, 50, "Level 3", false),
    //   new Button(width / 2 - 100, 500, 200, 50, "Return to Main Menu", true),
    // ];

    // Settings menu buttons
    this.buttons.settings = buttonDesign.settings.map(
      (btn) => new Button(btn.x, btn.y, btn.w, btn.h, btn.label, true)
    );

    // Pause menu buttons
    this.buttons.pause = buttonDesign.pause.map(
      (btn) => new Button(btn.x, btn.y, btn.w, btn.h, btn.label, true)
    );

    // Level complete buttons
    this.buttons.levelComplete = buttonDesign.levelComplete.map(
      (btn) => new Button(btn.x, btn.y, btn.w, btn.h, btn.label, true)
    );

    // Game over buttons
    this.buttons.gameOver = buttonDesign.gameOver.map(
      (btn) => new Button(btn.x, btn.y, btn.w, btn.h, btn.label, true)
    );

    // Help screen button
    this.buttons.help = buttonDesign.help.map(
      (btn) => new Button(btn.x, btn.y, btn.w, btn.h, btn.label, true)
    );

    // Audio settings button
    this.buttons.audio = buttonDesign.audio.map(
      (btn) => new Button(btn.x, btn.y, btn.w, btn.h, btn.label, true)
    );
  }

  // update all buttons based on current canvas size
  updateAllButtons() {
    Object.values(this.buttons).forEach((buttonGroup) => {
      buttonGroup.forEach((button) => button.markForUpdate());
    });
  }

  updateLevelSelectButtons() {
    // Always unlock all levels in testing mode
    const levelsToUnlock =
      currentGameMode === GameMode.TESTING ? 3 : this.game.unlockedLevels;

    for (let i = 0; i < 3; i++) {
      const isUnlocked = i + 1 <= levelsToUnlock;
      this.buttons.levelSelect[i].isActive = isUnlocked;
      this.buttons.levelSelect[i].label = isUnlocked ? "" : "Locked";
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
      this.game.playClickSound();
      // choose level 1 by default
      this.game.selectedLevel = 1;
      this.game.currentState = GameStates.CHARACTER_SELECT;
    } else if (this.buttons.mainMenu[1].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.LEVEL_SELECT;
      this.updateLevelSelectButtons();
    } else if (this.buttons.mainMenu[2].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.SETTINGS;
    } else if (this.buttons.mainMenu[3].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.HELP;
    } else if (this.buttons.mainMenu[4].isClicked(mx, my)) {
      this.game.playClickSound();
      if (currentGameMode === GameMode.TESTING) {
        currentGameMode = GameMode.NORMAL;
        console.log("change to: Normal Mode");
      } else {
        currentGameMode = GameMode.TESTING;
        console.log("change to: Testing Mode");
      }

      //Dynamically update button text
      this.buttons.mainMenu[4].label =
        currentGameMode === GameMode.TESTING ? "Normal Mode" : "Cheating Mode";

      // Call resetGame() to make sure the pattern takes effect
      this.game.resetGame();
    }

    // else if (this.buttons.mainMenu[4].isClicked(mx, my)) {
    //   currentGameMode = GameMode.TESTING;
    //   // Visual feedback for mode change
    //   this.buttons.mainMenu[4].label = currentGameMode === GameMode.TESTING ?
    //     "Normal Mode" : "Cheating Mode";
    // }
  }

  handleLevelSelectClicks(mx, my) {
    for (let i = 0; i < 3; i++) {
      if (this.buttons.levelSelect[i].isClicked(mx, my)) {
        this.game.playClickSound();
        this.game.selectedLevel = i + 1;
        this.game.currentState = GameStates.CHARACTER_SELECT;
        return;
      }
    }

    if (this.buttons.levelSelect[3].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.MENU;
      this.game.stopCurrentMusic();
    }
  }

  handleCharacterSelectClicks(mx, my) {
    if (this.buttons.characterSelect[0].isClicked(mx, my)) {
      this.game.playClickSound();
      this.selectedCharacter = "option1";
    } else if (this.buttons.characterSelect[1].isClicked(mx, my)) {
      this.game.playClickSound();
      this.selectedCharacter = "option2";
    } else if (this.buttons.characterSelect[2].isClicked(mx, my)) {
      this.game.playClickSound();
      if (this.selectedCharacter) {
        // Player position will be set in the Player constructor based on canvas size
        this.game.player = new Player(null, null, this.selectedCharacter); // instantiate player
        this.game.startNewGame(this.game.selectedLevel); // start game with selected level
      }
    } else if (this.buttons.characterSelect[3].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.MENU;
      this.game.stopCurrentMusic();
    }
  }

  handlePauseMenuClicks(mx, my) {
    if (this.buttons.pause[0].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.PLAYING;
    } else if (this.buttons.pause[1].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.startNewGame(this.game.currentLevel);
    } else if (this.buttons.pause[2].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.MENU;
      this.game.stopCurrentMusic();
    } else if (this.buttons.pause[3].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.SETTINGS;
    }
  }

  handleLevelCompleteClicks(mx, my) {
    this.updateLevelCompleteButtons();

    if (
      this.game.currentLevel < 3 &&
      this.buttons.levelComplete[0].isClicked(mx, my)
    ) {
      this.game.playClickSound();
      this.game.startNewGame(this.game.currentLevel + 1);
    } else if (this.buttons.levelComplete[1].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.startNewGame(this.game.currentLevel);
    } else if (this.buttons.levelComplete[2].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.MENU;
      this.game.stopCurrentMusic();
    }
  }

  handleGameOverClicks(mx, my) {
    if (this.buttons.gameOver[0].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.startNewGame(this.game.currentLevel);
    } else if (this.buttons.gameOver[1].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.MENU;
      this.game.stopCurrentMusic();
    }
  }

  handleHelpScreenClicks(mx, my) {
    if (this.buttons.help[0].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.MENU;
      this.game.stopCurrentMusic();
    }
  }

  handleSettingsScreenClicks(mx, my) {
    if (this.buttons.settings[0].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.AUDIO;
    } else if (this.buttons.settings[1].isClicked(mx, my)) {
      this.game.playClickSound();
      this.game.currentState = GameStates.MENU;
      this.game.stopCurrentMusic();
    }
  }

  handleAudioSettingsClicks(mx, my) {
    // Volume slider click
    const sliderX = width / 2 - 150;
    const sliderWidth = 300;

    if (
      my >= height / 2 - 10 &&
      my <= height / 2 + 10 &&
      mx >= sliderX &&
      mx <= sliderX + sliderWidth
    ) {
      this.game.volume = constrain((mx - sliderX) / sliderWidth, 0, 1);

      this.game.updateMusicVolume?.();
    }

    // Audio toggle click
    const toggleX = width / 2 - 50;
    const toggleY = height / 2 + 60;

    if (
      mx >= toggleX &&
      mx <= toggleX + 100 &&
      my >= toggleY - 15 &&
      my <= toggleY + 15
    ) {
      this.game.isAudioEnabled = !this.game.isAudioEnabled;

      if (!this.game.isAudioEnabled) {
        this.game.currentMusic?.stop();
      } else {
        this.game.updateMusicVolume?.();
        this.game.currentMusic?.play();
      }
    }

    // Return button
    if (this.buttons.audio[0].isClicked(mx, my)) {
      this.game.playClickSound?.();
      const prevState = this.game.prevState || GameStates.SETTINGS;
      this.game.currentState = prevState;
    }
  }

  drawMainMenu() {
    image(assetManager.getImage("mainBg"), 0, 0, width, height);

    // 绘制卡通风格的标题
    textAlign(CENTER, CENTER);

    // 如果Chewy字体已加载，则使用它，否则使用默认字体
    if (window.loadedFonts && window.loadedFonts.chewy) {
      textFont(window.loadedFonts.chewy);
    }

    // 设置字体大小
    const titleSize = scaler.getFontSize(64);
    textSize(titleSize);

    // 标题位置 - 下移50个单位
    const titleY = scaler.scale(162); // 原来是112，下移50

    // 先绘制棕色边框（8个方向）
    const outlineColor = color(139, 69, 19); // #8b4513 棕色
    const outlineOffset = scaler.scale(2);
    fill(outlineColor);

    // 左上
    text(
      "Road Crossing Game",
      scaler.centerX - outlineOffset,
      titleY - outlineOffset
    );
    // 右上
    text(
      "Road Crossing Game",
      scaler.centerX + outlineOffset,
      titleY - outlineOffset
    );
    // 左下
    text(
      "Road Crossing Game",
      scaler.centerX - outlineOffset,
      titleY + outlineOffset
    );
    // 右下
    text(
      "Road Crossing Game",
      scaler.centerX + outlineOffset,
      titleY + outlineOffset
    );
    // 上
    text("Road Crossing Game", scaler.centerX, titleY - outlineOffset);
    // 右
    text("Road Crossing Game", scaler.centerX + outlineOffset, titleY);
    // 左
    text("Road Crossing Game", scaler.centerX - outlineOffset, titleY);
    // 下
    text("Road Crossing Game", scaler.centerX, titleY + outlineOffset);

    // 最后绘制金黄色文字
    fill(238, 173, 14); // #EEAD0E 金黄色
    text("Road Crossing Game", scaler.centerX, titleY);

    // 重置字体为默认值，以便后续文字正常显示
    textFont("Arial, sans-serif");
    textSize(scaler.getFontSize(20));

    strokeWeight(0);

    // Testing mode indicator
    if (currentGameMode === GameMode.TESTING) {
      textSize(scaler.getFontSize(20));
      fill(0, 128, 0); // Green
      text(
        "Testing Mode Enabled: Unlimited Time | All Levels Unlocked",
        scaler.centerX,
        titleY + scaler.scale(65) // 跟随标题一起下移
      );
    }

    // Draw menu buttons
    for (const button of this.buttons.mainMenu) {
      button.draw();
    }
  }

  drawCharacterSelect() {
    // background(200);
    // Use guibg image as background
    image(assetManager.getImage("guibg"), 0, 0, width, height);
    textAlign(CENTER, CENTER);
    textSize(scaler.getFontSize(36));
    //fill(0);
    stroke(139, 69, 19); // 改为棕色描边
    strokeWeight(6);
    fill("rgb(240, 213, 155)");
    textFont("Arial");
    text("Select Your Character", scaler.centerX, scaler.scale(90));
    // text("Select Your Character", width / 2, height * 0.15);

    // Draw character images
    const player1Img = assetManager.getImage("playerSelect1");
    const player2Img = assetManager.getImage("playerSelect2");
    const charHeight = scaler.scale(300);
    const charWidth = charHeight * (Player.designWidth / Player.designHeight);
    const charY = scaler.scale(165); // set vertical location for character images in the screen
    image(
      player1Img,
      scaler.scale(350) - charWidth / 2,
      charY,
      charWidth,
      charHeight
    );
    image(
      player2Img,
      scaler.scale(650) - charWidth / 2,
      charY,
      charWidth,
      charHeight
    );
    // const charSize = height * 0.4; // Set character size to half of the screen height
    // // Calculate character image's width based on aspect ratio
    // const player1Width = charSize * (player1Img.width / player1Img.height);
    // const player2Width = charSize * (player2Img.width / player2Img.height);
    // const charY = height * 0.22; // set vertical location for character images in the screen
    // // Insert images for player1 and player2
    // image(assetManager.getImage("player1"), width / 3 - player2Width / 2, charY, player1Width, charSize);
    // image(assetManager.getImage("player2"), width / 3 * 2 - player2Width / 2, charY, player2Width, charSize);

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

    // background(200);
    // Use guibg image as background
    image(assetManager.getImage("guibg"), 0, 0, width, height);

    // 标题样式
    textAlign(CENTER, CENTER);
    textSize(scaler.scale(36));
    stroke(139, 69, 19); // 改为棕色描边
    strokeWeight(6);
    fill("rgb(240, 213, 155)");
    textFont("Arial");
    text("Select Level", scaler.centerX, scaler.scale(90));

    // 重置描边
    strokeWeight(0);

    // Testing mode indicator
    if (currentGameMode === GameMode.TESTING) {
      textSize(30);
      fill(0, 128, 0); // Green
      text(
        "Testing Mode Enabled: Unlimited Time | All Levels Unlocked",
        scaler.centerX,
        scaler.scale(180)
      );
    }

    // 获取level1icon图片
    const level1Icon = assetManager.getImage("level1icon");
    const level2Icon = assetManager.getImage("level2icon");
    const level3Icon = assetManager.getImage("level3icon");

    // 绘制关卡选择按钮
    for (let i = 0; i < this.buttons.levelSelect.length; i++) {
      // 对于Level 1按钮，使用level1icon作为背景
      if (i === 0 && level1Icon) {
        this.buttons.levelSelect[i].drawWithBackground(level1Icon);
      }
      // 对于Level 2按钮，如果有图标则使用level2icon作为背景
      else if (i === 1 && level2Icon) {
        this.buttons.levelSelect[i].drawWithBackground(level2Icon);
      }
      // 对于Level 3按钮，如果有图标则使用level3icon作为背景
      else if (i === 2 && level3Icon) {
        this.buttons.levelSelect[i].drawWithBackground(level3Icon);
      }
      // 其他按钮正常绘制
      else {
        this.buttons.levelSelect[i].draw();
      }
    }
  }

  drawPauseMenu() {
    // Semi-transparent background
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // Pause menu window
    const menuWidth = scaler.scale(350);
    const menuHeight = scaler.scale(450);
    const menuX = scaler.scale(325);
    const menuY = scaler.scale(150);

    // 使用diagboxBg图像替代白色矩形背景
    const diagBoxImg = assetManager.getImage("diagboxBg");
    if (diagBoxImg) {
      // 在同样的位置绘制暂停菜单背景图像
      image(diagBoxImg, menuX, menuY, menuWidth, menuHeight);
    } else {
      // 如果图像加载失败，回退到原来的白色矩形
      fill(255);
      rect(menuX, menuY, menuWidth, menuHeight);
    }

    // 使用与角色选择界面相同的标题样式
    textAlign(CENTER, CENTER);
    textSize(scaler.scale(28));
    stroke(139, 69, 19); // 改为棕色描边
    strokeWeight(6);
    fill("rgb(240, 213, 155)");
    textFont("Arial");
    text("Game Paused", scaler.centerX, scaler.scale(270));

    // 重置描边
    strokeWeight(0);

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
    const boxWidth = scaler.scale(400);
    const boxHeight = scaler.scale(420);

    // 使用diagboxBg图像替代白色矩形背景
    const diagBoxImg = assetManager.getImage("diagboxBg");
    if (diagBoxImg) {
      // 在同样的位置绘制对话框背景图像
      image(
        diagBoxImg,
        scaler.centerX - boxWidth / 2,
        scaler.centerY - boxHeight / 2,
        boxWidth,
        boxHeight
      );
    } else {
      // 如果图像加载失败，回退到原来的白色矩形
      fill(255);
      rect(
        scaler.centerX - boxWidth / 2,
        scaler.centerY - boxHeight / 2,
        boxWidth,
        boxHeight
      );
    }

    // 使用与角色选择界面相同的标题样式
    textAlign(CENTER, CENTER);
    textSize(scaler.getFontSize(28));
    stroke(139, 69, 19); // 改为棕色描边
    strokeWeight(6);
    fill("rgb(240, 213, 155)");
    textFont("Arial");
    text("Level Complete!", scaler.centerX, scaler.scale(275));

    // 重置描边和字体样式
    strokeWeight(0);
    textSize(scaler.getFontSize(24));
    fill(0);
    text(`Score: ${this.game.player.score}`, scaler.centerX, scaler.scale(315));

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
    const boxWidth = scaler.scale(400);
    const boxHeight = scaler.scale(400);

    // 使用diagboxBg图像替代白色矩形背景
    const diagBoxImg = assetManager.getImage("diagboxBg");
    if (diagBoxImg) {
      // 在同样的位置绘制对话框背景图像
      image(
        diagBoxImg,
        scaler.centerX - boxWidth / 2,
        scaler.centerY - boxHeight / 2,
        boxWidth,
        boxHeight
      );
    } else {
      // 如果图像加载失败，回退到原来的白色矩形
      fill(255);
      rect(
        scaler.centerX - boxWidth / 2,
        scaler.centerY - boxHeight / 2,
        boxWidth,
        boxHeight
      );
    }

    // 使用与角色选择界面相同的标题样式
    textAlign(CENTER, CENTER);
    textSize(scaler.getFontSize(28));
    stroke(139, 69, 19); // 改为棕色描边
    strokeWeight(6);
    fill("rgb(240, 213, 155)");
    textFont("Arial");
    text("Game Over", scaler.centerX, scaler.scale(287));

    // 重置描边和字体样式
    strokeWeight(0);
    textSize(scaler.getFontSize(20));
    fill(0);
    text(
      `Final Score: ${this.game.player.score}`,
      scaler.centerX,
      scaler.scale(335)
    );
    text(
      `Target Score: ${LevelConfig[this.game.currentLevel].targetScore}`,
      scaler.centerX,
      scaler.scale(355)
    );

    // Draw buttons
    for (const button of this.buttons.gameOver) {
      button.draw();
    }
  }

  drawHelpScreen() {
    // background(200);
    // Use guibg image as background
    image(assetManager.getImage("guibg"), 0, 0, width, height);

    // 使用与角色选择界面相同的标题样式
    textAlign(CENTER, CENTER);
    textSize(scaler.getFontSize(36));
    stroke(139, 69, 19); // 改为棕色描边
    strokeWeight(6);
    fill("rgb(240, 213, 155)");
    textFont("Arial");
    text("Game Instructions", scaler.centerX, scaler.scale(90));

    // 重置描边和字体样式
    strokeWeight(0);

    // Instructions
    textAlign(LEFT);
    textSize(scaler.getFontSize(20));
    fill(0);

    const leftMargin = scaler.scale(100);
    const lineHeight = scaler.scale(30);
    // 将起始位置下移50个单位
    let y = scaler.scale(250); // 原来是150，下移到250

    text("- Use arrow keys or WASD to move character", leftMargin, y);
    y += lineHeight;
    text("- Press SPACE or E to pick up/drop items", leftMargin, y);
    y += lineHeight;
    text("- Press ESC to pause the game", leftMargin, y);
    y += lineHeight;
    text("- Avoid cars and carry items from left to right", leftMargin, y);
    y += lineHeight;
    text("- Heavier items (higher value) slow you down", leftMargin, y);
    y += lineHeight;
    text("- If hit by a car, you'll return to start position", leftMargin, y);
    y += lineHeight;
    text("- Reach the target score to complete the level", leftMargin, y);
    y += lineHeight;

    // Testing mode features
    if (currentGameMode === GameMode.TESTING) {
      y += lineHeight;
      fill(0, 128, 0); // Green
      text("Testing Mode Features:", leftMargin, y);
      y += lineHeight;
      text("- Game Time: 10000 seconds", leftMargin, y);
      y += lineHeight;
      text("- All levels unlocked", leftMargin, y);
    }

    // Draw return button
    this.buttons.help[0].draw();
  }

  drawSettingsScreen() {
    // background(200);
    // Use guibg image as background
    image(assetManager.getImage("guibg"), 0, 0, width, height);

    // 使用与角色选择界面相同的标题样式
    textAlign(CENTER, CENTER);
    textSize(scaler.getFontSize(36));
    stroke(139, 69, 19); // 改为棕色描边
    strokeWeight(6);
    fill("rgb(240, 213, 155)");
    textFont("Arial");
    text("Settings", scaler.centerX, scaler.scale(90));

    // 重置描边
    strokeWeight(0);

    // 在Audio Settings按钮上方添加soundicon图像
    const soundIcon = assetManager.getImage("soundicon");
    const homeIcon = assetManager.getImage("homeicon");
    if (soundIcon) {
      // 调整图标大小和位置
      const iconSize = scaler.scale(120); // 增加图标大小
      const btnX = window.scaler.scale(280); // Audio Settings按钮的x坐标
      const btnY = window.scaler.scale(290); // Audio Settings按钮的y坐标

      image(soundIcon, btnX, btnY, iconSize, iconSize);
    }

    if (homeIcon) {
      // 调整图标大小和位置
      const iconSize = scaler.scale(120);
      const btnX = window.scaler.scale(600);
      const btnY = window.scaler.scale(290);

      image(homeIcon, btnX, btnY, iconSize, iconSize);
    }

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

    // background(200);
    // Use guibg image as background
    image(assetManager.getImage("guibg"), 0, 0, width, height);

    // 使用与角色选择界面相同的标题样式
    textAlign(CENTER, CENTER);
    textSize(scaler.getFontSize(36));
    stroke(139, 69, 19); // 改为棕色描边
    strokeWeight(6);
    fill("rgb(240, 213, 155)");
    textFont("Arial");
    text("Audio Settings", scaler.centerX, scaler.scale(90));

    // 绘制音量文本
    textAlign(CENTER, CENTER);
    textSize(scaler.getFontSize(24));
    strokeWeight(0); // 取消描边
    fill(0); // 黑色
    text(
      "Volume: " + floor(this.game.volume * 100) + "%",
      scaler.centerX,
      scaler.scale(260)
    );

    // Volume slider
    const sliderX = scaler.scale(350);
    const sliderY = scaler.scale(365);
    const sliderWidth = scaler.scale(300);
    const sliderHeight = scaler.scale(20);

    fill(150);
    rect(sliderX, sliderY, sliderWidth, sliderHeight);
    fill(0, 0, 255);
    rect(sliderX, sliderY, sliderWidth * this.game.volume, sliderHeight);

    // Audio toggle
    text("Audio:", scaler.scale(400), scaler.scale(435));
    fill(
      this.game.isAudioEnabled ? 0 : 255,
      0,
      this.game.isAudioEnabled ? 255 : 0
    );
    rect(
      scaler.scale(450),
      scaler.scale(420),
      scaler.scale(100),
      scaler.scale(30)
    );
    fill(255);
    text(
      this.game.isAudioEnabled ? "ON" : "OFF",
      scaler.centerX,
      scaler.scale(435)
    );

    // Draw return button
    this.buttons.audio[0].draw();
  }

  drawGameStatus() {
    const barHeight = 45;
    fill(0, 0, 0, 150);
    noStroke();
    rect(0, 0, width, barHeight);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);

    // Set the button area width
    const buttonAreaWidth = 50 * 2 + 20;

    // Status information area (screen width minus right button area)
    const availableWidth = width - buttonAreaWidth;
    const sections = 4; // Level, Time, Score, Target
    const sectionWidth = availableWidth / sections;

    //text(`Weight: ${this.game.player?.currentItem?.weight.toFixed(1) ?? '-'}`, sectionWidth * 4.5, barHeight / 2)
    //text(`Speed: ${this.game.player?.speed.toFixed(1) ?? '-'}`, sectionWidth * 5.5, barHeight / 2);

    text(`Level: ${this.game.currentLevel}`, sectionWidth * 0.5, barHeight / 2);
    text(
      `Time: ${floor(this.game.gameTime)}`,
      sectionWidth * 1.5,
      barHeight / 2
    );
    text(
      `Score: ${this.game.player ? this.game.player.score : 0}`,
      sectionWidth * 2.5,
      barHeight / 2
    );
    text(
      `Target: ${LevelConfig[this.game.currentLevel].targetScore}`,
      sectionWidth * 3.5,
      barHeight / 2
    );

    const buttonSize = 24; // Adjust button size

    // Draw audio indicator at top-right
    const audioImg = this.game.isAudioEnabled
      ? assetManager.getImage("volumeOn")
      : assetManager.getImage("volumeOff");
    if (audioImg) {
      image(audioImg, width - 70, 8, buttonSize, buttonSize);
    }

    // Draw pause button at top-right
    const pauseImg = assetManager.getImage("pause");
    if (pauseImg) {
      image(pauseImg, width - 35, 8, buttonSize, buttonSize);
    }

    // textAlign(LEFT, BASELINE);
  }
}
