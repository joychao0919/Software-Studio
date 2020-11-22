// Initialize Phaser
var game = new Phaser.Game(1100, 500, Phaser.AUTO, 'canvas');
// Define our global variable
game.global = { score: 0,time_m:0,time_s:0,star:0};
game.global = {music: 0};
// Add all the states
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('level1', level1State);
game.state.add('end', endState);
// Start the 'load' state
game.state.start('load');