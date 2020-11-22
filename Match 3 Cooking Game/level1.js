var game;
var fieldSize = 7;
var orbColors = 6;
var orbSize = 50;
var twenty = 20;
//
var swapSpeed = 200;
var fallSpeed = 500;
var destroySpeed = 200;
var fastFall = true;
//
var gameArray = [];
var removeMap = [];
var orbGroup;
var selectedOrb;
var canPick = true;
//
var hand;
var handTween;
//
var foods_get = [];
var foodGroup;
var foodArray = [];
//
var plate1Array = [];
var plate1Group;
var plate2Array = [];
var plate2Group;
var plate3Array = [];
var plate3Group;
//
var countdown_enable = 0;
var countdownBG;
var countdown = 3;
var counter = 0;
var finger_counter = 0;
var pointer;
//
var timeLabel;
var scoreLabel;
var RecipeArray = [0, 0, 0];
var RecipeGroup;
var CharaGroup;

var recipe_answer = [[],[0, 5, 2, 0], [0, 4, 1, 0], [0, 4, 3, 0], [0, 4, 1, 2, 0], [0, 5, 4, 3, 0], [0, 5, 1, 3, 2, 0], [0, 4, 5, 2, 1, 0]];
var score_limit = [[], [100, 200, 250], [120, 200, 300], [120, 200, 300]];
//var star = 0;
var level1State = {
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.global.music.stop();
        game.global.music = game.add.audio('game_bgm');
        game.global.music.loop = true; 
        game.global.music.play();
        game.global.matchsound = game.add.audio('match_sound');
        game.global.deliversound = game.add.audio('deliver');

        game.global.score = 100;
        game.global.time_m = 0;
        game.global.time_s = 0;

        game.add.image(0,0,'background');
        
        game.add.image(20,20,'match_bg');
        game.add.image(387,21, 'wait_bg');
        game.add.image(470, 290, 'plate');
        game.add.image(620, 290, 'plate');
        game.add.image(770, 290, 'plate');
        game.add.image(920, 255, 'trash');
        this.pointer = game.add.image(525, 420, 'pointer');
        

        drawField();
        showSuggestion();
        foodGroup = game.add.group();
        plate1Group = game.add.group();
        plate2Group = game.add.group();
        plate3Group = game.add.group();
        RecipeGroup = game.add.group();
        CharaGroup = game.add.group();
        CharaGroup.setAll('checkWorldBounds', true);
        CharaGroup.setAll('outOfBoundskill', true);
        CharaGroup.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
        CharaGroup.enableBody = true;
        canPick = true;
        
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.time.events.loop(Phaser.Timer.SECOND, updateCountdown, this);
        game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
        game.time.events.loop(Phaser.Timer.SECOND/2, updateFingerCounter, this);
        
        timeLabel = game.add.text(220, 440, 'Time: 0:00', { font: '30px Arial', fill: '#000000' });
        scoreLabel = game.add.text(40, 440, 'Score: 100', { font: '30px Arial', fill: '#000000' });
        this.countdownBG = game.add.image(0,0,'three');
        this.mouse =  game.add.sprite(0, 500, 'Mouse');
        this.mouse.checkWorldBounds = true;
        this.mouse.outOfBoundskill = true;
        game.physics.arcade.enable(this.mouse);
        this.mouse.body.enable = true;
        this.mouse.anchor.setTo(0.5, 0.5);
        this.mouse.scale.setTo(0.5, 0.5);
        this.mouse.body.bounce.x = 1;
        this.mouse.kill();
        game.time.events.loop(20000, this.MouseEvent, this);
    },
    update: function(){
          if(countdown_enable==1) {
               game.input.onDown.add(orbSelect);
               game.input.onUp.add(orbDeselect);
               ShowRecipe();
          }
          if(finger_counter%4 == 0) {
               this.pointer.destroy();
               this.pointer = game.add.image(525, 420, 'pointer');
          }
          else if(finger_counter%4 == 1) {
               this.pointer.destroy();
               this.pointer = game.add.image(675, 420, 'pointer');
          }
          else if(finger_counter%4 == 2) {
               this.pointer.destroy();
               this.pointer = game.add.image(825, 420, 'pointer');
          }
          else if(finger_counter%4 == 3) {
               this.pointer.destroy();
               this.pointer = game.add.image(970, 420, 'pointer');
          }

        if (game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR)) {
            putFoodOnPlate();
        } 
        else if(game.input.keyboard.justReleased(Phaser.Keyboard.ENTER)){
             SendFood();
             cleanPlate();
        }

          if(game.input.keyboard.justReleased(Phaser.Keyboard.UP)) {
               if(game.global.music.volume<=1)game.global.music.volume += 0.1;
               if(game.global.music.volume>=1)game.global.music.volume = 1;
               if(game.global.matchsound.volume<=1)game.global.matchsound.volume += 0.1;
               if(game.global.matchsound.volume>=1)game.global.matchsound.volume = 1;
               if(game.global.deliversound.volume<=1)game.global.deliversound.volume += 0.1;
               if(game.global.deliversound.volume>=1)game.global.deliversound.volume = 1;
          }else if(game.input.keyboard.justReleased(Phaser.Keyboard.DOWN)){
               if(game.global.music.volume>=0)game.global.music.volume -= 0.1;
               if(game.global.music.volume<=0)game.global.music.volume = 0;
               if(game.global.matchsound.volume>=0)game.global.matchsound.volume -= 0.1;
               if(game.global.matchsound.volume<=0)game.global.matchsound.volume = 0;
               if(game.global.deliversound.volume>=0)game.global.deliversound.volume -= 0.1;
               if(game.global.deliversound.volume<=0)game.global.deliversound.volume = 0;
          }
          if((RecipeArray[0] == 0 || RecipeArray[1]==0 || RecipeArray[2] == 0)&&countdown_enable == 1)  ShowRecipe();
    },
    MouseEvent:function(){
        console.log("mouse");
        var choose =  game.rnd.pick([ 0, 0, 0, 1, 2, 3]);
        if(choose == 0) return;
    
        var posx = 400 + choose * 150;
        this.mouse.reset(posx, 500);
        this.mouse.angle += 180;
        this.mouse.body.velocity.y = -30;
        game.time.events.add(3000, function(){
            this.mouse.angle -= 180;
            this.mouse.body.velocity.y = 30;
            switch(choose)
            {
                case 1:
                    if(plate1Array.length == 0) break;
                    var cur = plate1Array.length -1;
                    plate1Array[cur].foodSprite.destroy();
                    plate1Array.pop();
                    break;
                case 2:
                    if(plate2Array.length == 0) break;
                    var cur = plate2Array.length -1;
                    plate2Array[cur].foodSprite.destroy();
                    plate2Array.pop();
                    break;
                
                case 3:
                    if(plate3Array.length == 0) break;
                    var cur = plate3Array.length -1;
                    plate3Array[cur].foodSprite.destroy();
                    plate3Array.pop();
                    break;

            }
            
        }
        , this);
    }
}

window.onkeydown = function(event) {  
     if (event.keyCode == 80){
          game.paused = !game.paused;
          if(game.paused){
               this.pause_pic = game.add.image(0,0,'pause_bg');
               back_label = game.add.text(920, 460, 'Back to menu', {font: '30px Arial', fill: '#000000'});
               back_label.anchor.setTo(0.5, 0.5);
               back_label.inputEnabled = true;
               back_label.events.onInputUp.add(function(){
                    console.log('back');
                    game.paused = false;
                    game.global.music.stop();
                    RecipeArray[0] = 0;
                    RecipeArray[1] = 0;
                    RecipeArray[2] = 0;
                    game.state.start('menu');
               });
          }else{
               if(this.pause_pic)this.pause_pic.kill();
               back_label.destroy();
          }
     }
}

function PopRecipe(chara, recipe){
    game.time.events.add(3000, function(){
        chara.body.velocity.y = 0;
        chara.animations.stop();
        chara.frame = 0
        recipe.visible =true;
    }
    , this);
    
}
function ShowRecipe(){
     console.log('show');
    for(var i = 0; i <3; i++)
    {
        if(RecipeArray[i] == 0)
        {
            var posx = 485 + 195 * i;
            var Type;
            switch(Level)
            {
                case 1:
                    Type = game.rnd.pick([1, 2, 3]);
                    break;
                case 2:
                    Type = game.rnd.pick([1, 2, 3, 4, 5]);
                    break;
                case 3:
                    Type = game.rnd.pick([3, 4, 5, 6, 7]);
                    break;

            }
            var charaType = game.rnd.pick(['rabbit', 'cat', 'dog', 'goat']);
            switch(Type)
            {
                case 1 :
                    var recipe = game.add.image(posx, 20, "recipe1");
                    break;
                case 2 :
                    var recipe = game.add.image(posx, 20, "recipe2");
                    break;
                case 3 :
                    var recipe = game.add.image(posx, 20, "recipe3");
                    break;
                case 4 :
                    var recipe = game.add.image(posx, 20, "recipe4");
                    break;
                case 5 :
                    var recipe = game.add.image(posx, 20, "recipe5");
                    break;
                case 6 :
                    var recipe = game.add.image(posx, 20, "recipe6");
                    break;
                case 7 :
                    var recipe = game.add.image(posx, 20, "recipe7");
                    break;
            }
            
            var chara = game.add.sprite(posx+60, 10, charaType);
            
            CharaGroup.add(chara);
            RecipeGroup.add(recipe);
            chara.body.velocity.y = 50;

            chara.animations.add('walk', [0, 1, 2, 3], 8, true);
            chara.animations.play('walk'); 
            RecipeArray[i] = {RecipeType: Type, RecipeSprite: recipe, Chara: chara};
            RecipeArray[i].RecipeSprite.visible = false;
            PopRecipe(RecipeArray[i].Chara, RecipeArray[i].RecipeSprite);
        }
    }
}

function cleanPlate() {
     if(finger_counter%4 == 0) {
          plate1Group.removeAll(true);
          plate1Array.splice(0, plate1Array.length);

     }
     else if(finger_counter%4 == 1) {
          plate2Group.removeAll(true);
          plate2Array.splice(0, plate2Array.length);
     }
     else if(finger_counter%4 == 2) {
          plate3Group.removeAll(true);
          plate3Array.splice(0, plate3Array.length);
     }
}
function checkAns(plate,recipeNum,ans){
     console.log("score"+game.global.score);
     if(plate.length == ans.length){
          for(var i = 0; i < ans.length; i++)
          {    
               if(plate[i].foodColor != ans[i]) break;
               else if(i == ans.length-1)
               {

                    if(i==3) game.global.score +=50;
                    else if(i==4)game.global.score +=60;
                    else if(i==5) game.global.score +=80;
                    game.global.deliversound.play();
                    //plate.length = 0; 
                    RecipeArray[recipeNum].RecipeSprite.visible = false;
                    RecipeArray[recipeNum].Chara.animations.add('leave', [4, 5, 6, 7], 8, true);
                    RecipeArray[recipeNum].Chara.animations.play('leave'); 
                    RecipeArray[recipeNum].Chara.body.velocity.y = -50;
                    RecipeArray[recipeNum]=0;
                    
                    scoreLabel.text = 'score: '+game.global.score;
                    game.time.events.add(Phaser.Timer.SECOND * 5, ShowRecipe, this);
                    return true;
               }
          }
     }
     return false;
}
function SendFood(){
     var curPlate;
     var flag= false;
     if(finger_counter%4 == 0) {
          curPlate = plate1Array;
     }
     else if(finger_counter%4 == 1) {
          curPlate = plate2Array;
     }
     else if(finger_counter%4 == 2) {
          curPlate = plate3Array;
     }
     else if(finger_counter%4 == 3){
          return;
     }
     for(var i =0; i< 3; i++){
          if(RecipeArray[i]!=0 && flag == false)
          {
               console.log("RT:"+RecipeArray[i].RecipeType);
               flag = checkAns(curPlate,i, recipe_answer[RecipeArray[i].RecipeType]);
          }
     }
     if(flag == false) 
     {
        //game.global.score -=5;
        scoreLabel.text = 'score: '+game.global.score;
     }
}
function updateCountdown() {
     countdown--;
     if(countdown==2) {
          this.countdownBG.destroy();
          this.countdownBG = game.add.image(0, 0, 'two');
     }
     if(countdown==1) {
          this.countdownBG.destroy();
          this.countdownBG = game.add.image(0, 0, 'one');
     }
     if(countdown==0) {
          this.countdownBG.destroy();
          countdown_enable = 1;
     }
}
function updateFingerCounter() {
     if(countdown_enable==1) {
          finger_counter++;
     }
     
}
function updateCounter() {
     if(countdown_enable==1) {
          counter++;
     }
     
     updateTime();
}
function updateTime(){
     game.global.time_m = Math.floor((180-counter)/60);
     game.global.time_s = (180-counter)%60;
     if(game.global.time_m <= 0 && game.global.time_s <= 0)
     {
        game.global.star = 0
        if(game.global.score > score_limit[Level][0]) game.global.star = 1;
        else if(game.global.score > score_limit[Level][1]) game.global.star = 2;
        else if(game.global.score > score_limit[Level][2]) game.global.star = 3;
        console.log('star:'+game.global.star);
        game.state.start('end');
     }
     timeLabel.text = 'Time: '+game.global.time_m +':'+game.global.time_s;
}

function putFoodOnPlate(){
     var foodType = foods_get[0];
     
     if(foodArray.length > 0) {
          if(finger_counter%4 == 0) {
               plate1Array.push(foodType); 
               handleAddFoodToPlate();
               foods_get.shift();		
               handletakefood();	
          }
          else if(finger_counter%4 == 1) {
               plate2Array.push(foodType);
               handleAddFoodToPlate();
               foods_get.shift();		
               handletakefood();	
          }
          else if(finger_counter%4 == 2) {
               plate3Array.push(foodType);
               handleAddFoodToPlate();
               foods_get.shift();		
               handletakefood();	
          }
          else if(finger_counter%4 == 3) {
               foods_get.shift();		
               handletakefood();	
          }
     }
}
function handleAddFoodToPlate() {
     if(finger_counter%4 == 0) {
          var now_position = plate1Array.length - 1;
          var plateX = 550;
     }
     else if(finger_counter%4 == 1) {
          var now_position = plate2Array.length - 1;
          var plateX = 700;
     }
     else if(finger_counter%4 == 2) {
          var now_position = plate3Array.length - 1;
          var plateX = 850;
     }
     var foodType = foods_get[0];
     if(now_position<=7) {
          switch(foodType) {
               case 0:
                    var food = game.add.image(plateX, 340 - (now_position+1)*15, "bread");
                    break;
               case 1:
                    var food = game.add.image(plateX, 340 - (now_position+1)*15, "bacon");
                    break;
               case 2:
                    var food = game.add.image(plateX, 365 - (now_position+1)*15, "tomato");
                    break;
               case 3:
                    var food = game.add.image(plateX, 360 - (now_position+1)*15, "egg");
                     break;
               case 4:
                    var food = game.add.image(plateX, 355 - (now_position+1)*15, "lettuce");
                    break;
               case 5:
                    var food = game.add.image(plateX, 340 - (now_position+1)*15, "cheese");
                    break;
          }
          food.anchor.set(0.5);
          if(finger_counter%4 == 0) {
               plate1Group.add(food);
               food.frame = plate1Array[now_position];
               plate1Array[now_position] = {
                    foodColor: plate1Array[now_position],
                    foodSprite: food
               }
          }
          else if(finger_counter%4 == 1) {
               plate2Group.add(food);
               food.frame = plate2Array[now_position];
               plate2Array[now_position] = {
                    foodColor: plate2Array[now_position],
                    foodSprite: food
               }
          }
          else if(finger_counter%4 == 2) {
               plate3Group.add(food);
               food.frame = plate3Array[now_position];
               plate3Array[now_position] = {
                    foodColor: plate3Array[now_position],
                    foodSprite: food
               }
          }
     }
     
}
function handletakefood(){
     if(foodArray.length == 0)return;
     if(plate1Array.length - 1<=7) {
          foodArray[0].foodSprite.destroy();
          for(var i=1;i<foodArray.length;i++){
               foodArray[i].foodSprite.y = orbSize * (7-i+1) + orbSize / 2 + twenty;
               if(i<=8)foodArray[i].foodSprite.visible = true;
               foodArray[i-1] = foodArray[i];
          }
          foodArray.pop();
     }
     
}
function handleaddfood(){
     var now_position = foods_get.length - 1;
     if(now_position<=7){
          var food = game.add.sprite(390 + orbSize / 2, orbSize * (7-now_position) + orbSize / 2 + twenty, "food");
     }else{
          var food = game.add.sprite(390 + orbSize / 2, 0, "food");
          food.visible = false;
     }
     food.anchor.set(0.5);
     foodGroup.add(food);
     food.frame = foods_get[now_position];
     foodArray[now_position] = {
          foodColor: foods_get[now_position],
          foodSprite: food
     }
};
function drawField(){
    orbGroup = game.add.group();
    for(var i = 0; i < fieldSize; i ++){
         gameArray[i] = [];
         for(var j = 0; j < fieldSize; j ++){
              var orb = game.add.sprite(orbSize * j + orbSize / 2 + twenty, orbSize * i + orbSize / 2 + twenty, "food");
              orb.anchor.set(0.5);
              orbGroup.add(orb);
              do{
                   var randomnum = game.rnd.between(0, orbColors);
                   var randomColor;
                   if(randomnum == 0 || randomnum == orbColors)randomColor = 0;
                   else randomColor = randomnum;
                   //var randomColor = game.rnd.between(0, orbColors - 1);
                   orb.frame = randomColor;
                   gameArray[i][j] = {
                        orbColor: randomColor,
                        orbSprite: orb
                   }
              } while(isMatch(i, j));
         }
    }
    selectedOrb = null;
    hand = game.add.sprite(0, 0, "pointer");
    hand.anchor.set(0.5);
    hand.visible = false;
}
function handvisible(){
    hand.visible = true;
}
function showSuggestion(){
    var matchFound = false;
    for(var i = 0; i < fieldSize - 1; i ++){          
         for(var j = 0; j < fieldSize - 1; j ++){
              tmpSwap(i, j, i + 1, j);
              if(matchInBoard()){
                   //game.time.events.add(4000, handvisible);
                   //hand.visible = true;
                   hand.x = gameArray[i + 1][j].orbSprite.x + 5;
                   hand.y = gameArray[i + 1][j].orbSprite.y + 25;
                   handTween = game.add.tween(hand).to({
                        y: hand.y + 50
                   }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
                   matchFound = true;
              }
              tmpSwap(i, j, i + 1, j);
              if(matchFound){
                   return;
              }   
              tmpSwap(i, j, i, j + 1);
              if(matchInBoard()){
                   //game.time.events.add(4000, handvisible);
                   //hand.visible = true;
                   hand.x = gameArray[i][j + 1].orbSprite.x + 5;
                   hand.y = gameArray[i][j + 1].orbSprite.y + 25;
                   handTween = game.add.tween(hand).to({
                        x: hand.x + 50
                   }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
                   matchFound = true;
              }
              tmpSwap(i, j, i, j + 1);
              if(matchFound){
                   return;
              }     
         }
    } 
    console.log("no match");
    orbGroup.destroy();
    drawField();    
}
function tmpSwap(row1, col1, row2, col2){
    var tmp = gameArray[row1][col1];
    gameArray[row1][col1] = gameArray[row2][col2];
    gameArray[row2][col2] = tmp;     
}

function orbSelect(e){
    if(canPick){
         hand.visible = false;
         handTween.stop();
         var x = e.clientX - twenty;
         var y = e.clientY - twenty;
         var row = Math.floor(y / orbSize);
         var col = Math.floor(x / orbSize);
         console.log(col+","+row);
         var pickedOrb = gemAt(row, col)
         if(pickedOrb != -1){
              if(selectedOrb == null){
                   pickedOrb.orbSprite.scale.setTo(1.2);
                   pickedOrb.orbSprite.bringToTop();
                   selectedOrb = pickedOrb;
                   game.input.addMoveCallback(orbMove);
              }
              else{
                   if(areTheSame(pickedOrb, selectedOrb)){
                        selectedOrb.orbSprite.scale.setTo(1);
                        selectedOrb = null;
                   }
                   else{     
                        if(areNext(pickedOrb, selectedOrb)){
                             selectedOrb.orbSprite.scale.setTo(1);
                             swapOrbs(selectedOrb, pickedOrb, true);
                        }
                        else{
                             selectedOrb.orbSprite.scale.setTo(1);
                             pickedOrb.orbSprite.scale.setTo(1.2); 
                             selectedOrb = pickedOrb;  
                             game.input.addMoveCallback(orbMove);      
                        }
                   }
              }     
         }
    }
}
function orbDeselect(e){
    game.input.deleteMoveCallback(orbMove);     
}

function orbMove(event, pX, pY){
    if(event.id == 0){
         var distX = pX - selectedOrb.orbSprite.x;
         var distY = pY - selectedOrb.orbSprite.y;
         var deltaRow = 0;
         var deltaCol = 0;
         if(Math.abs(distX) > orbSize / 2){
              if(distX > 0){
                   deltaCol = 1;
              }
              else{
                   deltaCol = -1;
              }
         }
         else{
              if(Math.abs(distY) > orbSize / 2){
                   if(distY > 0){
                       deltaRow = 1;
                   }
                   else{
                        deltaRow = -1;
                   }
              }
         }
         if(deltaRow + deltaCol != 0){
              var pickedOrb = gemAt(getOrbRow(selectedOrb) + deltaRow, getOrbCol(selectedOrb) + deltaCol);
              if(pickedOrb != -1){
                   selectedOrb.orbSprite.scale.setTo(1);
                   swapOrbs(selectedOrb, pickedOrb, true);
                   game.input.deleteMoveCallback(orbMove);
              }    
         }
    }
}

function swapOrbs(orb1, orb2, swapBack){ 
    canPick = false;   
    var fromColor = orb1.orbColor;
    var fromSprite = orb1.orbSprite;
    var toColor = orb2.orbColor;
    var toSprite = orb2.orbSprite;
    gameArray[getOrbRow(orb1)][getOrbCol(orb1)].orbColor = toColor;
    gameArray[getOrbRow(orb1)][getOrbCol(orb1)].orbSprite = toSprite;
    gameArray[getOrbRow(orb2)][getOrbCol(orb2)].orbColor = fromColor;
    gameArray[getOrbRow(orb2)][getOrbCol(orb2)].orbSprite = fromSprite;
    var orb1Tween = game.add.tween(gameArray[getOrbRow(orb1)][getOrbCol(orb1)].orbSprite).to({
         x: getOrbCol(orb1) * orbSize + orbSize / 2 + twenty,
         y: getOrbRow(orb1) * orbSize + orbSize / 2 + twenty
    }, swapSpeed, Phaser.Easing.Linear.None, true);     
    var orb2Tween = game.add.tween(gameArray[getOrbRow(orb2)][getOrbCol(orb2)].orbSprite).to({
         x: getOrbCol(orb2) * orbSize + orbSize / 2 + twenty,
         y: getOrbRow(orb2) * orbSize + orbSize / 2 + twenty
    }, swapSpeed, Phaser.Easing.Linear.None, true); 
    orb2Tween.onComplete.add(function(){
         if(!matchInBoard() && swapBack){
              swapOrbs(orb1, orb2, false);          
         }
         else{ 
              if(matchInBoard()){
                   first_flag = true;
                   handleMatches();
              }
              else{        
                   canPick = true;
                   selectedOrb = null;
              }
         }    
    });
}

function areNext(orb1, orb2){
    return Math.abs(getOrbRow(orb1) - getOrbRow(orb2)) + Math.abs(getOrbCol(orb1) - getOrbCol(orb2)) == 1;
}

function areTheSame(orb1, orb2){
    return getOrbRow(orb1) == getOrbRow(orb2) && getOrbCol(orb1) == getOrbCol(orb2);
}

function gemAt(row, col){
    if(row < 0 || row >= fieldSize || col < 0 || col >= fieldSize){
         return -1;
    }
    return gameArray[row][col];
}

function getOrbRow(orb){
    return Math.floor(orb.orbSprite.y / orbSize);
}

function getOrbCol(orb){
    return Math.floor(orb.orbSprite.x / orbSize);
}

function isHorizontalMatch(row, col){
    return gemAt(row, col).orbColor == gemAt(row, col - 1).orbColor && gemAt(row, col).orbColor == gemAt(row, col - 2).orbColor; 
}

function isVerticalMatch(row, col){
    return gemAt(row, col).orbColor == gemAt(row - 1, col).orbColor && gemAt(row, col).orbColor == gemAt(row - 2, col).orbColor; 
}

function isMatch(row, col){
    return isHorizontalMatch(row, col) || isVerticalMatch(row, col);
}

function matchInBoard(){
    for(var i = 0; i < fieldSize; i++){
         for(var j = 0; j < fieldSize; j++){
              if(isMatch(i, j)){
                   return true;
              }
         }
    }
    return false;
}

function handleMatches(){   
    removeMap = []; 
    for(var i = 0; i < fieldSize; i++){
         removeMap[i] = [];
         for(var j = 0; j < fieldSize; j++){
              removeMap[i].push(0);
         }
    }
    handleHorizontalMatches();
    handleVerticalMatches();
    destroyOrbs();
}

function handleVerticalMatches(){
    for(var i = 0; i < fieldSize; i++){
         var colorStreak = 1;
         var currentColor = -1;
         var startStreak = 0;
         for(var j = 0; j < fieldSize; j++){ 
              if(gemAt(j, i).orbColor == currentColor){
                   colorStreak ++;
              }              
              if(gemAt(j, i).orbColor != currentColor || j == fieldSize - 1){
                   if(colorStreak >= 3){
                        //console.log("VERTICAL :: Length = "+colorStreak + " :: Start = ("+startStreak+","+i+") :: Color = "+currentColor);
                        foods_get.push(currentColor);
                         if(first_flag){
                              game.global.score -= 5;
                              scoreLabel.text = 'score: '+game.global.score;
                              first_flag = false;
                         }
                        handleaddfood();
                        console.log(foods_get);
                        console.log(currentColor);
                        console.log(foods_get[0].currentColor);
                        game.global.matchsound.play();
                        for(var k = 0; k < colorStreak; k++){
                             removeMap[startStreak + k][i] ++;
                        }
                   }
                   startStreak = j;
                   colorStreak = 1;
                   currentColor = gemAt(j, i).orbColor;
              }
         }
    }
}

function handleHorizontalMatches(){
    for(var i = 0; i < fieldSize; i++){
         var colorStreak = 1;
         var currentColor = -1;
         var startStreak = 0;
         for(var j = 0; j < fieldSize; j++){ 
              if(gemAt(i, j).orbColor == currentColor){
                   colorStreak ++;
              }              
              if(gemAt(i, j).orbColor != currentColor || j == fieldSize - 1){
                   if(colorStreak >= 3){
                        //console.log("HORIZONTAL :: Length = "+colorStreak + " :: Start = ("+i+","+startStreak+") :: Color = "+currentColor);
                        foods_get.push(currentColor);
                        handleaddfood();
                        console.log(foods_get);
                        console.log(currentColor);
                        if(first_flag){
                              game.global.score -= 5;
                              scoreLabel.text = 'score: '+game.global.score;
                              first_flag = false;
                         }
                        game.global.matchsound.play();
                        for(var k = 0; k < colorStreak; k++){
                             removeMap[i][startStreak + k] ++;
                        }
                   }
                   startStreak = j;
                   colorStreak = 1;
                   currentColor = gemAt(i, j).orbColor;
              }
         }
    }
}

function destroyOrbs(){
    var destroyed = 0;
    for(var i = 0; i < fieldSize; i++){
         for(var j = 0; j < fieldSize; j++){
              if(removeMap[i][j]>0){
                   var destroyTween = game.add.tween(gameArray[i][j].orbSprite).to({
                        alpha: 0
                   }, destroySpeed, Phaser.Easing.Linear.None, true);
                   destroyed ++;
                   destroyTween.onComplete.add(function(orb){
                        orb.destroy();
                        destroyed --;
                        if(destroyed == 0){
                             makeOrbsFall();
                             if(fastFall){
                                  replenishField();
                             }    
                        }
                   });
                   gameArray[i][j] = null;  
              }
         }
    }
}

function makeOrbsFall(){
    var fallen = 0;
    var restart = false;
    for(var i = fieldSize - 2; i >= 0; i--){
         for(var j = 0; j < fieldSize; j++){
              if(gameArray[i][j] != null){
                   var fallTiles = holesBelow(i, j);
                   if(fallTiles > 0){
                        if(!fastFall && fallTiles > 1){
                             fallTiles = 1;
                             restart = true;                             
                        }
                        var orb2Tween = game.add.tween(gameArray[i][j].orbSprite).to({
                             y: gameArray[i][j].orbSprite.y + fallTiles * orbSize
                        }, fallSpeed, Phaser.Easing.Linear.None, true); 
                        fallen ++;
                        orb2Tween.onComplete.add(function(){
                             fallen --;
                             if(fallen == 0){
                                  if(restart){
                                       makeOrbsFall();
                                  }
                                  else{
                                       if(!fastFall){
                                            replenishField();
                                       }
                                  }      
                             }
                        })
                        gameArray[i + fallTiles][j] = {
                             orbSprite: gameArray[i][j].orbSprite,
                             orbColor: gameArray[i][j].orbColor     
                        }
                        gameArray[i][j] = null;
                   }
              }
         }
    }
    if(fallen == 0){
         replenishField();     
    }
}

function replenishField(){
    var replenished = 0;
    var restart = false;
    for(var j = 0; j < fieldSize; j++){
         var emptySpots = holesInCol(j);
         if(emptySpots > 0){
              if(!fastFall && emptySpots > 1){
                   emptySpots = 1;
                   restart = true;   
              }
              for(i = 0; i < emptySpots; i++){
                   var orb = game.add.sprite(orbSize * j + orbSize / 2 + twenty, - (orbSize * (emptySpots - 1 - i) + orbSize / 2 + twenty), "food");
                   orb.anchor.set(0.5);
                   orbGroup.add(orb);
                   var randomnum = game.rnd.between(0, orbColors);
                   var randomColor;
                   if(randomnum == 0 || randomnum == orbColors)randomColor = 0;
                   else randomColor = randomnum;
                   //var randomColor = game.rnd.between(0, orbColors - 1);
                   orb.frame = randomColor;
                   gameArray[i][j] = {
                        orbColor: randomColor,
                        orbSprite: orb
                   }
                   var orb2Tween = game.add.tween(gameArray[i][j].orbSprite).to({
                        y: orbSize * i + orbSize / 2 + twenty
                   }, fallSpeed, Phaser.Easing.Linear.None, true);
                   replenished ++;  
                   orb2Tween.onComplete.add(function(){
                        replenished --;
                        if(replenished == 0){
                             if(restart){
                                  makeOrbsFall();
                             }
                             else{
                                  if(matchInBoard()){
                                       game.time.events.add(250, handleMatches);
                                  }
                                  else{
                                       canPick = true;
                                       selectedOrb = null;
                                       showSuggestion();
                                  }  
                             }
                        }
                   }) 
              }
         }
    }
}

function holesBelow(row, col){
    var result = 0;
    for(var i = row + 1; i < fieldSize; i++){
         if(gameArray[i][col] == null){
              result ++;          
         }
    }
    return result;
}

function holesInCol(col){
    var result = 0;
    for(var i = 0; i < fieldSize; i++){
         if(gameArray[i][col] == null){
              result ++;          
         }
    }
    return result;     
}