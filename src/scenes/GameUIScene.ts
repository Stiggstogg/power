import Phaser from 'phaser';

import gameOptions from "../helper/gameOptions";
import {GameSceneData} from "../helper/interfaces";
import Spawner from "../sprites/Spawner";
import PowerUpBtn from "../sprites/PowerUpBtn";

// "Game" scene: Scene for the main game
export default class GameUIScene extends Phaser.Scene {

    private spawner!: Spawner
    private levelKey!: string;

    // Constructor
    constructor() {
        super({
            key: 'GameUI'
        });
    }

    /// Initialize parameters
    init(data: GameSceneData): void {

        this.levelKey = 'level' + data.level.toString();        // generate level key
        console.log(this.levelKey);                             // TODO: Remove later, was only added to not have an "unused variable" error

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
                    this.add.existing(new PowerUpBtn(this, gameOptions.gameWidth * 0.9, gameOptions.gameHeight * 0.25, 'Fly', mapProperties[i].value, this.spawner));
                    break;
                case 'speedNumber':
                    this.add.existing(new PowerUpBtn(this, gameOptions.gameWidth * 0.9, gameOptions.gameHeight * 0.5, 'Speed', mapProperties[i].value, this.spawner));
                    break;
                case 'shootNumber':
                    this.add.existing(new PowerUpBtn(this, gameOptions.gameWidth * 0.9, gameOptions.gameHeight * 0.75, 'Shoot', mapProperties[i].value, this.spawner));
                    break;
            }
        }

    }

}