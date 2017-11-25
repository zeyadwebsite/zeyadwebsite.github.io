/**
 * Bullet
 * creates bullet object to be drawn on main canvas
 */

function Bullet(object) {
  this.alive = false; // Is true if bullet is currently in use
  var self   = object;

  // sets bullet values
  this.spawn = function(x, y, speed) {
    this.x     = x;
    this.y     = y;
    this.speed = speed;
    this.alive = true;
  };

  /**
   * Uses a 'dirty rectangle' to erase the bullet and moves it
   * returns true if bullet posn is off-screen (ie ready to be cleared by pool)
   * otherwise draws the bullet
   */
  this.draw = function() {
    this.context.clearRect(this.x-1, this.y-1, this.width+2, this.height+2);
    this.y -= this.speed;

    if (this.isColliding) {
      return true;
    }
    else if (self === "bullet" && this.y <= 0 - this.height) {
      return true;
    }
    else if (self === "enemyBullet" && this.y >= this.canvasHeight) {
      return true;
    }
    else {
      if (self === "bullet") {
        this.context.drawImage(imageRepository.bullet, this.x, this.y);
      }
      else if (self === "enemyBullet") {
        this.context.drawImage(imageRepository.enemyBullet, this.x, this.y);
      }
      return false;
    }
  };

  // Reset the bullet values
  this.clear = function() {
    this.x           = 0;
    this.y           = 0;
    this.speed       = 0;
    this.alive       = false;
    this.isColliding = false;
  };
}

Bullet.prototype = new Drawable();


