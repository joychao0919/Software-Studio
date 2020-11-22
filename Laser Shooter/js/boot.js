var bootState = {
  preload: function () {
    // Load the progress bar image.
    game.load.image('progressBar', 'content/progressBar.png');
  },
  create: function() {
    // Set some game settings.
    game.stage.backgroundColor = '#8f4586';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = true;
    // Start the load state.
    game.state.start('load');
  }
}; 