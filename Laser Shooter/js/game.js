
var config = {
    type: Phaser.WEBGL,
    width: 480,
    height: 480,
    backgroundColor: "#8f4586",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 }
      }
    },
    scene: [
        SceneMainMenu,
        SceneMain,
        SceneMainEasy,
        SceneGameOver,
        ScenePause,
        ScenePauseEasy,
    ],
    pixelArt: true,
    roundPixels: true
};

var game = new Phaser.Game(config);



