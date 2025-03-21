import { getDeliveryZone } from "../config/Constants.js";

export class Item {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value || floor(random(10, 50));
        this.size = 25;
        
        // Calculate weight based on value (between 1 and 5)
        // Higher value items are heavier
        this.weight = map(this.value, 10, 50, 1, 5);
        this.weight = constrain(this.weight, 1, 5);
    }

    draw() {
        // fixed size for item
        const displaySize = this.size;
        
        // fill(0, 255, 0); // set cargo rectangle color to green
        // rect(this.x, this.y, displaySize, displaySize);
        image(assetManager.getImage("cargoUncollected"), this.x, this.y, displaySize, displaySize);

        fill(0); // set text color to black
        textSize(12);
        text(this.value, this.x, this.y - 5);
    }

    static drawDelivered(items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            // fill(0, 200, 0);
            
            // Get delivery area position
            const deliveryZone = getDeliveryZone();
            // Stacked display above the drop zone
            const displayX = deliveryZone.x + 10;
            const displayY = deliveryZone.y + 5 - i * 18;
            
            // rect(displayX, displayY, 15, 15);
            image(assetManager.getImage("cargoUncollected"), displayX, displayY, 25, 25);

            // fill(0);
            // textSize(12);
            // text(item.value, displayX, displayY - 5);
        }
    }
}