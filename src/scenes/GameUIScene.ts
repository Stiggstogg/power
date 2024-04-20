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

        // setup objects
        this.setupObjects();

        // wait until the level is started to activate the buttons and other things
        eventsCenter.once('startLevel', () => {
            this.startLevel();
        });

        // add the keyboard controls
        this.addKeys();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        this.spawner.update();

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
            'Attempts: ' + this.gameData.attempts.toString(), 20).setOrigin(0, 0.5).setTint(gameOptions.uiColor);

        // setup the exit and retry button
        const retryBtn = this.add.image(gameOptions.gameWidth * 0.85, gameOptions.gameHeight * btnYPos, 'spriteSheet', 69).setScale(2).setOrigin(0.5).setInteractive();

        const menuBtn = this.add.image(gameOptions.gameWidth * 0.95, gameOptions.gameHeight * btnYPos, 'spriteSheet', 70).setScale(2).setOrigin(0.5).setInteractive();

        retryBtn.on('pointerdown', () => {
            eventsCenter.emit('retryButton');
        });

        menuBtn.on('pointerdown', () => {
            eventsCenter.emit('menuButton');
        })

        // add a line below the buttons and     // TODO: Remove if not used
        //const lineYPos = retryBtn.y + retryBtn.displayHeight / 2 + gameOptions.gameHeight * 0.002;
        //this.add.line(0, 0, 0, lineYPos, gameOptions.gameWidth, lineYPos, gameOptions.textColor).setOrigin(0).setLineWidth(2);

    }

    // function which is executed when the level is started
    startLevel() {

        // activate all buttons
        this.flyBtn.activateBtn();
        this.speedBtn.activateBtn();
        this.shootBtn.activateBtn();

    }

}