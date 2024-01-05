class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, xPos, yPos, texture, waypoints) {
    super(scene, xPos, yPos, texture);
    // had to do this to create a physics body
    scene.physics.add.existing(this);
    //set up the physics properties
    this.setCollideWorldBounds(true);

    this.waypoints = waypoints; // store the waypoints as a property of the enemy
    this.currentWaypoint = 0;
    this.enemySpeed = 50; // pixels per second


  }

  moveToNextWaypoint() {

    this.waypoint = this.waypoints[this.currentWaypoint];
    this.tween = this.scene.tweens.add({
      targets: this,
      x: this.waypoint.x,
      y: this.waypoint.y,
      duration: 2500, 
      onComplete: () => {
        this.currentWaypoint =
          (this.currentWaypoint + 1) % this.waypoints.length;
        this.moveToNextWaypoint();
      },
    });
  }

  startPatrol() {
    this.currentWaypoint = 0;
    this.moveToNextWaypoint();
    
  }





} //end
