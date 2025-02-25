class Car {
    constructor(x, y, speed, direction) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 30;
        this.height = 50;
        this.direction = direction || 1; // 1 = down, -1 = up
        this.color = this.generateRandomColor();
    }

    generateRandomColor() {
        const carColors = [
            [255, 0, 0],    // Red
            [0, 0, 255],    // Blue
            [0, 180, 0],    // Green
            [255, 165, 0],  // Orange
            [255, 0, 255],  // Purple
            [0, 255, 255],  // Cyan
            [255, 215, 0],  // Gold
            [139, 69, 19]   // Brown
        ];
        
        const randomColorIndex = floor(random(carColors.length));
        return carColors[randomColorIndex];
    }

    update() {
        this.y += this.speed * this.direction;
    }

    draw() {
        // Base car color
        fill(this.color[0], this.color[1], this.color[2]);
        rect(this.x, this.y, this.width, this.height);
        
        // Car details based on direction
        if (this.direction === 1) { // Driving down
            // Headlights (bottom)
            fill(255, 255, 0); // Yellow lights
            rect(this.x + 5, this.y + 40, 5, 5);
            rect(this.x + 20, this.y + 40, 5, 5);
            
            // Taillights (top)
            fill(255, 0, 0); // Red lights
            rect(this.x + 5, this.y + 5, 5, 5);
            rect(this.x + 20, this.y + 5, 5, 5);
            
            // Windshield
            fill(200, 200, 255);
            rect(this.x + 5, this.y + 25, 20, 15);
        } else { // Driving up
            // Headlights (top)
            fill(255, 255, 0); // Yellow lights
            rect(this.x + 5, this.y + 5, 5, 5);
            rect(this.x + 20, this.y + 5, 5, 5);
            
            // Taillights (bottom)
            fill(255, 0, 0); // Red lights
            rect(this.x + 5, this.y + 40, 5, 5);
            rect(this.x + 20, this.y + 40, 5, 5);
            
            // Windshield
            fill(200, 200, 255);
            rect(this.x + 5, this.y + 10, 20, 15);
        }
    }

    isOffScreen() {
        return (this.direction === 1 && this.y > height + 50) || 
               (this.direction === -1 && this.y < -50);
    }
}