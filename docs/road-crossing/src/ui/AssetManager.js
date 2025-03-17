export class AssetManager {
    constructor() {
      this.images = {};
      this.sounds = {};

      // map of all the levels and their background images
      this.levelBackgrounds = {
        1: "City_background.png",
        2: "Desert_background.png",
        3: "Beach_background.png"
      };
    }
  
    preload() {
      // background image
      this.images["mainBg"] = loadImage("./assets/scene/Home.png");
      
      // sounds
      this.sounds["bgMusic"] = loadSound("./assets/Cute and chu-2 byo.mp3");
  
      // player images
      this.images["player1"] = loadImage("./assets/Character1_Walking.png");
      this.images["player2"] = loadImage("./assets/Character2_Walking.png");
      // item images
      this.images["cargo1"] = loadImage("./assets/delivery-box-45.png");
      //car images
      this.images["car1"] = loadImage("./assets/s-blue-van.svg");
      this.images["car2"] = loadImage("./assets/s-red-fireEngine.svg");
      this.images["car3"] = loadImage("./assets/s-bus-orange.png");
      this.images["car4"] = loadImage("./assets/s-blue-truck.svg");
      this.images["car5"] = loadImage("./assets/s-darkBlue-van.svg");
      this.images["car6"] = loadImage("./assets/s-grey-saloon.svg");
      this.images["car7"] = loadImage("./assets/s-white-truck-2.png");
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

    loadLevelBackground(level) {
      const bgKey = `level${level}Bg`;

      // if bg image is already loaded, return true
      if (this.images[bgKey]) {
        return true;
      }

      const bgFileName = this.levelBackgrounds[level];
      if (!bgFileName) {
        console.error(`Failed to load level ${level} background`);
        return false;
      }

      // load bg image
      console.log(`Loading level ${level} background: ${bgFileName}`);

      const imageLoaded = (img) => {
        this.images[bgKey] = img;
      }

      const imageError = (err) => {
        console.error(`Failed to load level ${level} background: ${bgFileName}`);
      }

      loadImage(`./assets/scene/${bgFileName}`, imageLoaded, imageError);

      // return false to indicate that bg image is not yet loaded
      return false;
    }

    getLevelBackground(level) {
      return this.images[`level${level}Bg`];
    }
  
    getImage(name) {
      return this.images[name] || null;
    }
  
    getSound(name) {
      return this.sounds[name] || null;
    }
  }
  