class SceneMainEasy extends Phaser.Scene {
    constructor() {
      super({ key: "SceneMainEasy" });
    }


  preload() {
    this.load.image("sprBg0", "content/sprBg00.png");
    this.load.image("sprBg1", "content/sprBg11.png");
    this.load.image("sprBtnPause", "content/sprBtnPause.png");
    this.load.spritesheet("sprExplosion", "content/sprExplosion.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("sprEnemy0", "content/sprEnemy0.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("sprEnemy1", "content/sprEnemy1.png");
    this.load.spritesheet("sprEnemy2", "content/sprEnemy2.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("sprLaserEnemy0", "content/sprLaserEnemy0.png");
    this.load.image("sprLaserPlayer", "content/sprLaserPlayer.png");
    this.load.spritesheet("sprPlayer", "content/sprPlayer.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("sprLife", "content/sprLife.png", {
      frameWidth: 72,
      frameHeight: 12
    });
    this.load.image("sprHeart", "content/sprHeart.png");
    this.load.image("red", "content/red.png");
    this.load.audio("sndExplode0", "content/sndExplode0.wav");
    this.load.audio("sndExplode1", "content/sndExplode1.wav");
    this.load.audio("sndLaser", "content/sndLaser.wav");
  }

  create() {

    var redParticles = this.add.particles('red');

    // Pause Button
    
    this.btnPause = this.add.sprite(
      this.game.config.width - 32,
      32,
      "sprBtnPause"
    );
    
    this.btnPause.setInteractive();

    this.btnPause.on("pointerup", function() {
      this.scene.launch('ScenePauseEasy');
      this.scene.pause();
    }, this);


    this.anims.create({
      key: "sprEnemy0",
      frames: this.anims.generateFrameNumbers("sprEnemy0"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "sprEnemy2",
      frames: this.anims.generateFrameNumbers("sprEnemy2"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "sprExplosion",
      frames: this.anims.generateFrameNumbers("sprExplosion"),
      frameRate: 20,
      repeat: 0
    });
    this.anims.create({
      key: "sprPlayer",
      frames: this.anims.generateFrameNumbers("sprPlayer"),
      frameRate: 20,
      repeat: -1
    });   
    this.anims.create({
      key: "sprBoss",
      frames: this.anims.generateFrameNumbers("sprBoss"),
      frameRate: 40,
      repeat: -1
    });  

    this.sfx = {
      explosions: [
        this.sound.add("sndExplode0"),
        this.sound.add("sndExplode1")
      ],
      laser: this.sound.add("sndLaser")
    };

    this.backgrounds = [];
    for (var i = 0; i < 5; i++) { // create five scrolling backgrounds
      var bg = new ScrollingBackground(this, "sprBg0", i * 10);
      this.backgrounds.push(bg);
    }

    var score = 0;
    var scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '18px', fill: '#fff' });

    var life = 5;
    var lifeText = this.add.text(16, 32, 'Life: 5', { fontSize: '18px', fill: '#fff' });

    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprPlayer"
    ); 

    this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();
    this.hearts = this.add.group();

    this.time.addEvent({
      delay: 1500,
      callback: function() {
        var enemy = null;
        var heart = null;
        var boss = null;
        
        if (Phaser.Math.Between(0, 10) >= 3) {
          enemy = new GunShip(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0
          );
        }
        else if (Phaser.Math.Between(0, 10) >= 5) {
          if (this.getEnemiesByType("ChaserShip").length < 5) {
            enemy = new ChaserShip(
              this,
              Phaser.Math.Between(0, this.game.config.width),
              0
            );
          }
        }
        else if (Phaser.Math.Between(0, 10) >= 6) {
          heart = new Heart(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0
          );
        }
        else {
          enemy = new CarrierShip(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0
          );
        }
        if (enemy !== null) {
          enemy.setScale(Phaser.Math.Between(10, 20) * 0.1);
          this.enemies.add(enemy);
        }
        if (heart != null) {
          this.hearts.add(heart);
        }
      },
      callbackScope: this,
      loop: true
    });

    this.physics.add.collider(this.playerLasers, this.enemies, function(playerLaser, enemy) {
      if (enemy) {
        if (enemy.onDestroy !== undefined) {
          enemy.onDestroy();
        }
        score += 10;
        scoreText.setText('Score: ' + score);
        enemy.explode(true);
        playerLaser.destroy();
      }
    });

    this.physics.add.overlap(this.player, this.enemies, function(player, enemy) {
      if (!player.getData("isDead") && !enemy.getData("isDead")) {
        life -= 1;
        lifeText.setText('Life: ' + life);
        if(life<=0) {
          var redParticleEmitter = redParticles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            x: player.x,
            y: player.y,
            maxParticles: 10
          });
          redParticleEmitter.start;
          player.explode(false);
          player.onDestroy();
        }
        enemy.explode(true);
      }
      else {

      }
    });

    this.physics.add.overlap(this.player, this.hearts, function(player, heart) {
      if (!player.getData("isDead") && !heart.getData("isDead")) {
        life += 1;
        lifeText.setText('Life: ' + life);
        heart.destroy();
      }
      else {

      }
    });

    this.physics.add.overlap(this.player, this.enemyLasers, function(player, laser) {
      if (!player.getData("isDead") && !laser.getData("isDead")) {
        life -= 1;
        lifeText.setText('Life: ' + life);
        var redParticleEmitter = redParticles.createEmitter({
          speed: 70,
          scale: { start: 1, end: 0 },
          x: player.x,
          y: player.y,
          maxParticles: 10
          //lifespan: 1000,
        });
      
        if(life<=0) {
          player.explode(false);
          player.onDestroy();
        }
        laser.destroy();
      }
    });

  }

  /*
  onpause(){
    if(game.paused){
        game.paused = false;
    }
  }

  clickpause() {
    if(this.scene.isPaused()==false) {
      var check = this.scene.isPaused();
      console.log("not paused");
      console.log(check);
      this.scene.pause(this);
    }
    else {
      var check = this.scene.isPaused();
      console.log("paused");
      console.log(check);
      this.scene.resume(this);
    }
  }
  */
  
  
  getEnemiesByType(type) {
    var arr = [];
    for (var i = 0; i < this.enemies.getChildren().length; i++) {
      var enemy = this.enemies.getChildren()[i];
      if (enemy.getData("type") == type) {
        arr.push(enemy);
      }
    }
    return arr;
  }

  update() {

    if (!this.player.getData("isDead")) {
      this.player.update();
      if (this.keyUP.isDown) {
        this.player.moveUp();
      }
      else if (this.keyDOWN.isDown) {
        this.player.moveDown();
      }
      if (this.keyLEFT.isDown) {
        this.player.moveLeft();
      }
      else if (this.keyRIGHT.isDown) {
        this.player.moveRight();
      }
      if (this.keySpace.isDown) {
        this.player.setData("isShooting", true);
      }
      else if(this.keyQ.isDown) {
        this.player.setData("isSkill", true);
      }
      else if(this.keyA.isDown) {
        for(var i = 0; i < this.enemies.getChildren().length; i++) {
          var enemy = this.enemies.getChildren()[i];
          enemy.explode(true);
          this.player.setData("killAll", true);
          //this.scoreText.setText('Score: ' + score);
        }
      }
      else {
        this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1);
        this.player.setData("isShooting", false);
        this.player.setData("isSkill", false);
      }
    }

    for (var i = 0; i < this.enemies.getChildren().length; i++) {
      var enemy = this.enemies.getChildren()[i];
      enemy.update();
      if (enemy.x < -enemy.displayWidth ||
        enemy.x > this.game.config.width + enemy.displayWidth ||
        enemy.y < -enemy.displayHeight * 4 ||
        enemy.y > this.game.config.height + enemy.displayHeight) {
        if (enemy) {
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }
          enemy.destroy();
        }
      }
    }

    for (var i = 0; i < this.hearts.getChildren().length; i++) {
      var heart = this.hearts.getChildren()[i];
      heart.update();
      if (heart.x < -heart.displayWidth ||
        heart.x > this.game.config.width + heart.displayWidth ||
        heart.y < -heart.displayHeight * 4 ||
        heart.y > this.game.config.height + heart.displayHeight) {
        if (heart) {
          if (heart.onDestroy !== undefined) {
            heart.onDestroy();
          }
          heart.destroy();
        }
      }
    }

    for (var i = 0; i < this.enemyLasers.getChildren().length; i++) {
      var laser = this.enemyLasers.getChildren()[i];
      laser.update();
      if (laser.x < -laser.displayWidth ||
        laser.x > this.game.config.width + laser.displayWidth ||
        laser.y < -laser.displayHeight * 4 ||
        laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    for (var i = 0; i < this.playerLasers.getChildren().length; i++) {
      var laser = this.playerLasers.getChildren()[i];
      laser.update();
      if (laser.x < -laser.displayWidth ||
        laser.x > this.game.config.width + laser.displayWidth ||
        laser.y < -laser.displayHeight * 4 ||
        laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    for (var i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
  }
}

