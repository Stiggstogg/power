import Phaser from 'phaser';

import gameOptions from "../helper/gameOptions";
import {GameSceneData} from "../helper/interfaces";
import Spawner from "../sprites/Spawner";
import PowerUpBtn from "../sprites/PowerUpBtn";
import eventsCenter from "../helper/eventsCenter";

// "Game" scene: Scene for the main game
export default class GameUIScene extends Phaser.Scene {

    private spawner!: Spawner
    private levelKey!: string;
    private gameData!: GameSceneData;
    private flyBtn!: PowerUpBtn;
    private speedBtn!: PowerUpBtn;
    private shootBtn!: PowerUpBtn;
    private retryBtn!: Phaser.GameObjects.Image;
    private menuBtn!: Phaser.GameObjects.Image;
    private lastButtonPress!: number;
    private isCooldown!: boolean;
    private isStarted!: boolean;

    // Constructor
    constructor() {
        super({
            key: 'GameUI'
        });
    }

    /// Initialize parameters
    init(data: GameSceneData): void {

        this.levelKey = 'Level ' + data.level.toString();        // generate level key

        this.gameData = data;

    }

    // Creates all objects of this scene
    create(): void {

        // fade in
        this.cameras.main.fadeIn(gameOptions.fadeInOutTime);

        // initialize last button press timer to ensure the button can be pressed from the beginning
        this.lastButtonPress = Date.now() - gameOptions.buttonCooldown;
        this.isCooldown = false;
        this.isStarted = false;     // switch to show if the level was already started

        eventsCenter.on('startButtonCooldown', () => {      // start the cooldown if
           this.startCooldown();
        });

        // setup objects
        this.setupObjects();

        // wait until the level is started to activate the buttons and other things
        eventsCenter.once('startLevel', () => {
            this.startLevel();
        });

        // add the keyboard controls
        this.addKeys();

        // event
        eventsCenter.once('sceneFadeout', () => {
            this.fadeOut();
        });

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        this.spawner.update();

        this.buttonCooldownCheck();

    }

    // Add keyboard input to the scene.
    addKeys(): void {

        // add keyboard controls
        this.input.keyboard?.addKey('A').on('down', () => {
            this.flyBtn.click();        // "click" on the button
        });

        // add keyboard controls
        this.input.keyboard?.addKey('S').on('down', () => {
            this.speedBtn.click();        // "click" on the button
        });


    }

    // setup game objects, e.g. player
    setupObjects(){

        // setup spawner platform
        this.spawner = this.add.existing(new Spawner(this, gameOptions.spawnerPosition.x, gameOptions.spawnerPosition.y));

        this.tweens.add({
            targets: this.spawner,
            duration: 750,
            y: {
                from: gameOptions.spawnerPosition.y - gameOptions.spawnerMovement,
                to: gameOptions.spawnerPosition.y + gameOptions.spawnerMovement
            },
            repeat: -1,
            yoyo: true,
            ease: 'easeInOutCubic'
        });

        // get the tilemap (for the properties)
        const mapProperties: any = this.make.tilemap({key: this.levelKey}).properties;   // create a tile map and get its properties (it is an array, but for simplicity and to avoid type errors I just used "any")

        // setup the buttons based on the properties of the map
        for (let i = 0; i < mapProperties.length; i++) {

            switch (mapProperties[i].name) {
                case 'flyNumber':
                    this.flyBtn = this.add.existing(new PowerUpBtn(this, gameOptions.gameWidth * 0.90, gameOptions.gameHeight * 0.35, 'Fly', mapProperties[i].value, this.spawner));
                    break;
                case 'speedNumber':
                    this.speedBtn = this.add.existing(new PowerUpBtn(this, gameOptions.gameWidth * 0.90, gameOptions.gameHeight * 0.6, 'Speed', mapProperties[i].value, this.spawner));
                    break;
                case 'shootNumber':
                    this.shootBtn = this.add.existing(new PowerUpBtn(this, gameOptions.gameWidth * 0.90, gameOptions.gameHeight * 0.85, 'Shoot', mapProperties[i].value, this.spawner));
                    break;
            }
        }

        // setup the level and attempts text
        const textYPos = 0.075;              // y position of the text elements
        const btnYPos = 0.065;              // y position of the buttons

        this.add.bitmapText(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * textYPos, 'minogram',
            'Level ' + this.gameData.level.toString() + '/' + gameOptions.maxLevel, 20).setOrigin(0.5, 0.5).setTint(gameOptions.uiColor);

        this.add.bitmapText(gameOptions.gameWidth * 0.02, gameOptions.gameHeight * textYPos, 'minogram',
            'Deaths: ' + this.gameData.attempts.toString(), 20).setOrigin(0, 0.5).setTint(gameOptions.uiColor);

        // setup the exit and retry button
        this.retryBtn = this.add.image(gameOptions.gameWidth * 0.85, gameOptions.gameHeight * btnYPos, 'spriteSheet', 69).setScale(2).setOrigin(0.5).setInteractive();

        this.menuBtn = this.add.image(gameOptions.gameWidth * 0.95, gameOptions.gameHeight * btnYPos, 'spriteSheet', 70).setScale(2).setOrigin(0.5).setInteractive();

        this.retryBtn.on('pointerdown', () => {
            eventsCenter.emit('retryButton');
        });

        this.menuBtn.on('pointerdown', () => {
            eventsCenter.emit('menuButton');
        })

    }

    // function which is executed when the level is started
    startLevel() {

        // activate all buttons
        this.flyBtn.activateBtn();
        this.speedBtn.activateBtn();
        this.shootBtn.activateBtn();

        // set the switch that the level is started
        this.isStarted = true;

    }

    // activate all buttons after cooldown
    buttonCooldownCheck() {

        if (Date.now() > this.lastButtonPress + gameOptions.buttonCooldown && this.isCooldown && this.isStarted) {

            this.flyBtn.activateBtn();
            this.speedBtn.activateBtn();
            this.shootBtn.activateBtn();

            this.isCooldown = false;

        }

    }

    // start the cooldown of the buttons
    startCooldown() {

        this.lastButtonPress = Date.now();      // update the last button press timer

        // deactivate all buttons
        this.flyBtn.deactivateBtn();
        this.speedBtn.deactivateBtn();
        this.shootBtn.deactivateBtn();

        this.isCooldown = true;

    }

    // deactivate all buttons and fade out
    fadeOut() {

        // fade out
        this.cameras.main.fadeOut(gameOptions.fadeInOutTime);

        // deactivate all power up buttons
        this.flyBtn.deactivateBtn();
        this.speedBtn.deactivateBtn();
        this.shootBtn.deactivateBtn();

        // deactivate retry and exit button
        this.retryBtn.removeInteractive();
        this.menuBtn.removeInteractive();

    }

}