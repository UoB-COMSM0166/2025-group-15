// Level configuration
export const LevelConfig = {
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
            slow: 20, // Further reduced spawn rates
            medium: 18,
            fast: 15
        },
        reverseLanes: {
            slow: true, // Make the slow lane reversed in level 1
            medium: false,
            fast: false
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
            slow: 18, // Further reduced spawn rates
            medium: 15,
            fast: 12
        },
        reverseLanes: {
            slow: false,
            medium: true, // Keep the medium lane reversed in level 2
            fast: false
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
            slow: 15, // Further reduced spawn rates
            medium: 12,
            fast: 10
        },
        reverseLanes: {
            slow: false,
            medium: true, // Keep the medium lane reversed in level 3
            fast: false
        }
    }
};