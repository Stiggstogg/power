import Phaser from 'phaser';

import gameOptions from "../helper/gameOptions";
import {GameSceneData} from "../helper/interfaces";
import Spawner from "../sprites/Spawner";
import eventsCenter from "../helper/eventsCenter";

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

        // pointer event
        this.input.on('pointerdown', () => {

           eventsCenter.emit('spawnPowerUp', this.spawner.x, this.spawner.y, 'playerJump');

        });

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

    }

}