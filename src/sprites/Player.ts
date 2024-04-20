// player class

import gameOptions from "../helper/gameOptions";
import eventsCenter from "../helper/eventsCenter";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    private isFlying: boolean;
    private isSpeed: boolean;
    private speedStartTime: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y, 'spriteSheet', 241);

        // add physics to the sprite
        scene.physics.add.existing(this);

        // set the proper size and offset for the body
        this.setSize(this.displayWidth * 0.75, this.displayHeight * 0.6875);
        this.setOffset(this.displayWidth * 0.125, this.displayHeight * 0.3125);

        this.play('player-idle');

        // initialize the properties
        this.isFlying = false;
        this.speedStartTime = Date.now() - gameOptions.playerSpeedTime;     //  start time (ensure it is working from the beginning)
        this.isSpeed = false;

        // set the color
        this.setTint(gameOptions.playerColor);

        // player collides with world bounds
        this.setCollideWorldBounds(true);

        // setup event listeners for power up pickup
        this.setupPickUpEvents();

    }

    update() {
        super.update();

        // stop the fly
        if (this.isFlying && this.body!.blocked.down && this.body!.velocity.y >= 0) {        // stop the jump

            this.isFlying = false;
            this.play('player-run');                        // change the animation
            this.setVelocityX(gameOptions.playerSpeed);         // change the x speed back to the running speed

        }

        // stop the speed
        if (this.isSpeed && this.body!.blocked.down && Date.now() > this.speedStartTime + gameOptions.playerSpeedTime) {        // stop the speed when the timer is over, the player is on the ground and the player is not flying

            this.isSpeed = false;
            this.play('player-run');                      // change the animation
            this.setVelocityX(gameOptions.playerSpeed);         // change the x speed back to the running speed

        }


    }

    move() {

        this.setVelocityX(gameOptions.playerSpeed);
        this.play('player-run');

    }

    fly() {

        let ySpeed = -gameOptions.playerFlySpeed.y;

        if (this.isSpeed) {             // if the player is on speed then jump higher
            this.isSpeed = false;       // stop the speed
            ySpeed = -gameOptions.playerFlySpeed.y - gameOptions.playerSpeedSpeed.y;
        }

        this.setVelocity(gameOptions.playerSpeed + gameOptions.playerFlySpeed.x, ySpeed);   // set the fly speed
        this.isFlying = true;
        this.play('player-fly');

    }

    speed() {

        if (!this.isFlying) {      // only speed up if the player is not jumping
            this.setVelocityX(gameOptions.playerSpeed + gameOptions.playerSpeedSpeed.x);
            this.play('player-speed');
        }

        this.isSpeed = true;
        this.speedStartTime = Date.now();

    }

    setupPickUpEvents() {

        eventsCenter.on('powerUpPickedUp', (puType: string) => {

            switch (puType) {
                case 'Fly':
                    this.fly();
                    break;
                case 'Speed':
                    this.speed();
                    break;
                case 'Shoot':
                    console.log('SHOOOT!');         // TODO: Replace with real action
                    break;
            }

        });

    }

}