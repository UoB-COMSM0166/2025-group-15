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

// p5.js setup function - increase canvas size to fill 80% of the window
function setup() {
  // Calculate canvas size to fill 80% of window width and 90% of window height
  const canvasWidth = Math.floor(windowWidth * 0.8);
  const canvasHeight = Math.floor(windowHeight * 0.9);
  
  // p5.js createCanvas function, set canvas size, auto add two global var: width, height
  createCanvas(canvasWidth, canvasHeight);
  game = new Game();
}

// p5.js window resize function
function windowResized() {
  const canvasWidth = Math.floor(windowWidth * 0.8);
  const canvasHeight = Math.floor(windowHeight * 0.9);
  resizeCanvas(canvasWidth, canvasHeight);
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
window.windowResized = windowResized;
window.draw = draw;
window.mouseClicked = mouseClicked;
window.keyPressed = keyPressed;
window.keyReleased = keyReleased;