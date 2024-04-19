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

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        this.spawner.update();

    }

    // Add keyboard input to the scene.
    addKeys(): void {

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
                    this.add.existing(new PowerUpBtn(this, gameOptions.gameWidth * 0.95, gameOptions.gameHeight * 0.35, 'Fly', mapProperties[i].value, this.spawner));
                    break;
                case 'speedNumber':
                    this.add.existing(new PowerUpBtn(this, gameOptions.gameWidth * 0.95, gameOptions.gameHeight * 0.6, 'Speed', mapProperties[i].value, this.spawner));
                    break;
                case 'shootNumber':
                    this.add.existing(new PowerUpBtn(this, gameOptions.gameWidth * 0.95, gameOptions.gameHeight * 0.85, 'Shoot', mapProperties[i].value, this.spawner));
                    break;
            }
        }

        // setup the level and attempts text
        const textYPos = 0.055;              // y position of the text elements
        const btnYPos = 0.053;              // y position of the buttons

        this.add.bitmapText(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * textYPos, 'minogram',
            'Level ' + this.gameData.level.toString() + '/' + gameOptions.maxLevel, 20).setOrigin(0.5, 0.5);

        this.add.bitmapText(gameOptions.gameWidth * 0.02, gameOptions.gameHeight * textYPos, 'minogram',
            'Attempts: ' + this.gameData.attempts.toString(), 20).setOrigin(0, 0.5);

        // setup the exit and retry button
        const retryBtn = this.add.image(gameOptions.gameWidth * 0.85, gameOptions.gameHeight * btnYPos, 'spriteSheet', 69).setScale(2).setOrigin(0.5).setInteractive();

        const menuBtn = this.add.image(gameOptions.gameWidth * 0.95, gameOptions.gameHeight * btnYPos, 'spriteSheet', 70).setScale(2).setOrigin(0.5).setInteractive();

        retryBtn.on('pointerdown', () => {
            eventsCenter.emit('retryButton');
        });

        menuBtn.on('pointerdown', () => {
            eventsCenter.emit('menuButton');
        })

        // add a line below the buttons and
        const lineYPos = retryBtn.y + retryBtn.displayHeight / 2 + gameOptions.gameHeight * 0.002;
        this.add.line(0, 0, 0, lineYPos, gameOptions.gameWidth, lineYPos, 0xffffff).setOrigin(0).setLineWidth(2);

    }

}