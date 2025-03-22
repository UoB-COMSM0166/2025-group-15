export class Car {
    // set car size in ideal design
    static designWidth = 45;
    static designHeight = 75;

    constructor(x, y, speed, direction) {
        this.x = x;
        this.y = y;
        this.relativeX = x / width; // store relative position
        this.relativeY = y / height;
        this.speed = speed;
        this.relativeSpeed = speed / scaler.referenceHeight; // store relative speed

        // get scaled car size
        this.width = scaler.scale(Car.designWidth);
        this.height = scaler.scale(Car.designHeight);

        this.direction = direction || 1; // 1 = down, -1 = up
        this.carType = floor(random(7)); // random car type
    }

    update() {
        // update relative position
        this.relativeY += this.relativeSpeed * this.direction;
        this.y = height * this.relativeY;
        this.x = width * this.relativeX; // update actual X position

        // update car size based on scaling
        this.width = scaler.scale(Car.designWidth);
        this.height = scaler.scale(Car.designHeight);
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
        return (this.direction === 1 && this.relativeY > 1 + scaler.scale(75) / height) || 
               (this.direction === -1 && this.relativeY < -scaler.scale(75) / height);
    }
}