// player class

import gameOptions from "../helper/gameOptions";
import eventsCenter from "../helper/eventsCenter";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    private isJumping: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y, 'spriteSheet', 241);

        // add sprite to the scene
        scene.physics.add.existing(this);

        this.play('player-idle');
        this.isJumping = false;

        // setup event listeners for power up pickup
        this.setupPickUpEvents();

    }

    update() {
        super.update();

        if (this.isJumping && this.body!.blocked.down && this.body!.velocity.y >= 0) {        // stop the jump

            this.isJumping = false;
            this.play('player-run');                        // change the animation
            this.setVelocityX(gameOptions.playerSpeed);         // change the x speed back to the running speed

        }

    }

    move() {

        this.setVelocityX(gameOptions.playerSpeed);
        this.play('player-run');

    }

    fly() {

        this.setVelocity(gameOptions.playerSpeed + gameOptions.playerJumpSpeed.x, -gameOptions.playerJumpSpeed.y);
        this.isJumping = true;
        this.play('player-jump');

    }

    setupPickUpEvents() {

        eventsCenter.on('powerUpPickedUp', (puType: string) => {

            switch (puType) {
                case 'Fly':
                    this.fly();
                    break;
                case 'Speed':
                    console.log('SPEEEED!');        // TODO: Replace with real action
                    break;
                case 'Shoot':
                    console.log('SHOOOT!');         // TODO: Replace with real action
                    break;
            }

        });

    }

}