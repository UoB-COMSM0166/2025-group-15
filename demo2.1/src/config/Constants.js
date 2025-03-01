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
    AUDIO: 'audio'
};

// Lane configuration
export const Lanes = {
    SLOW: { x: 225, width: 100 },
    MEDIUM: { x: 325, width: 100 },
    FAST: { x: 425, width: 100 }
};

// Pause menu buttons
export const PauseButtons= {
    resume: { x: 300, y: 250, w: 200, h: 40, text: "Continue Game" },
    restart: { x: 300, y: 300, w: 200, h: 40, text: "Restart" },
    menu: { x: 300, y: 350, w: 200, h: 40, text: "Return to Main Menu" },
    audio: { x: 300, y: 400, w: 200, h: 40, text: "Audio Settings" }
};
