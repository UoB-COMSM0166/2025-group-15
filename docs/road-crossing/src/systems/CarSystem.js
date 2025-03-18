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
    
    // Set minimum spawn interval (approx 0.8s at 60fps)
    this.minSpawnInterval = 48;
    
    // Set random interval range with wider variation
    this.spawnIntervalRange = {
      min: 60,    // Increased minimum interval (1 second at 60fps)
      max: 180    // Max is 3 seconds at 60fps
    };
    
    // Set maximum waiting time to a more reasonable value
    this.maxWaitingTime = 240;  // 4 seconds max without cars
    
    // Store current spawn intervals for each lane
    this.currentSpawnIntervals = {
      slow: this.getRandomSpawnInterval(),
      medium: this.getRandomSpawnInterval(),
      fast: this.getRandomSpawnInterval()
    };
    
    // Add some randomness to initial spawn times
    this.timeSinceLastCarGeneration.slow = floor(random(0, 30));
    this.timeSinceLastCarGeneration.medium = floor(random(0, 30));
    this.timeSinceLastCarGeneration.fast = floor(random(0, 30));
    
    // Track the last time any car was generated
    this.framesSinceLastAnyCar = 0;
    
    // Initialize with some cars
    this.initialCarsGenerated = false;
  }

  reset() {
    this.cars = {
      slow: [],
      medium: [],
      fast: [],
    };
    // Reset with random values to avoid synchronization
    this.timeSinceLastCarGeneration = {
      slow: floor(random(0, 30)),
      medium: floor(random(0, 30)),
      fast: floor(random(0, 30))
    };
    this.currentSpawnIntervals = {
      slow: this.getRandomSpawnInterval(),
      medium: this.getRandomSpawnInterval(),
      fast: this.getRandomSpawnInterval()
    };
    this.framesSinceLastAnyCar = 0;
    this.initialCarsGenerated = false;
  }

  // Helper method to get random spawn interval
  getRandomSpawnInterval() {
    return floor(random(this.spawnIntervalRange.min, this.spawnIntervalRange.max));
  }

  // Method to generate initial cars when game starts
  generateInitialCars() {
    if (!this.initialCarsGenerated) {
      const config = LevelConfig[this.game.currentLevel];
      const lanes = this.game.lanes;
      
      // Generate initial cars with different starting positions
      if (random() < 0.7) {
        this.generateCarInLane("slow", lanes.SLOW.x, config);
      }
      
      if (random() < 0.5) {
        this.generateCarInLane("medium", lanes.MEDIUM.x, config);
      }
      
      if (random() < 0.6) {
        this.generateCarInLane("fast", lanes.FAST.x, config);
      }
      
      this.initialCarsGenerated = true;
    }
  }

  generateCars(frameCount) {
    const config = LevelConfig[this.game.currentLevel];
    const lanes = this.game.lanes;
    
    // Ensure there are initial cars
    this.generateInitialCars();

    // Update timers for each lane
    this.timeSinceLastCarGeneration.slow++;
    this.timeSinceLastCarGeneration.medium++;
    this.timeSinceLastCarGeneration.fast++;
    this.framesSinceLastAnyCar++;

    // Only attempt to generate cars if the minimum interval has passed
    if (this.framesSinceLastAnyCar >= this.minSpawnInterval) {
      let carGenerated = false;
      
      // Check each lane for generation
      if (this.timeSinceLastCarGeneration.slow >= this.currentSpawnIntervals.slow || 
          this.timeSinceLastCarGeneration.slow >= this.maxWaitingTime) {
        if (this.generateCarInLane("slow", lanes.SLOW.x, config)) {
          this.timeSinceLastCarGeneration.slow = 0;
          this.currentSpawnIntervals.slow = this.getRandomSpawnInterval();
          carGenerated = true;
        }
      }
      
      if (this.timeSinceLastCarGeneration.medium >= this.currentSpawnIntervals.medium || 
          this.timeSinceLastCarGeneration.medium >= this.maxWaitingTime) {
        // Only try to generate if we haven't already generated a car this frame or if enough time passed
        if (!carGenerated || this.framesSinceLastAnyCar >= this.minSpawnInterval * 2) {
          if (this.generateCarInLane("medium", lanes.MEDIUM.x, config)) {
            this.timeSinceLastCarGeneration.medium = 0;
            this.currentSpawnIntervals.medium = this.getRandomSpawnInterval();
            carGenerated = true;
          }
        }
      }
      
      if (this.timeSinceLastCarGeneration.fast >= this.currentSpawnIntervals.fast || 
          this.timeSinceLastCarGeneration.fast >= this.maxWaitingTime) {
        // Only try to generate if we haven't already generated cars or if enough time passed
        if (!carGenerated || this.framesSinceLastAnyCar >= this.minSpawnInterval * 3) {
          if (this.generateCarInLane("fast", lanes.FAST.x, config)) {
            this.timeSinceLastCarGeneration.fast = 0;
            this.currentSpawnIntervals.fast = this.getRandomSpawnInterval();
            carGenerated = true;
          }
        }
      }
      
      // Reset timer if any car was generated
      if (carGenerated) {
        this.framesSinceLastAnyCar = 0;
      }
    }

    // Additional cars for higher levels with reduced probability
    if (this.game.currentLevel >= 2 && frameCount % 90 === 0 && random() < 0.3 && 
        this.framesSinceLastAnyCar >= this.minSpawnInterval) {
      const lane = random(["slow", "medium", "fast"]);
      const laneX = lanes[lane.toUpperCase()].x;
      if (this.generateCarInLane(lane, laneX, config)) {
        this.framesSinceLastAnyCar = 0;
      }
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
      return false;
    }

    // Calculate lane width and center position
    const laneWidth = this.game.lanes[laneType.toUpperCase()].width;
    const carWidth = 45; // This should match the car width in Car.js
    
    // Position car in the center of its lane
    const centerX = x + (laneWidth - carWidth) / 2;
    
    // Create and add the new car at the center of the lane
    const newCar = new Car(centerX, startY, speed, direction);
    this.cars[laneType].push(newCar);
    
    return true;
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