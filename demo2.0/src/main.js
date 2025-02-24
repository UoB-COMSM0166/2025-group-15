// Main game instance
let game;

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