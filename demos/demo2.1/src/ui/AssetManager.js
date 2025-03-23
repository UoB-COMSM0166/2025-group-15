export class AssetManager {
    constructor() {
      this.images = {};
      this.sounds = {};
    }
  
    preload() {
      // background image
      this.images["mainBg"] = loadImage("./assets/mainBg.jpg");
  
      // sounds
      this.sounds["bgMusic"] = loadSound("./assets/Cute and chu-2 byo.mp3");
  
      // player images
      this.images["player1"] = loadImage("./assets/Character1_Walking.png");
      this.images["player2"] = loadImage("./assets/Character2_Walking.png");
      // item images
      this.images["cargo1"] = loadImage("./assets/delivery-box-45.png");
      //car images
      this.images["blueVan"] = loadImage("./assets/s-blue-van.svg");
      this.images["redFireEngine"] = loadImage("./assets/s-red-fireEngine.svg");
      this.images["orangeBus"] = loadImage("./assets/s-bus-orange.png");
      this.images["blueTruck"] = loadImage("./assets/s-blue-truck.svg");
      this.images["darkBlueVan"] = loadImage("./assets/s-darkBlue-van.svg");
      this.images["greySaloon"] = loadImage("./assets/s-grey-saloon.svg");
      this.images["whiteTruck2"] = loadImage("./assets/s-white-truck-2.png");
      this.images["redPoliceCar"] = loadImage("./assets/s-red-policeCar.svg");
      this.images["whiteSaloon"] = loadImage("./assets/s-white-saloon.svg");
      this.images["whiteSaloonAntenna"] = loadImage("./assets/s-white-saloon-antenna.svg");
      this.images["whiteSaloonWindow"] = loadImage("./assets/s-white-saloon-topWindow.svg");
      this.images["whiteSuv"] = loadImage("./assets/s-white-suv.svg");
      this.images["whiteTruck"] = loadImage("./assets/s-white-truck.svg");
      this.images["yellowPoliceCar"] = loadImage("./assets/s-yellow-policeCar.svg");
      this.images["yellowVan"] = loadImage("./assets/s-yellow-van.svg");
      // cargo images
      this.images["cargoUncollected"] = loadImage("./assets/cargo/delivery-box-45.png");
      // delivery zone images
      this.images["cargoBase"] = loadImage("./assets/cargo/overlook-base-column.png");
  
      //volume images
      this.images["volumeOn"] = loadImage("./assets/speaker_normal.svg");
      this.images["volumeOff"] = loadImage("./assets/speaker-off_normal.svg");
      //pause image
      this.images["pause"] = loadImage("./assets/pause-button_normal.svg");
  
    }
  
    getImage(name) {
      return this.images[name] || null;
    }
  
    getSound(name) {
      return this.sounds[name] || null;
    }
  }
  