import { Item } from "../entities/Item.js";
import { CollisionDetector } from "../utils/CollisionDetector.js";

export class ItemSystem {
    constructor() {
        this.items = [];
        this.deliveredItems = [];
        this.maxItems = 5; // maximum 5 item
        this.pickedItemsCount = 0; 
        this.itemGenerationStarted = false; 
    }

    scheduleNewItem() {
        if (!this.itemGenerationStarted && this.pickedItemsCount >= 2) { 
            this.itemGenerationStarted = true; // only once
            this.spawnItem();
        }
    }

    spawnItem() {
        if (this.items.length < this.maxItems) { 
            const warehouseWidth = width * 0.3;
            const newItem = new Item(random(50, warehouseWidth - 50), 100);
            this.items.push(newItem);

            console.log("New item generated:", newItem);
        }

        //next generation（5~10s）
        setTimeout(() => this.spawnItem(), random(5000, 10000));
    }

    handleItemPickupDrop(player) {
        if (!player.hasItem) {
            // Try to pick up an item
            for (let i = this.items.length - 1; i >= 0; i--) {
                let item = this.items[i];
                if (CollisionDetector.checkPlayerItemProximity(player, item)) {
                    player.pickupItem(item);
                    this.items.splice(i, 1);
                    this.pickedItemsCount++;

                    //New goods are generated only after 2 goods have been picked up
                    if (this.pickedItemsCount === 2) {
                        console.log("Picked 2 items, starting item generation...");
                        this.scheduleNewItem();
                    }

                    break; 
                }
            }
        } 
        else if (CollisionDetector.isInDeliveryZone(player)) { 
            console.log("Delivered item, value: " + player.currentItem.value);
            const deliveredItem = player.deliverItem();
            this.deliveredItems.push(deliveredItem);

            if (this.items.length === 0) {
                this.scheduleNewItem();
            }

            return true; // Item was delivered
        } 
        else {
            // Drop item somewhere else
            const droppedItem = player.dropItem();
            this.items.push(new Item(player.x, player.y, droppedItem.value));
        }

        return false; // No item was delivered
    }

    draw() {
        for (const item of this.items) {
            item.draw();
        }
        Item.drawDelivered(this.deliveredItems);
    }
}

