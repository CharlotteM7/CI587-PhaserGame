class Troll extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, xPos, yPos, texture) {
      super(scene, xPos, yPos, texture);
      // had to do this to create a physics body
      scene.physics.add.existing(this);
      //set up the physics properties
      this.setCollideWorldBounds(true);
        //add the walking animations
        scene.anims.create({
            key: 'trollWalkDown',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'trollWalkLeft',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 3,
                end: 5
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load('trollWalkLeft');
        scene.anims.create({
            key: 'trollWalkRight',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 6,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load('trollWalkRight');
        scene.anims.create({
            key: 'trollWalkUp',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 9,
                end: 11
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load('trollWalkUp');

        // Add this to the scene to make it visible/active etc
        scene.add.existing(this);
        // pseudo private properites
        this._world = world;
        this._VELOCITY = 10;
        
        this._xDir = 0;
        this._yDir = 0

        this._DIRCHANGETIME = 10;
        this._cleverness = 100;
        this._dirTimer = 0;
        this._changeTime = 0;

        scene.physics.add.collider(this, this._world.wallLayer, this._wallCollisionHandler);
    } // end of constructor()   

  

    _move(xDir, yDir) {
        this.setVelocity(0);
        if (xDir === 0 && yDir === 0) {

            this.setFrame(1); // stand still
        } else {
            if (xDir !== 0) {
                this.setVelocityX(xDir * this._VELOCITY);
                if (xDir === -1) {
                    this.anims.play('trollWalkLeft', true);
                } else if (xDir === 1) {
                    this.anims.play('trollWalkRight', true);
                }
            } else {
                this.setVelocityY(yDir * this._VELOCITY);
                if (yDir === -1) {
                    this.anims.play('trollWalkUp', true);
                } else if (yDir === 1) {
                    this.anims.play('trollWalkDown', true);
                }
            }
        }
    } //_move()

   
    _getMove() {
        let xDir = this._xDir;
        let yDir = this._yDir;
        // check if it is time to change movement
        if (this._dirTimer >= this._changeTime) {
            // work out directions the enemy needs to move to get closer to player
            xDir = (world.player_spr.x - this.x);
            if (xDir !== 0) {
                xDir = xDir / Math.abs(xDir);
            }
            yDir = (world.player_spr.y - this.y);
            if (yDir !== 0) {
                yDir = yDir / Math.abs(yDir);
            }
            // dumbdown - sometimes go in wrong direction   
            if (Math.random() * this._cleverness < 1) {
                //trace("dumb");
                xDir *= -1;
                yDir *= -1;
            }
            // force the NPC to move along either the x or y axis    
            if (xDir !== 0 && yDir !== 0) {
                if (Math.random() > 0.5) {
                    xDir = 0;
                } else {
                    yDir = 0;
                }
            }
            // reset update timer 
            this._changeTime = Phaser.Math.RND.integerInRange(20, this._DIRCHANGETIME);
            this._dirTimer = 0;
        } // end of update behaviour 
        this._dirTimer++;
        //move
        this._xDir = xDir;
        this._yDir = yDir;
        this._move(xDir, yDir);
    }; // end of getMove()



    

} // End of constructor