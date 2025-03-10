//import
import { Car } from "../entities/Car.js";
import { CollisionDetector } from "../utils/CollisionDetector.js";
import { LevelConfig } from "../config/LevelConfig.js";

export class CarSystem {
  constructor(game) {
    this.game = game;
    this.cars = {
      slow: [],
      medium: [],
      fast: [],
    };
    // Track time since last car generation
    this.timeSinceLastCarGeneration = {
      slow: 0,
      medium: 0,
      fast: 0
    };
    // Set random interval range with lower maximum
    this.spawnIntervalRange = {
      min: 10,    // Minimum frames between spawns
      max: 25     // Maximum frames between spawns - reduced to prevent long gaps
    };
    // Set absolute maximum waiting time - force car generation after this many frames
    this.maxWaitingTime = 30;
    // Store current spawn intervals for each lane
    this.currentSpawnIntervals = {
      slow: this.getRandomSpawnInterval(),
      medium: this.getRandomSpawnInterval(),
      fast: this.getRandomSpawnInterval()
    };
    // Guaranteed periodic spawning (backup to ensure consistent traffic)
    this.guaranteedSpawnInterval = 40;
    this.timeSinceLastGuaranteedSpawn = 0;
  }

  reset() {
    this.cars = {
      slow: [],
      medium: [],
      fast: [],
    };
    this.timeSinceLastCarGeneration = {
      slow: 0,
      medium: 0,
      fast: 0
    };
    this.currentSpawnIntervals = {
      slow: this.getRandomSpawnInterval(),
      medium: this.getRandomSpawnInterval(),
      fast: this.getRandomSpawnInterval()
    };
    this.timeSinceLastGuaranteedSpawn = 0;
  }

  // Helper method to get random spawn interval
  getRandomSpawnInterval() {
    return floor(random(this.spawnIntervalRange.min, this.spawnIntervalRange.max));
  }

  generateCars(frameCount) {
    const config = LevelConfig[this.game.currentLevel];
    const lanes = this.game.lanes;

    // Update timers for each lane
    this.timeSinceLastCarGeneration.slow++;
    this.timeSinceLastCarGeneration.medium++;
    this.timeSinceLastCarGeneration.fast++;
    this.timeSinceLastGuaranteedSpawn++;

    // Generate cars based on random intervals or force generation if max waiting time is reached
    if (this.timeSinceLastCarGeneration.slow >= this.currentSpawnIntervals.slow || 
        this.timeSinceLastCarGeneration.slow >= this.maxWaitingTime) {
      this.generateCarInLane("slow", lanes.SLOW.x, config);
      this.timeSinceLastCarGeneration.slow = 0;
      this.currentSpawnIntervals.slow = this.getRandomSpawnInterval();
    }
    
    if (this.timeSinceLastCarGeneration.medium >= this.currentSpawnIntervals.medium || 
        this.timeSinceLastCarGeneration.medium >= this.maxWaitingTime) {
      this.generateCarInLane("medium", lanes.MEDIUM.x, config);
      this.timeSinceLastCarGeneration.medium = 0;
      this.currentSpawnIntervals.medium = this.getRandomSpawnInterval();
    }
    
    if (this.timeSinceLastCarGeneration.fast >= this.currentSpawnIntervals.fast || 
        this.timeSinceLastCarGeneration.fast >= this.maxWaitingTime) {
      this.generateCarInLane("fast", lanes.FAST.x, config);
      this.timeSinceLastCarGeneration.fast = 0;
      this.currentSpawnIntervals.fast = this.getRandomSpawnInterval();
    }

    // Guaranteed periodic car generation to ensure consistent traffic flow
    if (this.timeSinceLastGuaranteedSpawn >= this.guaranteedSpawnInterval) {
      const randomLane = ["slow", "medium", "fast"][floor(random(3))];
      this.generateCarInLane(randomLane, lanes[randomLane.toUpperCase()].x, config);
      this.timeSinceLastGuaranteedSpawn = 0;
    }

    // Additional cars for higher levels
    if (this.game.currentLevel >= 2 && frameCount % 15 === 0 && random() < 0.7) {
      const lane = random(["slow", "medium", "fast"]);
      const laneX = lanes[lane.toUpperCase()].x;
      this.generateCarInLane(lane, laneX, config);
    }
  }

  generateCarInLane(laneType, x, config) {
    const speed = config.speeds[laneType];

    // Determine car direction based on the level configuration
    let direction = 1; // Default direction is down
    
    // Check if this lane should be reversed for this level
    if (config.reverseLanes && config.reverseLanes[laneType]) {
      direction = -1;
    }

    // Set starting position based on direction
    const startY = direction === 1 ? -75 : height + 75; // Adjusted for larger car size

    // Check if we can generate a new car (avoid too close cars)
    const lastCar = this.cars[laneType][this.cars[laneType].length - 1];
    if (
      lastCar &&
      ((direction === 1 && lastCar.y < 100) ||
        (direction === -1 && lastCar.y > height - 100))
    ) {
      return;
    }

    // Calculate lane width and center position
    const laneWidth = this.game.lanes[laneType.toUpperCase()].width;
    const carWidth = 45; // This should match the car width in Car.js
    
    // Position car in the center of its lane
    const centerX = x + (laneWidth - carWidth) / 2;
    
    // Create and add the new car at the center of the lane
    const newCar = new Car(centerX, startY, speed, direction);
    this.cars[laneType].push(newCar);
  }

  update(player) {
    let collisionDetected = false;

    Object.keys(this.cars).forEach((laneType) => {
      for (let i = this.cars[laneType].length - 1; i >= 0; i--) {
        const car = this.cars[laneType][i];
        car.update();

        // Check for collision with player
        if (CollisionDetector.checkPlayerRectCollision(player, car)) {
          collisionDetected = true;
        }

        // Remove off-screen cars
        if (car.isOffScreen()) {
          this.cars[laneType].splice(i, 1);
        }
      }
    });

    return collisionDetected;
  }

  draw() {
    Object.keys(this.cars).forEach((laneType) => {
      this.cars[laneType].forEach((car) => {
        car.draw();
      });
    });
  }
}