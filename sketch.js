var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudImage;

var obs1Image, obs2Image, obs3Image, obs4Image, obs5Image, obs6Image;

var score = 0;

var PLAY = 1;

var END = 0;

var gameState = PLAY;

var gameOverImage, gameOver;

var restart, restartImage;

var jumpSound, dieSound, chckpointSound;

var highScore = 0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  
  trex_collided = loadAnimation("trex_collided.png");
  
  restartImage = loadImage("restart.png");
  
  gameOverImage = loadImage("gameOver.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obs1Image = loadImage("obstacle1.png");
  obs2Image = loadImage("obstacle2.png");
  obs3Image = loadImage("obstacle3.png");
  obs4Image = loadImage("obstacle4.png");
  obs5Image = loadImage("obstacle5.png");
  obs6Image = loadImage("obstacle6.png");
  
  jumpSound = loadSound("jump.mp3");
  
  dieSound = loadSound("die.mp3");
  
  chckpointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  var n = "hello";
  
  //console.log(n);

  trex = createSprite(50,height-230,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage("game_Over", gameOverImage);
  
  restart = createSprite(width/2,height*2/3);
  restart.addImage("restart", restartImage);
  restart.scale = 0.5;
  
  ground = createSprite(width+200,height-80,400,20);
  ground.addImage("ground",groundImage);
  ground.scale = 1.5;
  
  invisibleGround = createSprite(200,height-70,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  trex.setCollider("circle", 0, 0, 50);
  //trex.debug = true;
  
  //console.log(2+"Hi Raghav!");
}

function draw() {
  background(180);
  
  textSize(15);
  
  if(gameState === PLAY) {
    score = score+Math.round(getFrameRate()/60);
    
    ground.velocityX = -(3*score/100+4.5);
    
    text('Score '+score,width-120,20);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if(keyDown("space")&& trex.y >= height-120) {
      trex.velocityY = -10;
      jumpSound.play();
    }
    
    if(score%100 === 0 && score > 0) {
      chckpointSound.play();
    }
  
  
    trex.velocityY = trex.velocityY + 0.8
    
    spawnClouds();
    
    spawnObstacles();
    
    gameOver.visible = false;
    
    restart.visible = false;
    
    if(obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }

  }
  
  else if(gameState === END) {
    var tempHiSc = score;
    
    ground.velocityX = 0;
    
    text('Score '+score,width-120,20);
    
    
    if(highScore < tempHiSc) {
      highScore = tempHiSc;
    }
    
    obstaclesGroup.setVelocityXEach(0);
    
    cloudsGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    
    cloudsGroup.setLifetimeEach(-1);
    
    trex.changeAnimation("collided",trex_collided);
    
    trex.velocityY = 0;
    
    gameOver.visible = true;
    
    restart.visible = true;
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  text("High score: "+highScore, width-250, 20);

  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(width,height-300,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(height-300,height-450));
    cloud.scale = 0.4;
    cloud.velocityX = -4;
    
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var num = Math.round(random(1,5));
    
    var obstacle = createSprite(width,height-90,10,40);
    obstacle.velocityX = -(3*score/100+5);
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    switch(num) {
      case 1: obstacle.addImage(obs1Image);
      break;
      case 2: obstacle.addImage(obs2Image);
      break;
      case 3: obstacle.addImage(obs3Image);
      break;
      case 4: obstacle.addImage(obs4Image);
      break;
      case 5: obstacle.addImage(obs5Image);
      break;
      default: break;
    }
    
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  
  gameOver.visible = false;
    
  restart.visible = false; 
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
}