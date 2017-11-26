/**
 * Game
 * holds all objects and data for the game
 */

 /**
  * Initialize the Game and starts it.
  */
 var game = new Game();

 function init() {
   game.init();
 }


function Game () {
/**
  * init
  * return: true if canvas is supported, else false
  * (stops animation script from running on incompatible browser)
  */
  this.init = function () {
    this.playerScore = 0;

    // get canvases
    this.bgCanvas      = document.getElementById('background');
    this.shipCanvas    = document.getElementById('ship');
    this.mainCanvas    = document.getElementById('main');
    this.restartButton = document.getElementById('restart-button');

    // restart game when clicking 'restart' link
    this.restartButton.onclick = function(){
      game.restart();
    }

    // allow restarting from the modal with spacebar or carriage return
    document.addEventListener('keydown', function(e){
      var endGameModal = document.getElementById('game-over');
      var gameOverModalIsVisible = endGameModal.style.display == 'block';

      if (gameOverModalIsVisible && (e.which === 32 || e.which === 13)) {
        game.restart();
      }
    });

    // if canvas supported...
    if (this.bgCanvas.getContext) {
      this.bgContext   = this.bgCanvas.getContext('2d');
      this.shipContext = this.shipCanvas.getContext('2d');
      this.mainContext = this.mainCanvas.getContext('2d');

      // ...initialize their attributes...
      Background.prototype.context      = this.bgContext;
      Background.prototype.canvasWidth  = this.bgCanvas.width;
      Background.prototype.canvasHeight = this.bgCanvas.height;

      Ship.prototype.context        = this.shipContext;
      Ship.prototype.canvasWidth    = this.shipCanvas.width;
      Ship.prototype.canvasHeight   = this.shipCanvas.height;

      Bullet.prototype.context      = this.mainContext;
      Bullet.prototype.canvasWidth  = this.mainCanvas.width;
      Bullet.prototype.canvasHeight = this.mainCanvas.height;

      Enemy.prototype.context       = this.mainContext;
      Enemy.prototype.canvasWidth   = this.mainCanvas.width;
      Enemy.prototype.canvasHeight  = this.mainCanvas.height;

      //...and the background object
      this.background = new Background();
      this.background.init(0,0);

      // ...and the ship object
      this.ship = new Ship();

      // ..and start the ship at the bottom center
      var shipStartX = this.shipCanvas.width/2 - imageRepository.spaceship.width;
      var shipStartY = this.shipCanvas.height/4*3 + imageRepository.spaceship.height*2;

      this.ship.init(shipStartX,
        shipStartY,
        imageRepository.spaceship.width,
        imageRepository.spaceship.height
      );

      // initialize the enemy object pool
      this.enemyPool = new Pool(30);
      this.enemyPool.init("enemy");
      this.spawnWave();

      var height = imageRepository.enemy.height;
      var width  = imageRepository.enemy.width;
      var x      = 100;
      var y      = -height;
      var spacer = y * 1.5;

      for (var i = 1; i <= 18; i++) {
        this.enemyPool.get(x,y,2);
        x += width + 25;

        if (i % 6 == 0) {
          x = 100;
          y += spacer
        }
      }

      this.enemyBulletPool = new Pool(50);
      this.enemyBulletPool.init("enemyBullet");

      // start quadTree
      this.quadTree = new QuadTree({
        x:      0,
        y:      0,
        width:  this.mainCanvas.width,
        height: this.mainCanvas.height
      });

      // initialize audio
      this.laser = new SoundPool(10);
      this.laser.init("laser");

      this.explosion = new SoundPool(20);
      this.explosion.init("explosion");

      this.backgroundAudio        = new Audio("sounds/kick_shock.mp3");
      this.backgroundAudio.loop   = true;
      this.backgroundAudio.volume = .25;
      this.backgroundAudio.load();

      this.gameOverAudio        = new Audio("sounds/game_over.mp3");
      this.gameOverAudio.loop   = true;
      this.gameOverAudio.volume = .25;
      this.gameOverAudio.load();

      this.checkAudio = window.setInterval(checkReadyState, 1000);

      return true;
    } else {
      return false;
    }
  };

  // spawns a new wave of enemies
  this.spawnWave = function() {
    var height = imageRepository.enemy.height;
    var width  = imageRepository.enemy.width;
    var x = 100;
    var y = -height;
    var spacer = y * 1.5;

    for (var i = 0; i <= 18; i++) {
      this.enemyPool.get(x,y,2);
      x += width + 25;

      if (i % 6 == 0) {
        x = 100;
        y += spacer;
      }
    }
  };

  // Start the animation loop
  this.start = function() {
    this.ship.draw();
    this.backgroundAudio.play();
    animate();
  };

  // Game over
  this.gameOver = function() {
    this.backgroundAudio.pause();
    this.gameOverAudio.currentTime = 0;
    this.gameOverAudio.play();
    document.getElementById('game-over').style.display = "block";
  };

  // Restart the game
  this.restart = function() {
    this.gameOverAudio.pause();

    document.getElementById('game-over').style.display = "none";
    this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    this.shipContext.clearRect(0, 0, this.shipCanvas.width, this.shipCanvas.height);
    this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

    this.quadTree.clear();

    this.background.init(0,0);

    var shipStartX = this.shipCanvas.width/2 - imageRepository.spaceship.width;
    var shipStartY = this.shipCanvas.height/4*3 + imageRepository.spaceship.height*2;

    this.ship.init(shipStartX, shipStartY,
                   imageRepository.spaceship.width,
                   imageRepository.spaceship.height);

    this.enemyPool.init("enemy");
    this.spawnWave();
    this.enemyBulletPool.init("enemyBullet");

    this.playerScore = 0;

    this.backgroundAudio.currentTime = 0;

    this.ship.draw();
    this.backgroundAudio.play();
  };

} // Game

/**
 * animate
 * calls the requestAnimationFrame shim to optimize
 * game loop and draws all game objects. (globallly defined)
 */
function animate () {
  document.getElementById('score').innerHTML = game.playerScore;

  // Insert objects into quadtree
  game.quadTree.clear();
  game.quadTree.insert(game.ship);
  game.quadTree.insert(game.ship.bulletPool.getPool());
  game.quadTree.insert(game.enemyPool.getPool());
  game.quadTree.insert(game.enemyBulletPool.getPool());

  detectCollision();

  // respawn if no more enemies
  if (game.enemyPool.getPool().length === 0) {
    game.spawnWave();
  }

  // Animate game objects if game not over yet
  if (game.ship.alive) {
    requestAnimFrame(animate);

    game.background.draw();
    game.ship.move();
    game.ship.bulletPool.animate();
    game.enemyPool.animate();
    game.enemyBulletPool.animate();
  }
}

function detectCollision() {
  var objects = [];
  game.quadTree.getAllObjects(objects);

  for (var x = 0, len = objects.length; x < len; x++) {
    game.quadTree.findObjects(obj = [], objects[x]);

    for (y = 0, length = obj.length; y < length; y++) {

      // collision detection
      if (objects[x].collidableWith === obj[y].type &&
           (objects[x].x < obj[y].x + obj[y].width      &&
            objects[x].x + objects[x].width  > obj[y].x &&
            objects[x].y < obj[y].y + obj[y].height     &&
            objects[x].y + objects[x].height > obj[y].y)) {
        objects[x].isColliding = true;
        obj[y].isColliding     = true;
      }
    }
  }
};

/**
 * requestAnim shim layer by Paul Irish
 * finds the first API that works to optimize the
 * animation loop, otherwise defaults to setTimeout()
 */
window.requestAnimFrame = (function(){
  // return window.requestAnimationFrame  ||
  //   window.webkitRequestAnimationFrame ||
  //   window.mozRequestAnimationFrame    ||
  //   window.oRequestAnimationFrame      ||
  //   window.msRequestAnimationFrame     ||
    return function(callback){
      window.setTimeout(callback, 1000 / 100);
    };
})();

// checks to see if game sounds has completed loading before starting the game
function checkReadyState() {
  if (game.gameOverAudio.readyState === 4 && game.backgroundAudio.readyState === 4) {
    window.clearInterval(game.checkAudio);
    game.start();
  }
}
