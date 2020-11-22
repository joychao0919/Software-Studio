var loadState = {
    preload: function () {
      // Load all game assets
      game.load.image('background', 'assets/background.jpg');
      game.load.image('menu_bg', 'assets/menu_bg.jpg');
      game.load.image('sandwich', 'assets/sandwich.png');
      game.load.image('title', 'assets/title.png');
      game.load.image('chef', 'assets/chef.png');
      game.load.image('tutor1', 'assets/tutorial1.png');
      game.load.image('tutor2', 'assets/tutorial2.png');
      game.load.image('tutor3', 'assets/tutorial3.png');
      game.load.image('tutor4', 'assets/tutorial4.png');
      game.load.image('pause_bg', 'assets/pause_bg.png');
      game.load.image('select', 'assets/select.png');
      //for countdown
      game.load.image('one', 'assets/one.png');
      game.load.image('two', 'assets/two.png');
      game.load.image('three', 'assets/three.png');
      //for match side
      game.load.spritesheet('food', 'assets/match/food.png', 50, 50);
      game.load.image('bread_bar', 'assets/match/bread_bar.png'); //50*50
      game.load.image('bacon_bar', 'assets/match/bacon_bar.png');
      game.load.image('cheese_bar', 'assets/match/cheese_bar.png');
      game.load.image('lettuce_bar', 'assets/match/lettuce_bar.png');
      game.load.image('tomato_bar', 'assets/match/tomato_bar.png');
      game.load.image('egg_bar', 'assets/match/egg_bar.png');
      game.load.image('match_bg','assets/match/match_bg.jpg');
      game.load.image('wait_bg','assets/match/wait_bg.jpg');
       //for meal side
       game.load.image('bread', 'assets/meal/bread.png'); //150*115
       game.load.image('bacon', 'assets/meal/bacon.png');
       game.load.image('cheese', 'assets/meal/cheese.png');
       game.load.image('lettuce', 'assets/meal/lettuce.png');
       game.load.image('tomato', 'assets/meal/tomato.png');
       game.load.image('egg', 'assets/meal/egg.png');
       game.load.image('plate', 'assets/meal/plate.png'); //150*115
       game.load.image('trash', 'assets/meal/trash.png'); //150*150
       game.load.image('pointer', 'assets/meal/pointer.png'); //50*50
       game.load.image('recipe1', 'assets/meal/recipe1.jpg');//180*120
       game.load.image('recipe2', 'assets/meal/recipe2.jpg');
       game.load.image('recipe3', 'assets/meal/recipe3.jpg');
       game.load.image('recipe4', 'assets/meal/recipe4.jpg');
       game.load.image('recipe5', 'assets/meal/recipe5.jpg');
       game.load.image('recipe6', 'assets/meal/recipe6.jpg');
       game.load.image('recipe7', 'assets/meal/recipe7.jpg');
       game.load.spritesheet('Mouse', 'assets/meal/mouse.png', 100, 100);
       game.load.spritesheet('rabbit', 'assets/meal/rabbit.png', 50, 76);
       game.load.spritesheet('cat', 'assets/meal/cat.png', 50, 65);
       game.load.spritesheet('goat', 'assets/meal/goat.png', 63, 74);
       game.load.spritesheet('dog', 'assets/meal/dog.png', 73, 71);
       //for sounds
       game.load.audio('menu_bgm', 'assets/menu_bgm.mp3');
       game.load.audio('game_bgm', 'assets/game_bgm.mp3');
       game.load.audio('deliver', 'assets/ding.mp3');
       game.load.audio('match_sound', 'assets/match.mp3');	   
       game.load.audio('end_bgm', 'assets/end_bgm.mp3');
      // Load a new asset that we will use in the menu state
      game.load.image('background', 'assets/background.png');
      game.load.image('star_filled', 'assets/star_filled.png');
      game.load.image('star', 'assets/star.png');
      game.load.image('cry_chef', 'assets/cry_chef.png');
      game.load.image('happy_chef', 'assets/happy_chef.png');
    },
    create: function() {
        game.stage.backgroundColor = '#28587b';
        var sandwich = game.add.image(game.width/2, game.height/2-80,'sandwich');
        sandwich.anchor.setTo(0.5, 0.5);
        barDown = game.add.graphics(game.width/3,300);
        barDown.anchor.setTo(0.5, 0.5);
        barDown.beginFill(0x7dcfb6);
        barDown.drawRect(0,0,350,30);

        barUp = game.add.graphics(game.width/3,300);
        barUp.anchor.setTo(0.5, 0.5);
        barUp.beginFill(0xf79256);
        barUp.drawRect(0,0,350,30);
        
        maxWidth = 350;
        barUp.width=0;
        
        tween = game.add.tween(barUp);
        tween.to({width:maxWidth},1500);
        this.time=game.time.now+1600;
        tween.start();
        tween.onComplete.add(this.change,this);
    },
    change: function(){
        game.state.start('menu');
    }
  }; 

  