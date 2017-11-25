/**
 * Quadtree
 * quadrants from 0 to 3 in cartesian order:
 *  1 | 0
 * ---+---
 *  2 | 3
 */

function QuadTree(boundBox, lvl) {
  var maxObjects = 10;
  this.bounds    = boundBox || { x: 0, y: 0, width: 0, height: 0 };
  var objects    = [];
  this.nodes     = [];
  var level      = lvl || 0;
  var maxLevels  = 5;

  // clears the quad-tree of all nodes of objects
  this.clear = function() {
    objects = [];

    for (var i = 0; i < this.nodes.length; i++){
      this.nodes[i].clear();
    }

    this.nodes = [];
  }; // clear

  // get all objects in the quadTree
  this.getAllObjects = function(returnedObjects) {
    for (var i = 0; i < this.nodes.length; i++){
      this.nodes[i].getAllObjects(returnedObjects);
    }

    for (var i = 0, len = objects.length; i < len; i++){
      returnedObjects.push(objects[i]);
    }

    return returnedObjects;
  }; // getAllObjects

  // return all objects that the object could collide with
  this.findObjects = function(returnedObjects, obj){
    if (typeof obj === "undefined") {
      console.log("UNDEFINED OBJECT");
      return;
    }

    var index = this.getIndex(obj);

    if (index != -1 && this.nodes.length)
      this.nodes[index].findObjects(returnedObjects, obj);

    for (var i = 0, len = objects.length; i < len; i++){
      returnedObjects.push(objects[i]);
    }

    return returnedObjects;
  }; // findObjects

  // insert object into quadtree
  this.insert = function(obj) {
    if (typeof obj === "undefined"){
      return;
    }

    if (obj instanceof Array){
      for (var i = 0, len = obj.length; i < len; i++){
        this.insert(obj[i]);
      }
      return;
    }

    if (this.nodes.length) {
      var index = this.getIndex(obj);

      // only add to a subnode
      if (index != -1) {
        this.nodes[index].insert(obj);
        return;
      }
    }

    objects.push(obj);

    // prevent infinite splitting
    if (objects.length > maxObjects && level < maxLevels) {
      if (this.nodes[0] == null)
        this.split();

      var i = 0;
      while (i < objects.length) {
        var index = this.getIndex(objects[i]);

        if (index != -1) {
          this.nodes[index].insert((objects.splice(i,1))[0]);
        }
        else {
          i++;
        }
      }
    }
  }; // insert

  // Determine which node the object belongs to
  // -1 means it can't fit within a node and is part of the current node
  this.getIndex = function(obj) {
    var index = -1;
    var verticalMidpoint   = this.bounds.x + this.bounds.width / 2;
    var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

    // Object can fit completely within the top quadrant
    var topQuadrant    = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);

    // Object can fit completely within the bottom quandrant
    var bottomQuadrant = (obj.y > horizontalMidpoint);

    // Object can fit completely within the left quadrants
    if (obj.x < verticalMidpoint &&
        obj.x + obj.width < verticalMidpoint) {
      if (topQuadrant) {
        index = 1;
      }
      else if (bottomQuadrant) {
        index = 2;
      }
    }
    // Object can fix completely within the right quandrants
    else if (obj.x > verticalMidpoint) {
      if (topQuadrant) {
        index = 0;
      }
      else if (bottomQuadrant) {
        index = 3;
      }
    }

    return index;
  };

  // splits the node into 4 subnodes

  this.split = function() {
    // bitwise `or`
    var subWidth  = (this.bounds.width / 2) | 0;
    var subHeight = (this.bounds.height / 2) | 0;

    this.nodes[0] = new QuadTree({
      x: this.bounds.x + subWidth,
      y: this.bounds.y,
      width: subWidth,
      height: subHeight
      }, level+1
    );

    this.nodes[1] = new QuadTree({
      x: this.bounds.x,
      y: this.bounds.y,
      width: subWidth,
      height: subHeight
      }, level+1
    );

    this.nodes[2] = new QuadTree({
      x: this.bounds.x,
      y: this.bounds.y + subHeight,
      width: subWidth,
      height: subHeight
      }, level+1
    );

    this.nodes[3] = new QuadTree({
      x: this.bounds.x + subWidth,
      y: this.bounds.y + subHeight,
      width: subWidth,
      height: subHeight
      }, level+1
    );
  }; // split

} // quadtree