export class Item {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value || floor(random(10, 50));
        this.size = 15;
    }

    draw() {
        fill(0, 255, 0);
        rect(this.x, this.y, this.size, this.size);
        fill(0);
        textSize(12);
        text(this.value, this.x, this.y - 5);
    }

    static drawDelivered(items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            fill(0, 200, 0);
            rect(650, 100 + i * 30, 15, 15);
            fill(0);
            textSize(12);
            text(item.value, 650, 100 + i * 30 - 5);
        }
    }
}