// power up class

import gameOptions from "../helper/gameOptions";
import Phaser from "phaser";
import eventsCenter from "../helper/eventsCenter";

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {

    private readonly effect: string;
    private isFalling: boolean;            // flag if the powerup is falling for the first time

    constructor(scene: Phaser.Scene, x: number, y: number, effect: string) {

        super(scene, x, y, 'spriteSheet', 27);

        // set the properties
        this.effect = effect;       // effect
        this.isFalling = true;      // the powerup is falling

        // add sprite to the scene
        scene.physics.add.existing(this);

        // set starting velocity (same velocity as player)
        this.setVelocityX(gameOptions.playerSpeed);

    }

    update() {
        super.update();

        // check if the power up touched ground for the first time, if yes then move it
        if (this.isFalling && this.body!.blocked.down) {
            this.isFalling = false;
            this.moveBack();
        }

    }

    pickedUp() {

        this.destroy();

        eventsCenter.emit(this.effect);

    }

    moveBack() {

        this.setVelocityX(-gameOptions.powerUpSpeed);

    }

}