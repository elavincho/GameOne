var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },

  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var score = 0;
var scoreText;
var gameOver = false;
var game = new Phaser.Game(config);

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform2.png");
  this.load.image("ground2", "assets/platform.png");
  this.load.image("star", "assets/fantasma.gif");
  this.load.image("bomb", "assets/bomb.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create() {
  //this.add.image(x,y,nombreimg);
  this.add.image(400, 300, "sky");

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, "ground").setScale(2).refreshBody();

  platforms.create(650, 500, "ground2");
  platforms.create(50, 450, "ground2");
  platforms.create(370, 350, "ground2");
  platforms.create(760, 220, "ground2");
  platforms.create(290, 250, "ground2");
  platforms.create(0, 140, "ground2");
  platforms.create(840, 100, "ground2");

  player = this.physics.add.sprite(100, 450, "dude");

  player.setCollideWorldBounds(true); // Para que el personaje choque con los bordes del juego.
  player.setBounce(0.4); // Para que el personaje rebote. Valores del 0 al 1.

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  //player.body.setGravityY(300); //Cuando el valor de la gravedad es más alto va a caer más rapido.

  this.physics.add.collider(player, platforms); //El colider detecta la colisión o superposición de 2 objetos.

  cursors = this.input.keyboard.createCursorKeys();

  stars = this.physics.add.group({
    key: "star",
    repeat: 19,
    setXY: { x: 11, y: 0, stepX: 41 }, //step separa los elementos
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  this.physics.add.collider(stars, platforms);

  this.physics.add.overlap(player, stars, collectStar, null, true);

  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#fff",
  });

  bombs = this.physics.add.group();

  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
  if (gameOver) {
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true);

  score += 10;
  scoreText.setText("Score: " + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });
    var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
}

function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");

  gameOver = true;
}
