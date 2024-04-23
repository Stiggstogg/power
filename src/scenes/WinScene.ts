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

        // fade in
        this.cameras.main.fadeIn(gameOptions.fadeInOutTime);

        // Show win text
        const wiggle = 20;

        const congratulations = this.add.bitmapText(gameOptions.gameWidth * 0.5 + wiggle, gameOptions.gameHeight * 0.15, 'minogram', 'CONGRATULATIONS!', 50).setOrigin(0.5).setMaxWidth(gameOptions.gameWidth * 0.6);

        this.tweens.add({
            targets: congratulations,
            duration: 800,
            x: congratulations.x - 2 * wiggle,
            repeat: -1,
            yoyo: true,
            ease: 'easInExpo',
            delay: 400
        });

        this.add.bitmapText(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * 0.5, 'minogram', 'You have powered-up to victory!', 30).setOrigin(0.5);

        // Show attempts:
        this.add.bitmapText(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * 0.75, 'minogram', 'Deaths: ' + this.gameData.attempts, 20).setOrigin(0.5);

        if (this.gameData.attempts == 0) {
            this.add.bitmapText(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * 0.85, 'minogram', 'WOW! This was a perfect game!', 20).setOrigin(0.5);
        }

        // setup dancers
        this.setupObjects();

        // Add keyboard inputs
        this.addKeys();

        // change back to menu (but first fade out)
        this.input.once('pointerdown', () => {
            this.cameras.main.fadeOut(gameOptions.fadeInOutTime);
        })

        // change back to the menu when faded out
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('Home');
        });

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

    setupObjects() {

        // player and you characters
        const xDist = 0.15;
        const yPos = 0.7;

        const player = this.add.sprite(gameOptions.gameWidth * xDist, gameOptions.gameHeight * yPos, 'spriteSheet', 304);
        player.setOrigin(0.5).setScale(4);
        player.play('player-dance2');

        const you = this.add.sprite(gameOptions.gameWidth * (1 - xDist), gameOptions.gameHeight * yPos, 'spriteSheet', 301);
        you.setOrigin(0.5).setScale(4);
        you.play('you-dance2');

    }

}