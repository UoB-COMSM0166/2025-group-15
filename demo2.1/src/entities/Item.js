export class Item {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value || floor(random(10, 50));
        this.size = 15;
        
        // Calculate weight based on value (between 1 and 5)
        // Higher value items are heavier
        this.weight = map(this.value, 10, 50, 1, 5);
        this.weight = constrain(this.weight, 1, 5);
    }

    draw() {
        // fixed size for item
        const displaySize = this.size;
        
        fill(0, 255, 0);
        rect(this.x, this.y, displaySize, displaySize);
        fill(0);
        textSize(12);
        text(this.value, this.x, this.y - 5);
    }

    static drawDelivered(items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            fill(0, 200, 0);
            
            // Get delivery area position
            const deliveryX = width * 0.7 + 50; // Position in delivery area
            const startY = height * 0.3; // Start from 30% down the screen
            
            rect(deliveryX, startY + i * 30, 15, 15);
            fill(0);
            textSize(12);
            text(item.value, deliveryX, startY + i * 30 - 5);
        }
    }
}