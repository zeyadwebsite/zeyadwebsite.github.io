function Bullet(a){this.alive=!1;this.spawn=function(a,c,d){this.x=a;this.y=c;this.speed=d;this.alive=!0};this.draw=function(){this.context.clearRect(this.x-1,this.y-1,this.width+2,this.height+2);this.y-=this.speed;if(this.isColliding||"bullet"===a&&this.y<=0-this.height||"enemyBullet"===a&&this.y>=this.canvasHeight)return!0;"bullet"===a?this.context.drawImage(imageRepository.bullet,this.x,this.y):"enemyBullet"===a&&this.context.drawImage(imageRepository.enemyBullet,this.x,this.y);return!1};this.clear=
function(){this.speed=this.y=this.x=0;this.isColliding=this.alive=!1}}Bullet.prototype=new Drawable;var imageRepository=new function(){function a(){b++;5===b&&window.init()}this.background=new Image;this.spaceship=new Image;this.bullet=new Image;this.enemy=new Image;this.enemyBullet=new Image;var b=0;this.background.onload=function(){a()};this.spaceship.onload=function(){a()};this.bullet.onload=function(){a()};this.enemy.onload=function(){a()};this.enemyBullet.onload=function(){a()};this.background.src="images/bg.png";this.spaceship.src="images/ship.png";this.bullet.src="images/bullet.png";this.enemy.src=
"images/enemy.png";this.enemyBullet.src="images/bullet_enemy.png"};function Drawable(){this.init=function(a,b,c,d){this.x=a;this.y=b;this.width=c;this.height=d};this.canvasHeight=this.canvasWidth=this.speed=0;this.collidableWith="";this.isColliding=!1;this.type="";this.draw=function(){};this.move=function(){};this.isCollidableWith=function(a){return this.collidableWith===a.type}}
function Background(){this.speed=1;this.draw=function(){this.y+=this.speed;this.context.drawImage(imageRepository.background,this.x,this.y);this.context.drawImage(imageRepository.background,this.x,this.y-this.canvasHeight);this.y>=this.canvasHeight&&(this.y=0)}}Background.prototype=new Drawable;function Enemy(){var a=0;this.alive=!1;this.collidableWith="bullet";this.type="enemy";this.spawn=function(a,c,d){this.x=a;this.y=c;this.speed=d;this.speedX=0;this.speedY=d;this.alive=!0;this.leftEdge=this.x-90;this.rightEdge=this.x+90;this.bottomEdge=this.y+180};this.draw=function(){this.context.clearRect(this.x-1,this.y,this.width+1,this.height);this.x+=this.speedX;this.y+=this.speedY;this.x<=this.leftEdge?this.speedX=this.speed:this.x>=this.rightEdge+this.width?this.speedX=-this.speed:this.y>=this.bottomEdge&&
(this.speed=1.5,this.speedY=0,this.y-=5,this.speedX=-this.speed);if(this.isColliding)return game.playerScore+=10,game.explosion.get(),!0;this.context.drawImage(imageRepository.enemy,this.x,this.y);a=Math.floor(101*Math.random());.01>a/100&&this.fire();return!1};this.fire=function(){game.enemyBulletPool.get(this.x+this.width/2,this.y+this.height,-2.5)};this.clear=function(){this.speedY=this.speedX=this.speed=this.y=this.x=0;this.isColliding=this.alive=!1}}Enemy.prototype=new Drawable;var game=new Game;function init(){game.init()}
function Game(){this.init=function(){this.playerScore=0;this.bgCanvas=document.getElementById("background");this.shipCanvas=document.getElementById("ship");this.mainCanvas=document.getElementById("main");this.restartButton=document.getElementById("restart-button");this.restartButton.onclick=function(){game.restart()};document.addEventListener("keydown",function(a){"block"!=document.getElementById("game-over").style.display||32!==a.which&&13!==a.which||game.restart()});if(this.bgCanvas.getContext){this.bgContext=
this.bgCanvas.getContext("2d");this.shipContext=this.shipCanvas.getContext("2d");this.mainContext=this.mainCanvas.getContext("2d");Background.prototype.context=this.bgContext;Background.prototype.canvasWidth=this.bgCanvas.width;Background.prototype.canvasHeight=this.bgCanvas.height;Ship.prototype.context=this.shipContext;Ship.prototype.canvasWidth=this.shipCanvas.width;Ship.prototype.canvasHeight=this.shipCanvas.height;Bullet.prototype.context=this.mainContext;Bullet.prototype.canvasWidth=this.mainCanvas.width;
Bullet.prototype.canvasHeight=this.mainCanvas.height;Enemy.prototype.context=this.mainContext;Enemy.prototype.canvasWidth=this.mainCanvas.width;Enemy.prototype.canvasHeight=this.mainCanvas.height;this.background=new Background;this.background.init(0,0);this.ship=new Ship;this.ship.init(this.shipCanvas.width/2-imageRepository.spaceship.width,this.shipCanvas.height/4*3+2*imageRepository.spaceship.height,imageRepository.spaceship.width,imageRepository.spaceship.height);this.enemyPool=new Pool(30);this.enemyPool.init("enemy");
this.spawnWave();for(var a=imageRepository.enemy.width,b=100,c=-imageRepository.enemy.height,d=1.5*c,e=1;18>=e;e++)this.enemyPool.get(b,c,2),b+=a+25,0==e%6&&(b=100,c+=d);this.enemyBulletPool=new Pool(50);this.enemyBulletPool.init("enemyBullet");this.quadTree=new QuadTree({x:0,y:0,width:this.mainCanvas.width,height:this.mainCanvas.height});this.laser=new SoundPool(10);this.laser.init("laser");this.explosion=new SoundPool(20);this.explosion.init("explosion");this.backgroundAudio=new Audio("sounds/kick_shock.mp3");
this.backgroundAudio.loop=!0;this.backgroundAudio.volume=.25;this.backgroundAudio.load();this.gameOverAudio=new Audio("sounds/game_over.mp3");this.gameOverAudio.loop=!0;this.gameOverAudio.volume=.25;this.gameOverAudio.load();this.checkAudio=window.setInterval(checkReadyState,1E3);return!0}return!1};this.spawnWave=function(){for(var a=imageRepository.enemy.width,b=100,c=-imageRepository.enemy.height,d=1.5*c,e=0;18>=e;e++)this.enemyPool.get(b,c,2),b+=a+25,0==e%6&&(b=100,c+=d)};this.start=function(){this.ship.draw();
this.backgroundAudio.play();animate()};this.gameOver=function(){this.backgroundAudio.pause();this.gameOverAudio.currentTime=0;this.gameOverAudio.play();document.getElementById("game-over").style.display="block"};this.restart=function(){this.gameOverAudio.pause();document.getElementById("game-over").style.display="none";this.bgContext.clearRect(0,0,this.bgCanvas.width,this.bgCanvas.height);this.shipContext.clearRect(0,0,this.shipCanvas.width,this.shipCanvas.height);this.mainContext.clearRect(0,0,this.mainCanvas.width,
this.mainCanvas.height);this.quadTree.clear();this.background.init(0,0);this.ship.init(this.shipCanvas.width/2-imageRepository.spaceship.width,this.shipCanvas.height/4*3+2*imageRepository.spaceship.height,imageRepository.spaceship.width,imageRepository.spaceship.height);this.enemyPool.init("enemy");this.spawnWave();this.enemyBulletPool.init("enemyBullet");this.playerScore=0;this.backgroundAudio.currentTime=0;this.ship.draw();this.backgroundAudio.play()}}
function animate(){document.getElementById("score").innerHTML=game.playerScore;game.quadTree.clear();game.quadTree.insert(game.ship);game.quadTree.insert(game.ship.bulletPool.getPool());game.quadTree.insert(game.enemyPool.getPool());game.quadTree.insert(game.enemyBulletPool.getPool());detectCollision();0===game.enemyPool.getPool().length&&game.spawnWave();game.ship.alive&&(requestAnimFrame(animate),game.background.draw(),game.ship.move(),game.ship.bulletPool.animate(),game.enemyPool.animate(),game.enemyBulletPool.animate())}
function detectCollision(){var a=[];game.quadTree.getAllObjects(a);for(var b=0,c=a.length;b<c;b++)for(game.quadTree.findObjects(obj=[],a[b]),y=0,length=obj.length;y<length;y++)a[b].collidableWith===obj[y].type&&a[b].x<obj[y].x+obj[y].width&&a[b].x+a[b].width>obj[y].x&&a[b].y<obj[y].y+obj[y].height&&a[b].y+a[b].height>obj[y].y&&(a[b].isColliding=!0,obj[y].isColliding=!0)}window.requestAnimFrame=function(){return function(a){window.setTimeout(a,10)}}();
function checkReadyState(){4===game.gameOverAudio.readyState&&4===game.backgroundAudio.readyState&&(window.clearInterval(game.checkAudio),game.start())};KEY_CODES={32:"space",37:"left",38:"up",39:"right",40:"down"};KEY_STATUS={};for(code in KEY_CODES)KEY_STATUS[KEY_CODES[code]]=!1;document.onkeydown=function(a){var b=a.keyCode?a.keyCode:a.charCode;KEY_CODES[b]&&(a.preventDefault(),KEY_STATUS[KEY_CODES[b]]=!0)};document.onkeyup=function(a){var b=a.keyCode?a.keyCode:a.charCode;KEY_CODES[b]&&(a.preventDefault(),KEY_STATUS[KEY_CODES[b]]=!1)};function Pool(a){var b=[];this.init=function(c){if("bullet"==c)for(c=0;c<a;c++){var d=new Bullet("bullet");d.init(0,0,imageRepository.bullet.width,imageRepository.bullet.height);d.collidableWith="enemy";d.type="bullet";b[c]=d}else if("enemy"==c)for(c=0;c<a;c++)d=new Enemy,d.init(0,0,imageRepository.enemy.width,imageRepository.enemy.height),b[c]=d;else if("enemyBullet"==c)for(c=0;c<a;c++)d=new Bullet("enemyBullet"),d.init(0,0,imageRepository.enemyBullet.width,imageRepository.enemyBullet.height),d.collidableWith=
"ship",d.type="enemyBullet",b[c]=d};this.get=function(c,d,e){b[a-1].alive||(b[a-1].spawn(c,d,e),b.unshift(b.pop()))};this.getTwo=function(c,d,e,k,f,g){b[a-1].alive||b[a-2].alive||(this.get(c,d,e),this.get(k,f,g))};this.getPool=function(){for(var c=[],d=0;d<a;d++)b[d].alive&&c.push(b[d]);return c};this.animate=function(){for(var c=0;c<a;c++)if(b[c].alive)b[c].draw()&&(b[c].clear(),b.push(b.splice(c,1)[0]));else break}};function QuadTree(a,b){this.bounds=a||{x:0,y:0,width:0,height:0};var c=[];this.nodes=[];var d=b||0;this.clear=function(){c=[];for(var a=0;a<this.nodes.length;a++)this.nodes[a].clear();this.nodes=[]};this.getAllObjects=function(a){for(var b=0;b<this.nodes.length;b++)this.nodes[b].getAllObjects(a);for(var b=0,d=c.length;b<d;b++)a.push(c[b]);return a};this.findObjects=function(a,b){if("undefined"===typeof b)console.log("UNDEFINED OBJECT");else{var d=this.getIndex(b);-1!=d&&this.nodes.length&&this.nodes[d].findObjects(a,
b);for(var d=0,g=c.length;d<g;d++)a.push(c[d]);return a}};this.insert=function(a){if("undefined"!==typeof a)if(a instanceof Array)for(var b=0,f=a.length;b<f;b++)this.insert(a[b]);else{if(this.nodes.length&&(f=this.getIndex(a),-1!=f)){this.nodes[f].insert(a);return}c.push(a);if(10<c.length&&5>d)for(null==this.nodes[0]&&this.split(),b=0;b<c.length;)f=this.getIndex(c[b]),-1!=f?this.nodes[f].insert(c.splice(b,1)[0]):b++}};this.getIndex=function(a){var b=-1,c=this.bounds.x+this.bounds.width/2,d=this.bounds.y+
this.bounds.height/2,h=a.y<d&&a.y+a.height<d,d=a.y>d;a.x<c&&a.x+a.width<c?h?b=1:d&&(b=2):a.x>c&&(h?b=0:d&&(b=3));return b};this.split=function(){var a=this.bounds.width/2|0,b=this.bounds.height/2|0;this.nodes[0]=new QuadTree({x:this.bounds.x+a,y:this.bounds.y,width:a,height:b},d+1);this.nodes[1]=new QuadTree({x:this.bounds.x,y:this.bounds.y,width:a,height:b},d+1);this.nodes[2]=new QuadTree({x:this.bounds.x,y:this.bounds.y+b,width:a,height:b},d+1);this.nodes[3]=new QuadTree({x:this.bounds.x+a,y:this.bounds.y+
b,width:a,height:b},d+1)}};function Ship(){this.speed=3;this.bulletPool=new Pool(30);this.bulletPool.init("bullet");var a=0;this.collidableWith="enemyBullet";this.type="ship";this.init=function(a,c,d,e){this.x=a;this.y=c;this.width=d;this.height=e;this.alive=!0;this.isColliding=!1;this.bulletPool.init("bullet")};this.draw=function(){this.context.drawImage(imageRepository.spaceship,this.x,this.y)};this.move=function(){a++;if(KEY_STATUS.left||KEY_STATUS.right||KEY_STATUS.down||KEY_STATUS.up)this.context.clearRect(this.x,this.y,
this.width,this.height),KEY_STATUS.left?(this.x-=this.speed,0>=this.x&&(this.x=0)):KEY_STATUS.right?(this.x+=this.speed,this.x>=this.canvasWidth-this.width&&(this.x=this.canvasWidth-this.width)):KEY_STATUS.up?(this.y-=this.speed,0>=this.y&&(this.y=0)):KEY_STATUS.down&&(this.y+=this.speed,this.y>=this.canvasHeight-this.height&&(this.y=this.canvasHeight-this.height)),this.isColliding?game.gameOver():this.draw();KEY_STATUS.space&&15<=a&&!this.isColliding&&(this.fire(),a=0)};this.fire=function(){this.bulletPool.getTwo(this.x+
6,this.y,3,this.x+33,this.y,3);game.laser.get()}}Ship.prototype=new Drawable;function SoundPool(a){var b=[];this.pool=b;var c=0;this.init=function(c){if("laser"==c)for(c=0;c<a;c++)laser=new Audio("sounds/laser.mp3"),laser.volume=.12,laser.load(),b[c]=laser;else if("explosion"==c)for(c=0;c<a;c++){var e=new Audio("sounds/explosion.mp3");e.volume=.1;e.load();b[c]=e}};this.get=function(){(0==b[c].currentTime||b[c].ended)&&b[c].play();c=(c+1)%a}};
