var Level;
var menuState = {
    create: function(){
        game.add.image(0,0,'menu_bg');
        game.global.music = game.add.audio('menu_bgm');
        game.global.music.loop = true; 
        game.global.music.play();
        var title = game.add.image(game.width/2, -100,'title');
        title.anchor.setTo(0.5, 0.5);
        game.add.tween(title).to({y: 100}, 1000).easing(Phaser.Easing.Bounce.Out).start();
        var chef = game.add.image(-80, 260,'chef');
        chef.anchor.setTo(0.5, 0.5);
        game.add.tween(chef).to({x: game.width/6}, 1000).easing(Phaser.Easing.Bounce.Out).start();
        var select = game.add.image(game.width/2, 330,'select');
        select.anchor.setTo(0.5, 0.5);
        var level1 = game.add.text(game.width/2, game.height/2, 'Level 1', { font: '30px Century Gothic', fill: '#2e141d' });
        level1.anchor.setTo(0.5, 0.5);
        level1.inputEnabled = true;
        level1.events.onInputUp.add(this.nextState1);
        var level2 = game.add.text(game.width/2, game.height/2+50, 'Level 2', { font: '30px Century Gothic', fill: '#2e141d' });
        level2.anchor.setTo(0.5, 0.5);
        level2.inputEnabled = true;
        level2.events.onInputUp.add(this.nextState2);
        var level3 = game.add.text(game.width/2, game.height/2+100, 'Level 3', { font: '30px Century Gothic', fill: '#2e141d' });
        level3.anchor.setTo(0.5, 0.5);
        level3.inputEnabled = true;
        level3.events.onInputUp.add(this.nextState3);
        this.tutor = game.add.text(game.width/2, game.height/2+150, 'How to play', { font: '30px Century Gothic', fill: '#2e141d' });
        this.tutor.anchor.setTo(0.5, 0.5);
        this.tutor.inputEnabled = true;
        this.tutor.events.onInputUp.add(this.tutorPopUp);

        this.page = 1;
    },
    update: function() {
        if(game.input.keyboard.justReleased(Phaser.Keyboard.UP)) {
            if(game.global.music.volume<=1)game.global.music.volume += 0.1;
            if(game.global.music.volume>=1)game.global.music.volume = 1;
        }else if(game.input.keyboard.justReleased(Phaser.Keyboard.DOWN)){
            if(game.global.music.volume>=0)game.global.music.volume -= 0.1;
            if(game.global.music.volume<=0)game.global.music.volume = 0;
        }
        if(game.input.keyboard.justReleased(Phaser.Keyboard.LEFT)) {
            this.prePage();
        }else if(game.input.keyboard.justReleased(Phaser.Keyboard.RIGHT)) {
            this.nextPage();
        }
    },
    nextState1: function(){
        Level = 1;
        game.state.start('level1');
        
    },
    nextState2: function(){
        Level = 2;
        game.state.start('level1');
        
    },
    nextState3: function(){
        Level = 3;
        game.state.start('level1');
    },
    tutorPopUp: function(){
        if(flag){
            game.global.tutor_pic.kill();
            flag=0;
        }
        else{
            game.global.tutor_pic = game.add.image(750, 100,'tutor1');
            this.page = 1;
            flag = 1;
        }
    },
    nextPage(){
        if(this.page != 4 && flag){
            this.page += 1;
        }
        if(flag){
            if(game.global.tutor_pic)game.global.tutor_pic.kill();
            if(this.page == 1)game.global.tutor_pic = game.add.image(750, 100, 'tutor1');
            else if(this.page == 2)game.global.tutor_pic = game.add.image(750, 100, 'tutor2');
            else if(this.page == 3)game.global.tutor_pic = game.add.image(750, 100, 'tutor3');
            else game.global.tutor_pic = game.add.image(750, 100, 'tutor4');
        }
    },
    prePage(){
        if(this.page != 1 && flag){
            this.page -= 1;
        }
        if(flag){
            if(game.global.tutor_pic)game.global.tutor_pic.kill();
            if(this.page == 1)game.global.tutor_pic = game.add.image(750, 100, 'tutor1');
            else if(this.page == 2)game.global.tutor_pic = game.add.image(750, 100, 'tutor2');
            else if(this.page == 3)game.global.tutor_pic = game.add.image(750, 100, 'tutor3');
            else game.global.tutor_pic = game.add.image(750, 100, 'tutor4');
        }
    }
}

var flag = 0;