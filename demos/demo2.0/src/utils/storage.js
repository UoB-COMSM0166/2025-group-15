class GameStorage {
    static loadGameProgress() {
        // In testing mode, always return 3 to unlock all levels
        if (currentGameMode === GAME_MODE.TESTING) {
            return 3;
        }
        
        // Normal mode: load from localStorage or default to 1
        const savedProgress = localStorage.getItem('gameProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            return progress.unlockedLevels;
        }
        return 1;
    }

    static saveGameProgress(unlockedLevels) {
        // Only save progress in normal mode
        if (currentGameMode !== GAME_MODE.TESTING) {
            localStorage.setItem('gameProgress', JSON.stringify({
                unlockedLevels: unlockedLevels
            }));
        }
    }
}