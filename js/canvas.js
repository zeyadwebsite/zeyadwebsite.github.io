/**
 * imageRepository
 * singleton object to hold all game images
 * (images are drawn only once)
 */
var imageRepository = new function (){
  // Images
  this.background  = new Image();
  this.spaceship   = new Image();
  this.bullet      = new Image();
  this.enemy       = new Image();
  this.enemyBullet = new Image();

  // Ensure all images have loaded before starting game
  var numImages = 5;
  var numLoaded = 0;

  function imageLoaded() {
    numLoaded++;
    if (numLoaded === numImages)
      window.init();
  }
  this.background.onload  = function() { imageLoaded(); }
  this.spaceship.onload   = function() { imageLoaded(); }
  this.bullet.onload      = function() { imageLoaded(); }
  this.enemy.onload       = function() { imageLoaded(); }
  this.enemyBullet.onload = function() { imageLoaded(); }

  // Set sources for images
  this.background.src  = "images/bg.png";
  this.spaceship.src   = "images/ship.png";
  this.bullet.src      = "images/bullet.png";
  this.enemy.src       = "images/enemy.png";
  this.enemyBullet.src = "images/bullet_enemy.png";
}

/**
 * Drawable
 * abstract object for drawable elements
 * (base class from which all drawable objects inherit)
 */
function Drawable () {
  this.init = function(x, y, width, height) {
  // set object's position when created
    this.x      = x;
    this.y      = y;
    this.width  = width
    this.height = height
  }

  // class variables
  this.speed          = 0;
  this.canvasWidth    = 0;
  this.canvasHeight   = 0;
  this.collidableWith = "";
  this.isColliding    = false;
  this.type           = "";

  // Drawable.draw, to be implemented in child objects
  this.draw = function() {};
  this.move = function() {};
  this.isCollidableWith = function(object) {
    return (this.collidableWith === object.type);
  };
}

/**
 * Background
 * inherits from Drawable
 * creates illusion of moving by padding the image
 */
function Background () {
  this.speed = 0.5; // redefined for panning

  this.draw = function() {
    // pan background
    this.y += this.speed;
    this.context.drawImage(imageRepository.background, this.x, this.y);

    // draw info box at top edge
    var infoBoxY = this.y - this.canvasHeight;
    this.context.drawImage(imageRepository.background, this.x, infoBoxY);

    // reset if image scrolls off screen
    if (this.y >= this.canvasHeight){
      this.y = 0;
    }
  };
}

// Background inherits from Drawable (may need to revise this)
Background.prototype = new Drawable();

