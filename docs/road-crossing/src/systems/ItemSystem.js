//import
import { Item } from "../entities/Item.js";
import { CollisionDetector } from "../utils/CollisionDetector.js";

export class ItemSystem {
  constructor() {
    this.items = [];
    this.deliveredItems = [];
  }

  reset() {
    this.items = [];
    this.deliveredItems = [];
    this.generateInitialItems();
  }

  generateInitialItems() {
    this.items = [];
    // Generate items in warehouse area (left side)
    const warehouseWidth = width * 0.3;
    
    for (let i = 0; i < 5; i++) {
      this.items.push(new Item(random(50, warehouseWidth - 50), 100 + i * 80));
    }
  }

  handleItemPickupDrop(player) {
    if (!player.hasItem) {
      // Try to pick up an item
      for (let i = this.items.length - 1; i >= 0; i--) {
        let item = this.items[i];
        if (CollisionDetector.checkPlayerItemProximity(player, item)) {
          player.pickupItem(item);
          this.items.splice(i, 1);
          break;
        }
      }
    } else if (CollisionDetector.isInDeliveryZone(player)) {
      // Deliver item in delivery zone
      console.log("Delivered item, value: " + player.currentItem.value);
      const deliveredItem = player.deliverItem();
      this.deliveredItems.push(deliveredItem);

      // Generate new items if all are delivered
      if (this.items.length === 0) {
        this.generateInitialItems();
      }

      return true; // Item was delivered
    } else {
      // Drop item somewhere else
      const droppedItem = player.dropItem();
      this.items.push(new Item(player.x, player.y, droppedItem.value));
    }

    return false; // No item was delivered
  }

  draw() {
    // Draw items waiting to be picked up
    for (const item of this.items) {
      item.draw();
    }

    // Draw delivered items
    Item.drawDelivered(this.deliveredItems);
  }

  update() {
    // update item position based on canvas size, size auto-updated in Item.draw()
    for (const item of this.items) {
      item.update();
    }
  }
}
