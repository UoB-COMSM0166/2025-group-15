export class Car {
    constructor(x, y, speed, direction) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        // Increase car size - make them 50% larger
        this.width = 45;  // Increased from 30
        this.height = 75; // Increased from 50
        this.direction = direction || 1; // 1 = down, -1 = up
        this.carType = floor(random(7)); // random car type
    }

    update() {
        this.y += this.speed * this.direction;
    }

    draw() {
        // get car image based on car type
        let carImg;
        if (this.carType === 0) {
            carImg = assetManager.getImage("car1");
        } else if (this.carType === 1) {
            carImg = assetManager.getImage("car2");
        } else if(this.carType === 2) {
            carImg = assetManager.getImage("car3");
        }else if(this.carType === 3) {
            carImg = assetManager.getImage("car4");
        } else if(this.carType === 4) {
            carImg = assetManager.getImage("car5");
        } else if(this.carType === 5) {
            carImg = assetManager.getImage("car6");
        } else if(this.carType === 6) {
            carImg = assetManager.getImage("car7");
        }

        // draw car image
        if (this.direction === 1) {
            image(carImg, this.x, this.y, this.width, this.height); // down direction
        } else {
            push(); // start new coordinate system
            translate(this.x + this.width / 2, this.y + this.height / 2);
            rotate(PI); // rotate 180 degrees
            image(carImg, -this.width / 2, -this.height / 2, this.width, this.height); // up direction
            pop(); // restore coordinate system
        }
    }

    isOffScreen() {
        return (this.direction === 1 && this.y > height + 50) || 
               (this.direction === -1 && this.y < -50);
    }
}