class ObstacleSystem {
    constructor() {
        this.obstacles = [];
    }

    reset() {
        this.obstacles = [];
    }

    generateObstacles() {
        this.obstacles = [];
        let possiblePositions = [];
        
        // Create possible positions along lane dividers
        for (let y = 100; y < height - 100; y += 50) {
            possiblePositions.push({ x: 325, y: y }); // First divider
            possiblePositions.push({ x: 425, y: y }); // Second divider
        }
        
        // Choose 3 non-overlapping positions
        for (let i = 0; i < 3; i++) {
            if (possiblePositions.length === 0) break;
            
            const randomIndex = floor(random(possiblePositions.length));
            const position = possiblePositions[randomIndex];
            
            this.obstacles.push(new Obstacle(position.x - 10, position.y));
            
            // Remove chosen position and nearby positions
            possiblePositions = possiblePositions.filter(pos => 
                dist(pos.x, pos.y, position.x, position.y) > 100
            );
        }
        
        console.log("Generated obstacles: ", this.obstacles.length);
    }

    checkCollisions(player) {
        return CollisionDetector.handleObstacleCollisions(player, this.obstacles);
    }

    draw() {
        for (const obstacle of this.obstacles) {
            obstacle.draw();
        }
        noStroke(); // Reset after drawing obstacles
    }
}