class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMainMenu" });
  }

  preload() {
    this.load.image("sprBg0", "content/sprBg00.png");
    this.load.image("sprBg1", "content/sprBg11.png");
    this.load.image("sprBtnPlay", "content/sprBtnHard.png");
    this.load.image("sprBtnPlayHover", "content/sprBtnHardHover.png");
    this.load.image("sprBtnPlayDown", "content/sprBtnHardDown.png");

    this.load.image("sprBtnPlay2", "content/sprBtnPlay2.png");
    this.load.image("sprBtnPlayHover2", "content/sprBtnPlayHover2.png");
    this.load.image("sprBtnPlayDown2", "content/sprBtnPlayDown2.png");

    this.load.image("sprBtnRestart", "content/sprBtnRestart1.png");
    this.load.image("sprBtnRestartHover", "content/sprBtnRestartHover1.png");
    this.load.image("sprBtnRestartDown", "content/sprBtnRestartDown1.png");

    this.load.image("sprBtnMenu", "content/sprBtnMenu.png");
    this.load.image("sprBtnMenuHover", "content/sprBtnMenuHover.png");
    this.load.image("sprBtnMenuDown", "content/sprBtnMenuDown.png");

    this.load.image("sprBtnVolumeUp", "content/sprBtnVolumeUp.png");
    this.load.image("sprBtnVolumeDown", "content/sprBtnVolumeDown.png");
    this.load.audio("sndBtnOver", "content/sndBtnOver.wav");
    this.load.audio("sndBtnDown", "content/sndBtnDown.wav");
    this.load.audio("sndBgm", "content/bgm.ogg");
  }

  create() {

    // Volume Up
  
    this.vol = new GameVol(this, 0, 0); 

    this.btnVolumeUp = this.add.sprite(
      25,
      this.game.config.height - 32,
      "sprBtnVolumeUp"
    );

    this.btnVolumeUp.setInteractive();

    this.btnVolumeUp.on("pointerup", function() {
      
      var tmp = this.vol.getData("data");
      if(tmp<=1) {
        this.vol.setData("data", tmp+0.1);
      }
      console.log(this.vol.getData("data"));
    }, this);

    // Volume Down

    this.btnVolumeDown = this.add.sprite(
      60,
      this.game.config.height - 32,
      "sprBtnVolumeDown"
    );

    this.btnVolumeDown.setInteractive();

    this.btnVolumeDown.on("pointerup", function() {
      
      var tmp = this.vol.getData("data");
      if(tmp>=0.1) {
        this.vol.setData("data", tmp-0.1);
      }
      
      console.log(this.vol.getData("data"));
    }, this);

    
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown"),
      bgm: this.sound.add("sndBgm", {loop: 1}, {volume: this.vol.getData("data")})
    };

    this.sound.stopAll();
    this.sound.play();
    this.sfx.bgm.play();

    this.btnPlay2 = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprBtnPlay2"
    );
    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5 + 60,
      "sprBtnPlay"
    );

    this.btnPlay.setInteractive();

    this.btnPlay.on("pointerover", function() {
      this.btnPlay.setTexture("sprBtnPlayHover"); // set the button texture to sprBtnPlayHover
      this.sfx.btnOver.play(); // play the button over sound
    }, this);

    this.btnPlay.on("pointerout", function() {
      this.setTexture("sprBtnPlay");
    });

    this.btnPlay.on("pointerdown", function() {
      this.btnPlay.setTexture("sprBtnPlayDown");
      this.sfx.btnDown.play();
    }, this);

    this.btnPlay.on("pointerup", function() {
      this.btnPlay.setTexture("sprBtnPlay");
      this.scene.start("SceneMain");
    }, this);

// 

    this.btnPlay2.setInteractive();

    this.btnPlay2.on("pointerover", function() {
      this.btnPlay2.setTexture("sprBtnPlayHover2"); // set the button texture to sprBtnPlayHover
      this.sfx.btnOver.play(); // play the button over sound
    }, this);

    this.btnPlay2.on("pointerout", function() {
      this.setTexture("sprBtnPlay2");
    });

    this.btnPlay2.on("pointerdown", function() {
      this.btnPlay2.setTexture("sprBtnPlayDown2");
      this.sfx.btnDown.play();
    }, this);

    this.btnPlay2.on("pointerup", function() {
      this.btnPlay.setTexture("sprBtnPlay2");
      this.scene.start("SceneMainEasy");
    }, this);




    this.title = this.add.text(this.game.config.width * 0.5, 140, "SPACE SHOOTER", {
      fontFamily: 'Arial',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });

    this.title.setOrigin(0.5);

    this.backgrounds = [];
    for (var i = 0; i < 5; i++) {
      var keys = ["sprBg0", "sprBg1"];
      var key = keys[Phaser.Math.Between(0, keys.length - 1)];
      var bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }
  }

  update() {
    this.sfx.bgm.volume = this.vol.getData("data");
    
    for (var i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
  }
}