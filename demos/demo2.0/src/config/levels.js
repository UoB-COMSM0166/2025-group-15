// Level configuration
const LEVEL_CONFIG = {
    1: {
        targetScore: 200,
        speedMultiplier: 1,
        hasObstacles: false,
        speeds: {
            slow: 2,
            medium: 4,
            fast: 6
        },
        carSpawnRates: {
            slow: 180,
            medium: 150,
            fast: 120
        }
    },
    2: {
        targetScore: 200,
        speedMultiplier: 1.2,
        hasObstacles: false,
        speeds: {
            slow: 2.4,
            medium: 4.8,
            fast: 7.2
        },
        carSpawnRates: {
            slow: 60,
            medium: 45,
            fast: 30
        }
    },
    3: {
        targetScore: 300,
        speedMultiplier: 1.2,
        hasObstacles: true,
        speeds: {
            slow: 2.4,
            medium: 4.8,
            fast: 7.2
        },
        carSpawnRates: {
            slow: 60,
            medium: 45,
            fast: 60
        }
    }
};