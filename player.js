class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, xPos, yPos, texture) {
    super(scene, xPos, yPos, texture);
    // had to do this to create a physics body
    scene.physics.add.existing(this);
    //set up the physics properties
    this.setCollideWorldBounds(true);
    //add the walking animations
    scene.anims.create({
      key: "walkDown",
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.load("walkDown");
    scene.anims.create({
      key: "walkDown",
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.load("walkDown");
    scene.anims.create({
      key: "walkLeft",
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 3,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.load("walkLeft");
    scene.anims.create({
      key: "walkRight",
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 6,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.load("walkRight");
    scene.anims.create({
      key: "walkUp",
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 9,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.load("walkUp");



    this._VELOCITY = 75;
    this.state_str = "normal";
    this._health = 100;
    this._healthUpdateAllowed_bool = true;

    // Add this to the scene to make it visible/active
    scene.add.existing(this);

    
  } // end of constructor()


  resetHealth() {
    this._health = 100;
    this.state_str = "normal";
  }
  
  resetSpeed() {
    this._VELOCITY = 75;
    this.state_str = "normal";
  }
 

  setState(newState_str) {
    this.state_str = newState_str;
    
    if (newState_str === "healthy") {
      this._health = 200;
      setTimeout(() => {
        this.resetHealth();
      }, 10000); // 10 seconds
    }
    if(newState_str === "speedy"){
      this._VELOCITY = 150;
      setTimeout(() => {
        this.resetSpeed();
      }, 10000); // 10 seconds
    } 
    }
  


  // Updates the  "private" health property
  updateHealth(change) {
  
    // only updates the health at intervals
    if (this._healthUpdateAllowed_bool) {
      this._healthUpdateAllowed_bool = false;

      // set up a timer to  call _enableHealthUpdates
      setInterval(this._enableHealthUpdates.bind(this), 1000);
      // update the players _health property
      this._health += change;
    }
    if (this.health <= 0) {
      this.health = 100;
      clearInterval(this._healthInterval);
      this._healthUpdateAllowed_bool = true;
    }
  
  }// end of updateHealth()


  // Called at an iterval after updateHealthChange, effectively  re-enables
  // health updates
  _enableHealthUpdates() {
    this._healthUpdateAllowed_bool = true;
  } // end of _enableHealthUpdates()

  // getter function
  get health() {
    return this._health;
  }

  set health(health) {
    return this._health;
  }




  move(xDir, yDir) {
    if (xDir === 0 && yDir === 0) {
        this.setVelocity(0);
        this.setFrame(1); // stand still
    } else {
        this.setVelocityX(xDir * this._VELOCITY);

        this.setVelocityY(yDir * this._VELOCITY);
        if (xDir === -1) {
            this.anims.play('walkLeft', true);
        } else if (xDir === 1) {
            this.anims.play('walkRight', true);
        }

        if (yDir === -1) {
            this.anims.play('walkUp', true);
        } else if (yDir === 1) {
            this.anims.play('walkDown', true);
        }
    }
} //_move()





updateMe (world)
{
  
  var xDir = 0;
  var yDir = 0;
  // check keyboard
  if (world.cursors.left.isDown) {
      xDir = -1;
  } else if (world.cursors.right.isDown) {
      xDir = 1;
  } else if (world.cursors.up.isDown) {
      yDir = -1;
  } else if (world.cursors.down.isDown) {
      yDir = 1;
  }
  this.move(xDir, yDir);


    // enable collision handling in wallLayer
    world.wallLayer.setCollisionByProperty({
      collides: true,
    });
  
    // enable collision handling in doorLayer
    world.doorLayer.setCollisionByProperty({
      collides: true,
    });

  
  
  } // end updateMe

} // End of class

