export class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 60;
        this.stripeCount = 6;
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