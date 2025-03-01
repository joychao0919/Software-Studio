var loadState = {
  preload: function () {
    // Add a 'loading...' label on the screen
    var loadingLabel = game.add.text(game.width/2, 150,
    'loading...', { font: '30px Arial', fill: '#ffffff' });
    loadingLabel.anchor.setTo(0.5, 0.5);
    // Display the progress bar
    var progressBar = game.add.sprite(game.width/2, 200, 'progressBar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);
    // Load all game assets
    game.load.spritesheet('player', 'assets/player.png', 20, 20);
    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('coin', 'assets/coin.png');
    game.load.image('wallV', 'assets/wallVertical.png');
    game.load.image('wallH', 'assets/wallHorizontal.png');
    // Load a new asset that we will use in the menu state
    game.load.image('background', 'assets/background.png');

    game.load.image('pixel', 'assets/pixel.png');
  },
  create: function() {
    // Go to the menu state
    game.state.start('menu');
  }
}; 