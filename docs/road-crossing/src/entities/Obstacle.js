export class Obstacle {
    constructor(x, y, movable = false, moveDirection = 1, moveSpeed = 0.5) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 120; // Doubled from 60 to 120
        this.stripeCount = 12; // Doubled from 6 to 12 to maintain proportion
        
        // Add movement-related properties
        this.movable = movable;
        this.moveDirection = moveDirection; // 1 means down, -1 means up
        this.moveSpeed = moveSpeed;
        this.originalX = x; // Store initial X position
    }

    update() {
        // Only move if movable is true
        if (this.movable) {
            this.y += this.moveSpeed * this.moveDirection;
            
            // Change direction when reaching screen edges with margins
            if (this.y <= 50 || this.y + this.height >= height - 50) {
                this.moveDirection *= -1;
            }
        }
    }

    draw() {
        stroke(0); // Black border
        strokeWeight(1);
        
        const stripeHeight = this.height / this.stripeCount;
        
        for (let i = 0; i < this.stripeCount; i++) {
            if (i % 2 === 0) {
                fill(255, 0, 0); // Red stripe
            } else {
                fill(255); // White stripe
            }
            
            rect(
                this.x, 
                this.y + i * stripeHeight, 
                this.width, 
                stripeHeight
            );
        }
    }
}