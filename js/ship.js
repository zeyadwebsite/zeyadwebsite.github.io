/**
 * Ship
 * ship is drawn on the ship canvas
 * uses dirty rectangles to draw its movement
 */

function Ship() {
  this.speed      = 1;
  this.bulletPool = new Pool(30);
  this.bulletPool.init("bullet");

  var fireRate = 5;
  var counter  = 0;

  this.collidableWith = "enemyBullet";
  this.type           = "ship";

  this.init = function(x, y, width, height) {
    // Defualt variables
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.alive = true;
    this.isColliding = false;
    this.bulletPool.init("bullet");
  }

  this.draw = function() {
    this.context.drawImage(imageRepository.spaceship, this.x, this.y);
  };

  this.move = function() {
    counter++;

    // if a move keystroke is issued
    if (KEY_STATUS.left || KEY_STATUS.right || KEY_STATUS.down || KEY_STATUS.up) {
      // clear ship so it can be redrawn
      this.context.clearRect(this.x, this.y, this.width, this.height);

      // Respond to keystrokes
      if (KEY_STATUS.left) {
        this.x -= this.speed
        if (this.x <= 0) // Keep player within the screen
          this.x = 0;
      } else if (KEY_STATUS.right) {
        this.x += this.speed
        if (this.x >= this.canvasWidth - this.width)
          this.x = this.canvasWidth - this.width;
      } else if (KEY_STATUS.up) {
        this.y -= this.speed
        if (this.y <= 0)
          this.y = 0;
      } else if (KEY_STATUS.down) {
        this.y += this.speed
        if (this.y >= this.canvasHeight - this.height)
          this.y = this.canvasHeight - this.height;
      }

      // Finish by redrawing the ship
      if (!this.isColliding) {
        this.draw();
      } else {
        game.gameOver();
      }
    }

    // Fire with spacebar
    if (KEY_STATUS.space && counter >= fireRate && !this.isColliding) {
      this.fire();
      counter = 0;
    }
  };

  /*
   * Fires two bullets
   */
  this.fire = function() {
    this.bulletPool.getTwo(this.x+6, this.y, 3, this.x+33, this.y, 3);
    game.laser.get();
  };
}

Ship.prototype = new Drawable();
