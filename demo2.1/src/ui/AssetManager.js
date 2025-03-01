export class AssetManager {
    constructor() {
      this.images = {};
      this.sounds = {};
    }
  
    preload() {
      // background image
      this.images["mainBg"] = loadImage("../assets/mainBg.jpg");
  
      // sounds
      this.sounds["bgMusic"] = loadSound("../assets/Cute and chu-2 byo.mp3");
  
      // player images
      this.images["player1"] = loadImage("../assets/Character1_Walking.png");
        this.images["player2"] = loadImage("../assets/Character2_Walking.png");
      // item images
      this.images["cargo1"] = loadImage("../assets/delivery-box-45.png");
      //car images
      this.images["car1"] = loadImage("../assets/s-blue-van.svg");
      this.images["car2"] = loadImage("../assets/南-轿车-红.png");
      this.images["car3"] = loadImage("../assets/南-公交车-橙.png");
      this.images["car4"] = loadImage("../assets/s-blue-truck.svg");
      this.images["car5"] = loadImage("../assets/s-darkBlue-van.svg");
      this.images["car6"] = loadImage("../assets/s-grey-saloon.svg");
      this.images["car7"] = loadImage("../assets/s-white-truck-2.png");
  
      //volume images
      this.images["volumeOn"] = loadImage("../assets/speaker_normal.svg");
      this.images["volumeOff"] = loadImage("../assets/speaker-off_normal.svg");
      //pause image
      this.images["pause"] = loadImage("../assets/pause-button_normal.svg");
  
    }
  
    getImage(name) {
      return this.images[name] || null;
    }
  
    getSound(name) {
      return this.sounds[name] || null;
    }
  }
  