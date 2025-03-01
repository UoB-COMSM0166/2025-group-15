import { Game } from "./core/Game.js";
import { GameMode } from "./config/GameMode.js";
import { AssetManager } from "./ui/AssetManager.js";

// Main game instance
let game;
let assetManager;

function preload() {
  assetManager = new AssetManager();
  window.assetManager = assetManager;
  assetManager.preload();
}
// Set current game mode - change to NORMAL for regular play
window.currentGameMode = GameMode.NORMAL;

// p5.js setup function
function setup() {
  createCanvas(800, 600);
  game = new Game();
}

// p5.js draw function
function draw() {
  game.draw();
}

// p5.js event handlers
function mouseClicked() {
  game.handleMouseClicked();
}

function keyPressed() {
  game.handleKeyPressed(keyCode);
}

function keyReleased() {
  game.handleKeyReleased(keyCode);
}

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mouseClicked = mouseClicked;
window.keyPressed = keyPressed;
window.keyReleased = keyReleased;
