class Button {
    constructor(x, y, w, h, label, isActive = true) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.label = label;
        this.isActive = isActive;
    }

    draw() {
        fill(this.isActive ? 255 : 150);
        stroke(0);
        rect(this.x, this.y, this.w, this.h);
        fill(this.isActive ? 0 : 100);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(20);
        text(this.label, this.x + this.w/2, this.y + this.h/2);
    }

    isClicked(mx, my) {
        return this.isActive && 
               mx >= this.x && mx <= this.x + this.w && 
               my >= this.y && my <= this.y + this.h;
    }
}