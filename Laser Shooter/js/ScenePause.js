class ScenePause extends Phaser.Scene {
    constructor() {
      super({ key: "ScenePause" });
    }
    preload() {
        this.load.image("sprBtnResume", "content/sprBtnResume.png");
    }
    create() {
      this.title = this.add.text(this.game.config.width * 0.5, 128, "PAUSE", {
        fontFamily: 'monospace',
        fontSize: 48,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center'
      });
      this.title.setOrigin(0.5);
  
      this.btnResume = this.add.sprite(
        this.game.config.width * 0.5,
        this.game.config.height * 0.5,
        "sprBtnResume"
      );
  
      this.btnResume.setInteractive();
      this.btnResume.on("pointerup", function() {
        this.scene.resume('SceneMain');
        this.scene.stop();
      }, this);
  

  
  
    }
  
    update() {

    }
  }