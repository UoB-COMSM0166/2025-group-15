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

// Group car types by categories
export const CAR_CATEGORIES = {
    // Slow lane vehicles
    SLOW_LANE: [
      "whiteTruck", 
      "whiteTruck2", 
      "blueTruck", 
      "orangeBus"
    ],
    
    // Medium lane vehicles
    MEDIUM_LANE: [
      "blueVan", 
      "darkBlueVan", 
      "yellowVan",
      "whiteSuv"
    ],
    
    // Fast lane vehicles
    FAST_LANE: [
      "greySaloon", 
      "whiteSaloon", 
      "whiteSaloonAntenna", 
      "whiteSaloonWindow", 
      "redPoliceCar", 
      "yellowPoliceCar", 
      "redFireEngine"
    ]
  };

// All car types in a flat array (for convenience)
export const ALL_CAR_TYPES = [
    ...CAR_CATEGORIES.SLOW_LANE,
    ...CAR_CATEGORIES.MEDIUM_LANE,
    ...CAR_CATEGORIES.FAST_LANE
  ];
  
  // Define dimensions for each car type
  export const CAR_PROPERTIES = {
    // Slow lane vehicles - large
    "whiteTruck": { width: 50, height: 105 },
    "whiteTruck2": { width: 50, height: 110 },
    "blueTruck": { width: 50, height: 100 },
    "orangeBus": { width: 50, height: 120 },
    
    // Medium lane vehicles - medium size
    "blueVan": { width: 45, height: 75 },
    "darkBlueVan": { width: 45, height: 75 },
    "yellowVan": { width: 45, height: 75 },
    "whiteSuv": { width: 45, height: 85 },
    
    // Fast lane vehicles - small
    "greySaloon": { width: 40, height: 70 },
    "whiteSaloon": { width: 40, height: 70 },
    "whiteSaloonAntenna": { width: 40, height: 70 },
    "whiteSaloonWindow": { width: 40, height: 70 },
    "redPoliceCar": { width: 42, height: 80 },
    "yellowPoliceCar": { width: 42, height: 80 },
    "redFireEngine": { width: 45, height: 95 }
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
    const deliveryZoneX = width * 0.7 + (width * 0.3) / 2; // same as player start position
    const deliveryZoneY = height / 2;
    const deliveryZoneSize = 45; // temp value, should be set based on delivery spot size
    const color = [255, 255, 0, 128]; // temp value, should be set based on delivery spot color
    return {
        x: deliveryZoneX,
        y: deliveryZoneY,
        size: deliveryZoneSize,
        color: color
    };
}