// power up button class

import gameOptions from "../helper/gameOptions";
import eventsCenter from "../helper/eventsCenter";
import Spawner from "./Spawner";

export default class PowerUpBtn extends Phaser.GameObjects.Container {

    private readonly puType: string;
    private readonly icon: Phaser.GameObjects.Image;
    private remainingCount: number;
    private remaining: Phaser.GameObjects.BitmapText;
    private readonly spawner: Spawner;
    private interactive: boolean;

    constructor(scene: Phaser.Scene, x: number, y:number, puType: string, remainingCount: number, spawner: Spawner) {

        super(scene, x, y);

        // set variables
        this.puType = puType;
        this.remainingCount = remainingCount;
        this.spawner = spawner;                 // spawner is needed, as the button will provide where the spawner currently is (where the power up needs to be spawned)
        this.interactive = false;                    // button is not interactive at the beginning

        // choose the icon type (number from the spritesheet)
        let iconNumber = 0;

        switch (this.puType) {
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

        // create images and text and add them to container
        this.icon = new Phaser.GameObjects.Image(scene, 0, 0, 'spriteSheet', iconNumber).setScale(2);
        const title = new Phaser.GameObjects.BitmapText(scene, 0, -this.icon.displayHeight * 0.5, 'minogram',this.puType, 20).setOrigin(0.5, 1);
        this.remaining = new Phaser.GameObjects.BitmapText(scene, -this.icon.displayWidth * 0.6, 0,  'minogram', this.remainingCount.toString() + 'x', 20).setOrigin(1, 0.5);

        this.add([this.icon, title, this.remaining]);

        // do not show the container if there are no power ups remaining
        if (this.remainingCount == 0) {
            this.setVisible(false);
        }

    }

    update() {
        super.update();


    }

    // action when the button is clicked
    click() {

        if (this.interactive) {         // only do something if the button is really active (needed for keyboard clicks, as it executes this function)

            // Check if there are remaining power ups and only do something if there are
            if (this.remainingCount > 0) {

                // reduce the remaining counter and text
                this.remainingCount--;
                this.remaining.setText(this.remainingCount.toString() + 'x');

                // emit an event that the button was pressed
                eventsCenter.emit('spawnPowerUp', this.spawner.x, this.spawner.y, this.puType);

            }
        }
    }

    // activate the button
    activateBtn() {

        this.icon.setInteractive();             // set the interactivity
        this.interactive = true;                // set the interactive switch (to ensure the click is only executed when the button is active)

        // add the icon click event (but not activate it yet, as it will only be activated when the game starts)
        this.icon.on('pointerdown', () => {this.click()});

    }

}