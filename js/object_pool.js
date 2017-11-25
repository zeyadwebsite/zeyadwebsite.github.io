/**
 * Object Pool
 * holds bullet objects
 */

function Pool(maxSize) {
  var size = maxSize; // max # of bullets
  var pool = [];      // use an array to model pool

  // Populates pool with bullet objects
  this.init = function(object) {

    if (object == "bullet") {
      for (var i = 0; i < size; i++) {
        // initialize the object
        var bullet = new Bullet("bullet");
        bullet.init(0,0,imageRepository.bullet.width,
                        imageRepository.bullet.height);

        bullet.collidableWith = "enemy";
        bullet.type           = "bullet";
        pool[i]               = bullet;
      }
    }
    else if (object == "enemy") {
      for (var i = 0; i < size; i++) {
        var enemy = new Enemy();
        enemy.init(0,0,imageRepository.enemy.width,
                       imageRepository.enemy.height);
        pool[i] = enemy;
      }
    }
    else if (object == "enemyBullet") {
      for (var i = 0; i < size; i++){
        var bullet = new Bullet("enemyBullet");
        bullet.init(0,0, imageRepository.enemyBullet.width,
                         imageRepository.enemyBullet.height);

        bullet.collidableWith = "ship";
        bullet.type           = "enemyBullet";
        pool[i]               = bullet;
      }
    }
  };

  // Grabs the last item in the list and initializes it,
  // pushes to the front of the array
  this.get = function(x, y, speed) {
    if (!pool[size-1].alive) {
      pool[size-1].spawn(x, y, speed);
      pool.unshift(pool.pop());
    }
  };

  // For ship to be able to get two bullets at once
  this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
    if (!pool[size-1].alive && !pool[size-2].alive) {
      this.get(x1, y1, speed1);
      this.get(x2, y2, speed2);
    }
  };

  // returns all alive objects in the pool as an array
  // (to be inserted into quadtree)
  this.getPool = function() {
    var obj = [];

    for (var i = 0; i < size; i++)
      if (pool[i].alive) obj.push(pool[i]);

    return obj;
  };

  // Draws any bullets currently in use
  this.animate = function() {
    for (var i = 0; i < size; i++) {
      // Only draw until we find a bullet that is not alive
      if (pool[i].alive) {
        if (pool[i].draw()) {
          pool[i].clear();
          pool.push((pool.splice(i,1))[0]);
        }
      }
      else
        break;
    }
  };
}

