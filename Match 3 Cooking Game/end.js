var endState = {
    create: function(){
        game.add.image(0,0,'menu_bg');
        game.global.music.stop();
        game.global.music = game.add.audio('end_bgm');
        game.global.music.loop = true; 
        game.global.music.play();
        var star1 = game.add.image(400, 120,'star');
        star1.anchor.setTo(0.5, 0.5);
        var star2 = game.add.image(550, 120,'star');
        star2.anchor.setTo(0.5, 0.5);
        var star3 = game.add.image(700, 120,'star');
        star3.anchor.setTo(0.5, 0.5);
        
        if(game.global.star==1){
            var cry_chef = game.add.sprite(200, 300,'cry_chef');
            cry_chef.anchor.setTo(0.5, 0.5);
            var star_f1 = game.add.sprite(400, 120,'star_filled');
            star_f1.anchor.setTo(0.5, 0.5);
            star_f1.scale.setTo(0.2);
            game.add.tween(star_f1.scale).to({x: 1,y:1}, 300).start();  
        }
        else if(game.global.star==2){
            var happy_chef = game.add.sprite(200, 300,'happy_chef');
            happy_chef.anchor.setTo(0.5, 0.5);
            var star_f1 = game.add.sprite(400, 120,'star_filled');
            star_f1.anchor.setTo(0.5, 0.5);
            star_f1.scale.setTo(0.2);
            game.add.tween(star_f1.scale).to({x: 1,y:1}, 300).start(); 
            //.onComplete.add(this.change,this);
            var star_f2 = game.add.sprite(550, 120,'star_filled');
            star_f2.anchor.setTo(0.5, 0.5);
            star_f2.scale.setTo(0.2);
            game.add.tween(star_f2.scale).to({x: 1,y:1}, 300).start();
        }
        else if(game.global.star==3){
            var happy_chef = game.add.sprite(200, 300,'happy_chef');
            happy_chef.anchor.setTo(0.5, 0.5);
            var star_f1 = game.add.sprite(400, 120,'star_filled');
            star_f1.anchor.setTo(0.5, 0.5);
            star_f1.scale.setTo(0.2);
            game.add.tween(star_f1.scale).to({x: 1,y:1}, 300).start();
            var star_f2 = game.add.sprite(550, 120,'star_filled');
            star_f2.anchor.setTo(0.5, 0.5);
            star_f2.scale.setTo(0.2);
            game.add.tween(star_f2.scale).to({x: 1,y:1}, 300).start();
            var star_f3 = game.add.sprite(700, 120,'star_filled');
            star_f3.anchor.setTo(0.5, 0.5);
            star_f3.scale.setTo(0.2);
            game.add.tween(star_f3.scale).to({x: 1,y:1}, 300).start();
        }
        else{
            var cry_chef = game.add.sprite(200, 300,'cry_chef');
            cry_chef.anchor.setTo(0.5, 0.5);
        }
        //game.add.tween(chef).to({x: game.width/6}, 1000).easing(Phaser.Easing.Bounce.Out).start();
    }
}