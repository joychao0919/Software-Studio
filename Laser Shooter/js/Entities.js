class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData("type", type);
        this.setData("isDead", false);
    }

    explode(canDestroy) {
        if (!this.getData("isDead")) {
            // Set the texture to the explosion image, then play the animation
            this.setTexture("sprExplosion");  // this refers to the same animation key we used when we added this.anims.create previously
            this.play("sprExplosion"); // play the animation
      
            // pick a random explosion sound within the array we defined in this.sfx in SceneMain
            this.scene.sfx.explosions[Phaser.Math.Between(0, this.scene.sfx.explosions.length - 1)].play();
      
            if (this.shootTimer !== undefined) {
              if (this.shootTimer) {
                this.shootTimer.remove(false);
              }
            }
      
            this.setAngle(0);
            this.body.setVelocity(0, 0);
      
            this.on('animationcomplete', function() {
      
              if (canDestroy) {
                this.destroy();
              }
              else {
                this.setVisible(false);
              }
      
            }, this);
      
            this.setData("isDead", true);
          }
    }
}

class GameVol extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setData("data", 0.5);
        this.setData("stopMusic", false);
    }
}

class FinalScore extends Entity {
    constructor (scene, x, y) {
        super(scene, x, y);
        this.setData("data", 0);
    }
}

class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Player");
        this.setData("speed", 200);
        this.play("sprPlayer");
        this.setData("isShooting", false);
        this.setData("isSkill", false);
        this.setData("killAll", false);
        this.setData("timerShootDelay", 10);
        this.setData("timerShootTick", this.getData("timerShootDelay") - 1);
        this.setData("playrLife", 5);
    }

    moveUp() {
        this.body.velocity.y = -this.getData("speed");
    }
    moveDown() {
        this.body.velocity.y = this.getData("speed");
    }
    moveLeft() {
        this.body.velocity.x = -this.getData("speed");
    }
    moveRight() {
        this.body.velocity.x = this.getData("speed");
    }

    create() {
        
    }

    update() {
        this.body.setVelocity(0, 0);
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
        
        // allow player to shoot 
        if (this.getData("isShooting")) {
            if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
              this.setData("timerShootTick", this.getData("timerShootTick") + 1); // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
            }
            else { // when the "manual timer" is triggered:
              var laser = new PlayerLaser(this.scene, this.x, this.y);
              this.scene.playerLasers.add(laser);
            
              this.scene.sfx.laser.play(); // play the laser sound effect
              this.setData("timerShootTick", 0);
            }
        }

        if(this.getData("isSkill")) {
            if (this.getData("timerShootTick") < this.getData("timerShootDelay")*10) {
                this.setData("timerShootTick", this.getData("timerShootTick") + 1); // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
            }
            else {
                for(var i = 0; i < 32; i++) {
                    var laser = new PlayerLaser(this.scene, this.x-480+30*i, this.y);
                    this.scene.playerLasers.add(laser);
                    this.scene.sfx.laser.play();
                    this.setData("timerShootTick", 0);
                }
            }   
        }

    }
    
    onDestroy() {
        this.scene.time.addEvent({ // go to game over scene
            delay: 1000,
            callback: function() {
              this.scene.scene.start("SceneGameOver");
            },
            callbackScope: this,
            loop: false
        });
    }
}

class PlayerLaser extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, "sprLaserPlayer");
      this.body.velocity.y = -200;
    }
}

class EnemyLaser extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, "sprLaserEnemy0");
      this.body.velocity.y = 200;
    }
}

class Heart extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "sprHeart");
        this.body.velocity.y = Phaser.Math.Between(50, 100);
    }
}

class BossShip extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "sprBoss", "BossShip");
        this.setData("blood", 20);
        this.body.velocity.x = 50;
        //this.body.velocity.y = Phaser.Math.Between(50, 100);
        this.shootTimer = this.scene.time.addEvent({
            delay: 1400,
            callback: function() {
                var laser = new EnemyLaser(
                    this.scene,
                    this.x,
                    this.y
                );
                laser.setScale(this.scaleX);
                this.scene.enemyLasers.add(laser);
            },
            callbackScope: this,
            loop: true
        });
        this.play("sprBoss");
    }
    update() {
        console.log("update");
        if(this.body.x > 280) {
            this.body.velocity.x = -50;
        }
        else if(this.body.x < 0) {
            this.body.velocity.x = 50;
        }
    }
    onDestroy() {
        if (this.shootTimer !== undefined) {
            if (this.shootTimer) {
              this.shootTimer.remove(false);
            }
        }
    }
}

class ChaserShip extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "sprEnemy1", "ChaserShip");
        this.body.velocity.y = Phaser.Math.Between(50, 100);
        this.states = {
            MOVE_DOWN: "MOVE_DOWN",
            CHASE: "CHASE"
        };
        this.state = this.states.MOVE_DOWN;
    }
    update() {
        if (!this.getData("isDead") && this.scene.player) {
            if (Phaser.Math.Distance.Between(
                this.x,
                this.y,
                this.scene.player.x,
                this.scene.player.y
            ) < 320) {
                this.state = this.states.CHASE;
            }
            if (this.state == this.states.CHASE) {
                var dx = this.scene.player.x - this.x;
                var dy = this.scene.player.y - this.y;
                var angle = Math.atan2(dy, dx);
                var speed = 100;
                this.body.setVelocity(
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                );
            }
        }
    }
}

class GunShip extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "sprEnemy0", "GunShip");
        this.body.velocity.y = Phaser.Math.Between(50, 100);
        this.shootTimer = this.scene.time.addEvent({
            delay: 1500,
            callback: function() {
                var laser = new EnemyLaser(
                    this.scene,
                    this.x,
                    this.y
                );
                laser.setScale(this.scaleX);
                this.scene.enemyLasers.add(laser);
            },
            callbackScope: this,
            loop: true
        });
        this.play("sprEnemy0");
    }
    onDestroy() {
        if (this.shootTimer !== undefined) {
            if (this.shootTimer) {
              this.shootTimer.remove(false);
            }
        }
    }
}



class CarrierShip extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "sprEnemy2", "CarrierShip");
        this.body.velocity.y = Phaser.Math.Between(50, 100);
        this.play("sprEnemy2");
    }
}

class ScrollingBackground {
    constructor(scene, key, velocityY) {
        this.scene = scene;
        this.key = key;
        this.velocityY = velocityY;
        this.layers = this.scene.add.group();
        this.createLayers();
    }

    createLayers() {
        for (var i = 0; i < 2; i++) {
            // creating two backgrounds will allow a continuous scroll
            var layer = this.scene.add.sprite(0, 0, this.key);
            layer.y = (layer.displayHeight * i);
            var flipX = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            var flipY = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            layer.setScale(flipX * 2, flipY * 2);
            layer.setDepth(-5 - (i - 1));
            this.scene.physics.world.enableBody(layer, 0);
            layer.body.velocity.y = this.velocityY;
            this.layers.add(layer);
        }   
    }

    update() {
        // repeat background
        if (this.layers.getChildren()[0].y > 0) {
            for (var i = 0; i < this.layers.getChildren().length; i++) {
              var layer = this.layers.getChildren()[i];
              layer.y = (-layer.displayHeight) + (layer.displayHeight * i);
            }
        }
    }
}
