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

    constructor(scene: Phaser.Scene, x: number, y:number, puType: string, remainingCount: number, spawner: Spawner) {

        super(scene, x, y);

        // set variables
        this.puType = puType;
        this.remainingCount = remainingCount;
        this.spawner = spawner;                 // spawner is needed, as the button will provide where the spawner currently is (where the power up needs to be spawned)

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

        // make the icon interactive
        this.icon.setInteractive();
        this.icon.on('pointerdown', () => {this.click()});

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