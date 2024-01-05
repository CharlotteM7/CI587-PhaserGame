let world = {
  ROWS: 20,
  COLUMNS: 20,
  TILEWIDTH: 32,
  cursors: null,
  map: null,
  tileset: null,
  groundLayer: null,
  wallLayer: null,
  keyLayer: null,
  coinLayer: null,
  doorLayer: null,
  player_spr: null,
  score: 0,
  keysCollected: 0,
  requiredKeys: 3,
  spike: null,
  enemyGroup: null,
}; // end of world

let config = {
  type: Phaser.AUTO,
  width: world.COLUMNS * world.TILEWIDTH,
  height: world.ROWS * world.TILEWIDTH,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [
   {
    key: "start",
    create: createStartScene,

   },
    {
      key: "game",
      preload: preload,
      create: create,
      update: update,
    },

    {
      key: "win",
      create: createWinScene,
    },
  ],
};

let game = new Phaser.Game(config);

function preload() {
  
  this.load.tilemapTiledJSON("groundLevel", "world.json");
  this.load.image("gameTiles", "assets/2D_Pixel_Dungeon/tileset.png");
 

  this.load.audio("bgMusic", "assets/bg_music.mp3");
  this.load.audio("coinSound", "assets/coin.mp3");
  this.load.audio("keySound", "assets/key_pickup.mp3");
  this.load.audio("doorSound", "assets/door.mp3");
  this.load.audio("hurtSound", "assets/hurt.mp3");
  this.load.audio("deathSound", "assets/death.mp3");
  this.load.audio("healthSound", "assets/heal.mp3");

  this.load.spritesheet("player", "assets/Soldier 01-1.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.spritesheet("spike", "assets/spikeSpriteSheet.png", {
    frameWidth: 23,
    frameHeight: 21,
  });

  this.load.spritesheet("enemy", "assets/Enemy 15-4.png", {
    frameWidth: 32,
    frameHeight: 32,
  });

  this.load.spritesheet("troll", "assets/troll.png", {
    frameWidth: 32,
    frameHeight: 32,
  });

} // end of preload();

function createWinScene() {

  // Add a title text for the start menu
  this.add.text(150, 150, "You did! You escaped!", { fontSize: "32px", fill: "#fff" });


}

function createStartScene() {


  // Add a title text for the start menu
  this.add.text(160, 100, "Can you escape?", { fontSize: "32px", fill: "#fff" });

  // Add a start button
  let startButton = this.add.text(200, 300, "Start Game", {
    fontSize: "32px",
    fill: "#fff",
  });
  startButton.setInteractive();
  startButton.on("pointerdown", () => {
    this.scene.start("game");
  });
}

function create() {
 
  buildWorld(this, world);
  
  // Create player
  world.player_spr = new Player(this, 160, 130, "player");
  world.cursors = this.input.keyboard.createCursorKeys();

  //Create sounds 
  hurtSound = this.sound.add("hurtSound");
  deathSound = this.sound.add("deathSound");
  healthSound = this.sound.add("healthSound");
  coinSound = this.sound.add("coinSound");
  keySound = this.sound.add("keySound");
  doorSound = this.sound.add("doorSound");
  bgMusic = this.sound.add("bgMusic");
  bgMusic.setLoop(true);
  bgMusic.play();

  // add camera
  this.cameras.main.setBounds(
    0,
    0,
    world.map.widthInPixels,
    world.map.heightInPixels
  );
  // set physics boundaries
  this.physics.world.setBounds(
    0,
    0,
    world.map.widthInPixels,
    world.map.heightInPixels
  );


//Troll 
world.troll = new Troll(this, 450,450, "troll")


  //Enemy Group
  world.enemyGroup = this.add.group({
    classType: Enemy,
    runChildUpdate: true,
    
  });

  let waypoints1 = [
    { x: 640, y: 128 },
    { x: 448, y: 128 },
  ];
  let waypoints2 = [
    { x: 480, y: 512 },
    { x: 640, y: 512 },
  ];

  let waypoints3 = [
    { x: 250, y: 608 },
    { x: 128, y: 608 },
  ];


  world.enemyGroup.clear(true, true);
  let enemy1 = world.enemyGroup.create(640, 128, "enemy", waypoints1);
  let enemy2 = world.enemyGroup.create(480, 512, "enemy", waypoints2);
  let enemy3 = world.enemyGroup.create(250, 608, "enemy", waypoints3);
  enemy1.startPatrol();
  enemy2.startPatrol();
  enemy3.startPatrol();
 



  //Spike Group
  world.spikesGroup = this.physics.add.group({
    key: "spikeSheet",
    frame: 0,
  });
  world.spikesGroup.clear(true, true);

  // add some spikes to the group
  
  
  world.spikesGroup.create(500, 335, "spike");
  world.spikesGroup.create(532, 335, "spike");
  world.spikesGroup.create(310, 140, "spike");
  world.spikesGroup.create(202, 718, "spike");
  world.spikesGroup.create(815, 945, "spike");

  // create the animation for the spikes
  this.anims.create({
    key: "animationSpike",
    frames: this.anims.generateFrameNumbers("spike", {
      start: 0,
      end: 4,
    }),
    frameRate: 1.5,
    repeat: -1,
  });

  // play the animation for each spike in the group
  world.spikesGroup.children.iterate((spike) => {
    spike.play("animationSpike");
  });

  //collision checking on each frame
  this.physics.add.collider(world.player_spr, world.wallLayer);
  this.physics.add.collider(world.player_spr, world.groundLayer);
  this.physics.add.collider(world.player_spr, world.doorLayer);
  this.cameras.main.startFollow(world.player_spr, true, 0.05, 0.05);

  this.physics.add.overlap(
    world.player_spr,
    world.coinLayer,
    onSomething,
    null,
    this
  );


  this.physics.add.overlap(
    world.player_spr,
    world.keyLayer,
    onSomething,
    null,
    this
  );
  

  this.physics.add.overlap(
    world.player_spr,
    world.healthLayer,
    onSomething,
    null,
    this
  );

 

  this.physics.add.overlap(
    world.player_spr,
    world.spikesGroup,
    (player, spike) => {
      if (
        spike.anims.currentFrame.index === 3 ||
        spike.anims.currentFrame.index === 4
      ) {
        // reduce the player's health
        world.player_spr.updateHealth(-20);
        hurtSound.play();
      }
    },
    null,
    this
  );
} // end of create()

function buildWorld(scene, world) {
  // Initialise the tilemap
  world.map = scene.make.tilemap({
    key: "groundLevel",
  });
  // create a tileset and add it to the tilemap
  world.tileSet = world.map.addTilesetImage("tileset", "gameTiles");
  
  // set up the tilemap layers
  world.groundLayer = world.map.createLayer("groundLevel", world.tileSet, 0, 0);
  world.wallLayer = world.map.createLayer("wallLayer", world.tileSet, 0, 0);
  world.doorLayer = world.map.createLayer("doorLayer", world.tileSet, 0, 0);
  world.keyLayer = world.map.createLayer("keyLayer", world.tileSet, 0, 0);
  world.coinLayer = world.map.createLayer("coinLayer", world.tileSet, 0, 0);
  world.healthLayer = world.map.createLayer("healthLayer", world.tileSet, 0, 0);


  // Add the health text - set it so it moves with the camera
  world.health_txt = scene.add
    .text(10, 10, ``, {
      font: "24px Arial",
      fill: "#fff",
    })
    .setScrollFactor(0);

  // Score text
  world.score_txt = scene.add.text(530, 10, ``, {
    font: "24px Arial",
    fill: "#fff",
  }).setScrollFactor(0);

  //Key text
  world.keys_txt = scene.add.text(
    320,
    10,
    ``,
    {
      font: "24px Arial",
      fill: "#fff",
    }
  ).setScrollFactor(0);

    //State text
    world.state_txt = scene.add.text(
      150,
      10,
      ``,
      {
        font: "24px Arial",
        fill: "#fff",
      }
    ).setScrollFactor(0);

  world.coinLayer.setTileIndexCallback([212], onSomething, this);
  world.keyLayer.setTileIndexCallback([125], onSomething, this);
  world.healthLayer.setTileIndexCallback([147], onSomething, this);
  world.healthLayer.setTileIndexCallback([156], onSomething, this);
  world.healthLayer.setTileIndexCallback([136], onSomething, this);
} //end of buildWorld()

// Callback function called when  a sprite is over a tile with a specified Index
function onSomething(sprite, tile) {
  if (tile.properties.hasOwnProperty("coin")) {
    // increase the player's score by 10
    world.score += 10;
    // remove the tile from the map
    world.coinLayer.removeTileAt(tile.x, tile.y);
    // play the sound
    coinSound.play();
  }

  // check whether the tile has a property "health" (specified in tiled)

  if (tile.properties.hasOwnProperty("health")) {
    world.player_spr.updateHealth(25);
    world.healthLayer.removeTileAt(tile.x, tile.y);
    // Play sound
    healthSound.play();
  }

  if (tile.properties.hasOwnProperty("imune")) {
    
    world.player_spr.setState("healthy");
    world.healthLayer.removeTileAt(tile.x, tile.y);
    // Play sound
    healthSound.play();
  
  }

  if (tile.properties.hasOwnProperty("speed")) {
    
    world.player_spr.setState("speedy");
    world.healthLayer.removeTileAt(tile.x, tile.y);
    // Play sound
    healthSound.play();
  
  }

  if (tile.properties.hasOwnProperty("key")) {
    // increase the number of keys collected
    world.keysCollected++;
    //remove the tile from the map
    world.keyLayer.removeTileAt(tile.x, tile.y);
    // Play sound
    keySound.play();
    // unlock the doors
    unlockDoors(world.keysCollected);
  }

  // Return false to stop default collision handling
  return false;
}

function unlockDoors(keysCollected) {
  let tilesToRemove = [183, 184];
  if (keysCollected >= world.requiredKeys) {
    world.doorLayer.forEachTile((tile) => {
      for (let i = 0; i < tilesToRemove.length; i++) {
        if (tile.index === tilesToRemove[i]) {
          world.doorLayer.removeTileAt(tile.x, tile.y);
        }
      }
    });
    doorSound.play();
  }
}


function playerHitEnemy(player, enemy) {
  // Decrease player's health when colliding with enemy
  world.player_spr.updateHealth(-20);
  // Play sound
  hurtSound.play();
}





function update() {

  world.health_txt.setText(`Health: ${world.player_spr.health}`);
  world.score_txt.setText(`Score: ${world.score}`);
  world.keys_txt.setText(
    `Keys collected: ${world.keysCollected}/${world.requiredKeys}`
  );
  world.state_txt.setText(`State: ${world.player_spr.state_str}`)

  // check for win condition
  // check if player's position is within 4 units of the target position
  if (
    Math.abs(world.player_spr.y - 982) < 15 &&
    Math.abs(world.player_spr.x - 895) < 15 &&
    world.keysCollected === world.requiredKeys
  ) {
    this.scene.start("win");
  }


  this.physics.collide(
    world.player_spr,
    world.enemyGroup,
    playerHitEnemy,
    null,
    this
  );

 
  world.player_spr.updateMe(world);
  world.troll._getMove();

  if (world.keysCollected === world.requiredKeys) {
    world.doorLayer.forEachTile((tile) => {
      world.doorLayer.removeTileAt(tile.x, tile.y);
      tile.collides = false;
    });
  }

  
  // check if the player's health is zero or less
  if (world.player_spr.health <= 0 || this.physics.collide (world.player_spr,
    world.troll)) 
  {
  let startX = 160;
  let startY = 130;
  // Play sound
  deathSound.play();
  // reset the player's health to 100
  world.player_spr.health = 100;
  //reset keys collected
  world.keysCollected = 0;
  // reset the player's position
  world.player_spr.setPosition(startX, startY);
  // reset the score to zero
  world.score = 0;
  // restart the scene
  this.scene.restart();
  //Stop background music 
  bgMusic.stop();
  }




}

// end of update()
