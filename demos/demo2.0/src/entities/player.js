class Player {
    constructor(x, y) {
        this.x = x || 700;
        this.y = y || 300;
        this.size = 20;
        this.speed = 4;
        this.score = 0;
        this.hasItem = false;
        this.currentItem = null;
    }

    reset() {
        this.x = 700;
        this.y = 300;
        this.score = 0;
        this.hasItem = false;
        this.currentItem = null;
    }

    resetPosition() {
        this.x = 700;
        this.y = 300;
    }

    update(keys) {
        if (keys[LEFT_ARROW]) {
            this.x = Math.max(0, this.x - this.speed);
        }
        if (keys[RIGHT_ARROW]) {
            this.x = Math.min(width - this.size, this.x + this.speed);
        }
        if (keys[UP_ARROW]) {
            this.y = Math.max(0, this.y - this.speed);
        }
        if (keys[DOWN_ARROW]) {
            this.y = Math.min(height - this.size, this.y + this.speed);
        }
    }

    draw() {
        fill(0, 0, 255);
        circle(this.x, this.y, this.size);
        
        // Draw item if player has one
        if (this.hasItem) {
            fill(0, 255, 0);
            rect(this.x - 5, this.y - 5, 10, 10);
        }
    }

    pickupItem(item) {
        this.hasItem = true;
        this.currentItem = item;
    }

    dropItem() {
        const droppedItem = this.currentItem;
        this.hasItem = false;
        this.currentItem = null;
        return droppedItem;
    }

    deliverItem() {
        const deliveredItem = this.currentItem;
        this.score += deliveredItem.value;
        this.hasItem = false;
        this.currentItem = null;
        return deliveredItem;
    }
}