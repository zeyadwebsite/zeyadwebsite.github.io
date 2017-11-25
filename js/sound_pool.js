/**
 * SoundPool
 * an object pool for sound effect objects
 */

function SoundPool (maxSize) {
  var size      = maxSize;  // max number of sounds allowed in pool
  var pool      = [];
  this.pool     = pool;
  var currSound = 0;

  // Populates the pool array with the given sound
  this.init = function(object) {
    if (object == "laser") {
      for (var i = 0; i < size; i++) {
        laser = new Audio("sounds/laser.mp3");
        laser.volume = .12;
        laser.load();
        pool[i] = laser;
      }
    }
    else if (object == "explosion") {
      for (var i = 0; i < size; i++) {
        var explosion = new Audio("sounds/explosion.mp3");
        explosion.volume = 0.1;
        explosion.load();
        pool[i] = explosion;
      }
    }
  };

  // Play a sound
  this.get = function(){
    if (pool[currSound].currentTime == 0 || pool[currSound].ended) {
      pool[currSound].play();
    }
    currSound = (currSound + 1) % size;
  };
}
