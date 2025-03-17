// Game constants and configuration
export const GameStates = {
    MENU: 'menu',
    CHARACTER_SELECT: "character_select", 
    PLAYING: 'playing',
    PAUSED: 'paused',
    LEVEL_COMPLETE: 'levelComplete',
    GAME_OVER: 'gameOver',
    LEVEL_SELECT: 'levelSelect',
    HELP: 'help',
    AUDIO: 'audio',
    SETTINGS: 'settings' // Add settings state
};

// Keys configuration for both arrow keys and WASD
export const GameKeys = {
    LEFT: [37, 65],  // LEFT_ARROW, 'A'
    RIGHT: [39, 68], // RIGHT_ARROW, 'D'
    UP: [38, 87],    // UP_ARROW, 'W'
    DOWN: [40, 83]   // DOWN_ARROW, 'S'
};

// Function to get lane configurations based on canvas size
export function getLaneConfiguration(width, height) {
    // Calculate lanes based on proportions
    // Road is approx 40% of screen width
    const roadWidth = width * 0.4;
    const roadStart = width * 0.3;
    const laneWidth = roadWidth / 3;
    
    return {
        SLOW: { x: roadStart, width: laneWidth },
        MEDIUM: { x: roadStart + laneWidth, width: laneWidth },
        FAST: { x: roadStart + laneWidth * 2, width: laneWidth }
    };
}

// Dynamically calculate game areas dimensions
export function getGameAreas(width, height) {
    return {
        warehouse: { start: 0, width: width * 0.3 },
        road: { start: width * 0.3, width: width * 0.4 },
        delivery: { start: width * 0.7, width: width * 0.3 }
    };
}

// Pause menu buttons - will be positioned dynamically in UI
export const PauseButtons = {
    resume: { text: "Continue Game" },
    restart: { text: "Restart" },
    menu: { text: "Return to Main Menu" },
    settings: { text: "Settings" }
};

// Function to get delivery Zone
export function getDeliveryZone() {
    const deliveryZoneX = width * 0.7;
    const deliveryZoneY = height / 2;
    const deliveryZoneSize = 50; // temp value, should be set based on delivery spot size
    const color = [0, 255, 0, 128]; // temp value, should be set based on delivery spot color
    return {
        x: deliveryZoneX,
        y: deliveryZoneY,
        size: deliveryZoneSize,
        color: color
    };
}