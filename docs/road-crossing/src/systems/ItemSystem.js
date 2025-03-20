//import
import { Item } from "../entities/Item.js";
import { CollisionDetector } from "../utils/CollisionDetector.js";

export class ItemSystem {
    constructor() {
        this.items = [];
        this.deliveredItems = [];
        this.maxItems = 5;
        this.pickedItemsCount = 0;
        this.itemGenerationStarted = false;

       
        this.generateInitialItems();
    }

    reset() {
        this.items = [];
        this.deliveredItems = [];
        this.pickedItemsCount = 0;

        this.itemGenerationStarted = false;
        clearTimeout(this.spawnItemTimeout);
      
        this.generateInitialItems();
    }

    generateInitialItems() {
        this.items = [];
        const warehouseWidth = width * 0.3;

        for (let i = 0; i < this.maxItems; i++) {
            let newItem;
            let attempts = 0;
            do {
                let newX = random(50, warehouseWidth - 50);
                let newY = random(100, 400);
                newItem = new Item(newX, newY);
                attempts++;
            } while (this.isOverlapping(newItem) && attempts < 10);

            if (attempts < 10) {
                this.items.push(newItem);
            }
        }

        console.log("Initial items generated:", this.items);
    }

    scheduleNewItem() {
        if (!this.itemGenerationStarted && this.pickedItemsCount >= 2) { 
            this.itemGenerationStarted = true; 

            console.log("Picked 2 items, waiting 8-10 seconds before starting item generation...");

            //A delay of 8-10 seconds before the cycle starts to generate goods
            setTimeout(() => {
                console.log("Starting item generation after delay...");
                this.spawnItem();
            }, random(8000, 10000)); 
        }
    }

    spawnItem() {
        if (this.items.length < this.maxItems) { 
            const warehouseWidth = width * 0.3;
            let newItem;
            let attempts = 0;

            do {
                let newX = random(50, warehouseWidth - 50);
                let newY = random(100, 400); 
                newItem = new Item(newX, newY);
                attempts++;
            } while (this.isOverlapping(newItem) && attempts < 10);

            if (attempts < 10) {
                this.items.push(newItem);
                console.log("New item generated:", newItem);
            } else {
                console.warn("Unable to place new item after 10 attempts, skipping...");
            }
        }

        //After each generation of goods, wait 8-10 seconds before continuing to generate
        this.spawnItemTimeout = setTimeout(() => this.spawnItem(), random(8000, 10000));
    }

    isOverlapping(newItem) {
        for (const item of this.items) {
            let distance = Math.sqrt((newItem.x - item.x) ** 2 + (newItem.y - item.y) ** 2);
            if (distance < 50) { 
                return true;
            }
        }
        return false;
    }

    handleItemPickupDrop(player) {
        if (!player.hasItem) {
            for (let i = this.items.length - 1; i >= 0; i--) {
                let item = this.items[i];
                if (CollisionDetector.checkPlayerItemProximity(player, item)) {
                    player.pickupItem(item);
                    this.items.splice(i, 1);
                    this.pickedItemsCount++;

                    // 'scheduleNewItem()' is started only when 2 goods are picked up 
                    if (this.pickedItemsCount === 2) {
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

            return true;
        } 
        else {
            const droppedItem = player.dropItem();
            this.items.push(new Item(player.x, player.y, droppedItem.value));
        }

        return false;
    }

    draw() {
        if (this.items.length === 0) {
            console.warn("Warning: No items to draw!");
        }

        for (const item of this.items) {
            item.draw();
        }

        Item.drawDelivered(this.deliveredItems);
    }
}






// import { Item } from "../entities/Item.js";
// import { CollisionDetector } from "../utils/CollisionDetector.js";

// export class ItemSystem {
//   constructor() {
//     this.items = [];
//     this.deliveredItems = [];
//   }

//   reset() {
//     this.items = [];
//     this.deliveredItems = [];
//     this.generateInitialItems();
//   }

//   generateInitialItems() {
//     this.items = [];
//     // Generate items in warehouse area (left side)
//     const warehouseWidth = width * 0.3;
    
//     for (let i = 0; i < 5; i++) {
//       this.items.push(new Item(random(50, warehouseWidth - 50), 100 + i * 80));
//     }
//   }

//   handleItemPickupDrop(player) {
//     if (!player.hasItem) {
//       // Try to pick up an item
//       for (let i = this.items.length - 1; i >= 0; i--) {
//         let item = this.items[i];
//         if (CollisionDetector.checkPlayerItemProximity(player, item)) {
//           player.pickupItem(item);
//           this.items.splice(i, 1);
//           break;
//         }
//       }
//     } else if (CollisionDetector.isInDeliveryZone(player)) {
//       // Deliver item in delivery zone
//       console.log("Delivered item, value: " + player.currentItem.value);
//       const deliveredItem = player.deliverItem();
//       this.deliveredItems.push(deliveredItem);

//       // Generate new items if all are delivered
//       if (this.items.length === 0) {
//         this.generateInitialItems();
//       }

//       return true; // Item was delivered
//     } else {
//       // Drop item somewhere else
//       const droppedItem = player.dropItem();
//       this.items.push(new Item(player.x, player.y, droppedItem.value));
//     }

//     return false; // No item was delivered
//   }

//   draw() {
//     // Draw items waiting to be picked up
//     for (const item of this.items) {
//       item.draw();
//     }

//     // Draw delivered items
//     Item.drawDelivered(this.deliveredItems);
//   }
// }