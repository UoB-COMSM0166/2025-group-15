//import
import { Car } from "../entities/Car.js";
import { CollisionDetector } from "../utils/CollisionDetector.js";
import { LevelConfig } from "../config/LevelConfig.js";
import { Lanes } from "../config/Constants.js";

export class CarSystem {
  constructor(game) {
    this.game = game;
    this.cars = {
      slow: [],
      medium: [],
      fast: [],
    };
  }

  reset() {
    this.cars = {
      slow: [],
      medium: [],
      fast: [],
    };
  }

  generateCars(frameCount) {
    const config = LevelConfig[this.game.currentLevel];

    // Generate cars for each lane
    if (frameCount % config.carSpawnRates.slow === 0) {
      this.generateCarInLane("slow", Lanes.SLOW.x, config);
    }
    if (frameCount % config.carSpawnRates.medium === 0) {
      this.generateCarInLane("medium", Lanes.MEDIUM.x, config);
    }
    if (frameCount % config.carSpawnRates.fast === 0) {
      this.generateCarInLane("fast", Lanes.FAST.x, config);
    }

    // Additional cars for levels 2 and 3
    if (this.game.currentLevel >= 2) {
      if (frameCount % 15 === 0 && random() < 0.5) {
        const lane = random(["slow", "medium", "fast"]);
        const laneX =
          lane === "slow"
            ? Lanes.SLOW.x
            : lane === "medium"
            ? Lanes.MEDIUM.x
            : Lanes.FAST.x;
        this.generateCarInLane(lane, laneX, config);
      }
    }
  }

  generateCarInLane(laneType, x, config) {
    const speed = config.speeds[laneType];

    // Determine car direction
    let direction = 1; // Default direction is down

    // Reverse middle lane in levels 2 and 3
    if (
      (this.game.currentLevel === 2 || this.game.currentLevel === 3) &&
      laneType === "medium"
    ) {
      direction = -1; // Direction is up
    }

    // Set starting position based on direction
    const startY = direction === 1 ? -50 : height + 50;

    // Check if we can generate a new car (avoid too close cars)
    const lastCar = this.cars[laneType][this.cars[laneType].length - 1];
    if (
      lastCar &&
      ((direction === 1 && lastCar.y < 100) ||
        (direction === -1 && lastCar.y > height - 100))
    ) {
      return;
    }

    // Create and add the new car
    const newCar = new Car(x + 35, startY, speed, direction);
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
