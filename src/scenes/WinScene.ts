import Phaser from 'phaser';

import gameOptions from "../helper/gameOptions";
import {GameSceneData} from "../helper/interfaces";

// "Game" scene: Scene for the main game
export default class WinScene extends Phaser.Scene {

    private gameData!: GameSceneData;

    // Constructor
    constructor() {
        super({
            key: 'Win'
        });
    }

    /// Initialize parameters
    init(data: GameSceneData): void {

        this.gameData = data;

    }

    // Creates all objects of this scene
    create(): void {

        // Show win text
        this.add.bitmapText(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * 0.5, 'minogram', 'YOU WIN!', 30).setOrigin(0.5);

        // Show attempts:
        this.add.bitmapText(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * 0.7, 'minogram', 'Attempts: ' + this.gameData.attempts, 20).setOrigin(0.5);

        // Add keyboard inputs
        this.addKeys();

        // change back to menu
        this.input.on('pointerdown', () => {
            this.scene.start('Home');
        })

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

    }

    // Add keyboard input to the scene.
    addKeys(): void {



    }

    backToMenu() {

        console.log('go back to menu');         // TODO: Implement this

    }

}