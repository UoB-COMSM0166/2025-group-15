export class Button {
  constructor(x, y, w, h, label, isActive = true) {
    // store coordinates and size in ideal design
    this.designX = x;
    this.designY = y;
    this.designWidth = w;
    this.designHeight = h;
    this.designBorderRadius = 40; // Add design-time borderRadius value
    this.label = label;
    this.isActive = isActive;

    // initialize cached values
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.borderRadius = 0;
    this.needUpdate = true;

    // Track mouse hover state
    this.isHovered = false;

    // New style properties
    // New style properties (Orange/Gold theme)
    this.normalColors = {
      top: color(243, 156, 18), // #f39c12 - Orange top
      bottom: color(230, 126, 34), // #e67e22 - Orange-red bottom
    };

    this.hoverColors = {
      top: color(241, 196, 15), // #f1c40f - Golden yellow top (hover)
      bottom: color(243, 156, 18), // #f39c12 - Orange bottom
    };
    this.selectedColor = color(0, 153, 76); // Gold color for selected state
  }

  // check if the button location and size need to be updated
  update() {
    if (this.needUpdate) {
      this.x = window.scaler.scale(this.designX);
      this.y = window.scaler.scale(this.designY);
      this.w = window.scaler.scale(this.designWidth);
      this.h = window.scaler.scale(this.designHeight);
      // Use designBorderRadius as the base value for scaling
      this.borderRadius = window.scaler.scale(this.designBorderRadius / 2); // Divide by 2 to get an appropriate visual effect
      this.needUpdate = false;
    }
  }

  // Check if mouse is hovering over button
  checkHover(mx, my) {
    this.update();
    this.isHovered =
      this.isActive &&
      mx >= this.x &&
      mx <= this.x + this.w &&
      my >= this.y &&
      my <= this.y + this.h;
    return this.isHovered;
  }

  draw(isSelected = false) {
    // update the button location and size if needed
    this.update();

    // Check hover if mouse coordinates are available
    if (typeof mouseX !== "undefined" && typeof mouseY !== "undefined") {
      this.checkHover(mouseX, mouseY);
    }

    push();

    // Apply disabled style if not active
    if (!this.isActive) {
      // Disabled button style - gray gradient
      this.drawGradient(color(180), color(150), this.borderRadius);
      fill(100); // Dark gray text
    }
    // Apply selected style
    else if (isSelected) {
      // Add stroke effect
      stroke(230, 126, 34); // Orange-red stroke, matching the button base theme
      strokeWeight(3); // Set stroke width to 3 pixels
      // Selected button style - gold
      fill(this.selectedColor);
      // Use rounded rectangle
      rect(this.x, this.y, this.w, this.h, this.borderRadius);
      fill(255); // White text
      noStroke(); // Remove stroke before drawing text
    }
    // Apply hover style
    else if (this.isHovered) {
      // Hover button style - lighter blue gradient
      this.drawGradient(
        this.hoverColors.top,
        this.hoverColors.bottom,
        this.borderRadius
      );
      fill(255); // White text
    }
    // Apply normal style
    else {
      // Normal button style - blue gradient
      this.drawGradient(
        this.normalColors.top,
        this.normalColors.bottom,
        this.borderRadius
      );
      fill(255); // White text
    }

    // Draw text
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(scaler.getFontSize(20));
    // Use system Arial or sans-serif font
    textFont("Arial, sans-serif");
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);

    pop();
  }

  // Helper method to draw gradient background
  drawGradient(colorTop, colorBottom, radius) {
    // Use a single rounded rectangle, completely avoiding overlap
    noStroke();

    // Use average color as a single color fill, simplifying the drawing process
    const avgColor = lerpColor(colorTop, colorBottom, 0.5);
    fill(avgColor);
    rect(this.x, this.y, this.w, this.h, radius);
  }

  // Draw a button with image background
  drawWithBackground(backgroundImage, isSelected = false) {
    // Update button position and size
    this.update();

    // Check hover status
    if (typeof mouseX !== "undefined" && typeof mouseY !== "undefined") {
      this.checkHover(mouseX, mouseY);
    }

    push();

    // Draw image background
    if (backgroundImage) {
      if (!this.isActive) {
        // Disabled state - gray filter
        tint(150, 150, 150, 200);
      } else if (this.isHovered) {
        // Hover state - brighten image
        tint(255, 255, 255, 255); // Fully opaque and maximum brightness
      } else {
        // Normal state
        tint(245, 245, 245, 245); // Slightly darkened
      }

      // Draw image as button background
      image(backgroundImage, this.x, this.y, this.w, this.h);
      noTint(); // Reset tint
    }

    // Draw text
    textAlign(CENTER, CENTER);
    textSize(scaler.getFontSize(30));
    textFont("Arial, sans-serif");

    // Text color based on state
    if (!this.isActive) {
      fill(255, 60, 40); // Disabled state - red
    } else {
      fill(255); // Other states - white text
    }

    // Draw text
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);

    pop();
  }

  // Draw a button with an icon
  drawWithIcon(icon, iconSize, isSelected = false) {
    // First draw the button itself
    this.draw(isSelected);

    // If an icon is provided, draw it above the button
    if (icon) {
      // Calculate icon position - centered above the button
      const iconX = this.x + this.w / 2 - iconSize / 2;
      const iconY = this.y - iconSize - scaler.scale(10); // 10 scaled units above the button

      // Draw the icon
      image(icon, iconX, iconY, iconSize, iconSize);
    }
  }

  isClicked(mx, my) {
    // update the button location and size if needed
    this.update();

    return (
      this.isActive &&
      mx >= this.x &&
      mx <= this.x + this.w &&
      my >= this.y &&
      my <= this.y + this.h
    );
  }

  // set the button size and location needed to be updated
  markForUpdate() {
    this.needUpdate = true;
  }
}
