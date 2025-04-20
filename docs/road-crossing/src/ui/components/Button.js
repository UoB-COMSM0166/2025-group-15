export class Button {
  constructor(x, y, w, h, label, isActive = true) {
    // store coordinates and size in ideal design
    this.designX = x;
    this.designY = y;
    this.designWidth = w;
    this.designHeight = h;
    this.designBorderRadius = 40; // 添加设计时的borderRadius值
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
      top: color(243, 156, 18), // #f39c12 - 橙色顶部
      bottom: color(230, 126, 34), // #e67e22 - 橙红底部
    };

    this.hoverColors = {
      top: color(241, 196, 15), // #f1c40f - 金黄色顶部（hover）
      bottom: color(243, 156, 18), // #f39c12 - 橙色底部
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
      // 使用designBorderRadius作为基础值进行缩放
      this.borderRadius = window.scaler.scale(this.designBorderRadius / 2); // 除以2是为了获得合适的视觉效果
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
      // 添加描边效果
      stroke(230, 126, 34); // 橙红色描边，与按钮底色主题一致
      strokeWeight(3); // 设置描边宽度为3像素
      // Selected button style - gold
      fill(this.selectedColor);
      // 使用圆角矩形
      rect(this.x, this.y, this.w, this.h, this.borderRadius);
      fill(255); // 白色文字
      noStroke(); // 绘制文字前取消描边
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
    // 使用单一的圆角矩形，完全避免重叠
    noStroke();

    // 使用平均色作为单色填充，简化绘制过程
    const avgColor = lerpColor(colorTop, colorBottom, 0.5);
    fill(avgColor);
    rect(this.x, this.y, this.w, this.h, radius);
  }

  // 绘制带有图片背景的按钮
  drawWithBackground(backgroundImage, isSelected = false) {
    // 更新按钮位置和大小
    this.update();

    // 检查悬停状态
    if (typeof mouseX !== "undefined" && typeof mouseY !== "undefined") {
      this.checkHover(mouseX, mouseY);
    }

    push();

    // 绘制图片背景
    if (backgroundImage) {
      if (!this.isActive) {
        // 禁用状态 - 灰色滤镜
        tint(150, 150, 150, 200);
      } else if (this.isHovered) {
        // 悬停状态 - 图片变亮
        tint(255, 255, 255, 255); // 完全不透明且亮度最高
      } else {
        // 正常状态
        tint(245, 245, 245, 245); // 轻微调暗
      }

      // 绘制图片作为按钮背景
      image(backgroundImage, this.x, this.y, this.w, this.h);
      noTint(); // 重置色调
    }

    // 绘制文本
    textAlign(CENTER, CENTER);
    textSize(scaler.getFontSize(30));
    textFont("Arial, sans-serif");

    // 文本颜色根据状态设置
    if (!this.isActive) {
      fill(255, 60, 40); // 禁用状态 - 红色
    } else {
      fill(255); // 其他状态 - 白色文本
    }

    // 绘制文本
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);

    pop();
  }

  // 绘制带有图标的按钮
  drawWithIcon(icon, iconSize, isSelected = false) {
    // 首先绘制按钮本身
    this.draw(isSelected);

    // 如果提供了图标，则在按钮上方绘制图标
    if (icon) {
      // 计算图标位置 - 居中于按钮上方
      const iconX = this.x + this.w / 2 - iconSize / 2;
      const iconY = this.y - iconSize - scaler.scale(10); // 在按钮上方10个缩放单位

      // 绘制图标
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
