export class Obstacle {
    constructor(x, y, movable = false, moveDirection = 1, moveSpeed = 0.5) {
        this.x = x;
        this.y = y;

        // Store coordinates and size in ideal design
        this.designWidth = 20;
        this.designHeight = 120;
    
        this.stripeCount = 12; // Doubled from 6 to 12 to maintain proportion
        
        // Get scaled obstacle size
        this.width = scaler.scale(this.designWidth);
        this.height = scaler.scale(this.designHeight);

        // Add movement-related properties
        this.movable = movable;
        this.moveDirection = moveDirection; // 1 means down, -1 means up
        this.moveSpeed = moveSpeed;
        this.originalX = x; // Store initial X position
    }

    update() {
        // Update obstacle size based on scaling
        this.width = scaler.scale(this.designWidth);
        this.height = scaler.scale(this.designHeight);
        // this.moveSpeed = this.moveSpeed * scaler.unit;

        // Only move if movable is true
        if (this.movable) {
            this.y += this.moveSpeed * this.moveDirection;
            
            // Change direction when reaching screen edges with margins
            const margin = scaler.scale(50);
            if (this.y <= margin || this.y + this.height >= height - margin) {
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
