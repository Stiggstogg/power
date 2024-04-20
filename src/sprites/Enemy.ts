// enemy class

import gameOptions from "../helper/gameOptions";
import Vector2 = Phaser.Math.Vector2;

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

    private readonly initialPos: Vector2;
    private readonly enemyType: string;
    private movementUp: number;
    private movementDown: number;
    private movementSpeed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, enemyType: string) {

        super(scene, x, y, 'spriteSheet');

        // set properties
        this.enemyType = enemyType;
        this.movementUp = 0;
        this.movementDown = 0;
        this.movementSpeed = 0;

        // add physics to the sprite
        scene.physics.add.existing(this);

        // save initial position
        this.initialPos = new Vector2(x, y);

        // set origin to the origin which is used in Tiled
        this.setOrigin(0, 1);

        // set the color
        this.setTint(gameOptions.enemyColor);

        // disable gravity
        if (this.body instanceof Phaser.Physics.Arcade.Body) {          // as body can be different types (Body, StaticBody, it needs to be checked what kind of body is, as some of them do not have the .setAllowGravity method
            this.body.setAllowGravity(false);
        }

        // setup enemy properties (based on the type of enemy)
        this.setupEnemy();

    }

    update() {
        super.update();

        // move up and down
        if (this.y >= this.initialPos.y + this.movementDown) {
            this.setVelocityY(-this.movementSpeed);    // change direction to move up

        }
        else if (this.y <= this.initialPos.y - this.movementUp) {             // change direction to move down
            this.setVelocityY(this.movementSpeed);
        }

    }

    // setup the properties of the different enemies
    setupEnemy() {

        // define the default parameters for the body
        let width = 1;          // relative width to display width
        let height = 1;        // relative height to display height
        let offsetX = 0;                        // relative offset to display width
        let offsetY = 0;                        // relative offset to display height

        switch (this.enemyType) {
            case 'spike': {
                this.setFrame(122);             // show correct frame
                height =  0.5;
                offsetY = 0.5;
                break;
            }
            case 'bat': {
                this.play('batEnemy-idle');        // play animation
                width = 0.875;
                height = 0.56;
                offsetX = 0.0625;
                offsetY = 0.25;
                this.movementUp = gameOptions.batUpDown;
                this.movementDown = gameOptions.batUpDown;
                this.movementSpeed = gameOptions.batSpeed;
                break;
            }
            case 'moving': {
                break;
            }

        }

        // start with moving down
        this.setVelocityY(this.movementSpeed);

        // set the proper size and offset for the body
        this.setSize(this.displayWidth * width, this.displayHeight * height);
        this.setOffset(this.displayWidth * offsetX, this.displayHeight * offsetY);

    }

}