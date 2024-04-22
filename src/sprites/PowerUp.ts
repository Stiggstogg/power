// power up class

import gameOptions from "../helper/gameOptions";
import Phaser from "phaser";
import eventsCenter from "../helper/eventsCenter";
import Player from "./Player";

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {

    private readonly puType: string;
    private isFalling: boolean;            // flag if the powerup is falling for the first time
    private player: Player;

    constructor(scene: Phaser.Scene, x: number, y: number, puType: string, player: Player) {

        // choose the icon type (number from the spritesheet)
        let iconNumber = 0;

        switch (puType) {
            case 'Fly':
                iconNumber = gameOptions.iconNumberFly;
                break;
            case 'Speed':
                iconNumber = gameOptions.iconNumberSpeed;
                break;
            case 'Shoot':
                iconNumber = gameOptions.iconNumberShoot;
                break;
        }

        super(scene, x, y, 'spriteSheet', iconNumber);

        // set the properties
        this.puType = puType;       // Power Up type
        this.isFalling = true;      // the powerup is falling
        this.player = player;       // get the player

        // add sprite to the scene
        scene.physics.add.existing(this);

    }

    update() {
        super.update();

        // check if the power up touched ground for the first time, if yes then move it
        if (this.isFalling && this.body!.blocked.down) {
            this.isFalling = false;
            this.moveBack();
        }
        else if (this.isFalling && typeof this.player !== 'undefined' && typeof this.player.body !== 'undefined') {      // if it is falling make sure it always falls straight down

            if (this.scene.cameras.main.worldView.x + this.scene.cameras.main.worldView.width >= this.scene.physics.world.bounds.width) {
                this.setVelocityX(0);
            }
            else {
                this.setVelocityX(this.player.body!.velocity.x);
            }

        }

    }

    pickedUp() {

        this.scene.sound.get('pickup').play({volume: gameOptions.volumePickup});

        this.destroy();
        eventsCenter.emit('powerUpPickedUp', this.puType);

    }

    moveBack() {

        this.setVelocityX(-gameOptions.powerUpSpeed);

    }

}