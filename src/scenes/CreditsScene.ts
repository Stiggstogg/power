import Phaser from 'phaser';

import gameOptions from "../helper/gameOptions";

// "Credits" scene: Scene for the main game
export default class CreditsScene extends Phaser.Scene {

    // Constructor
    constructor() {
        super({
            key: 'Credits'
        });
    }

    /// Initialize parameters
    init(): void {

    }

    // Creates all objects of this scene
    create(): void {

        // fade in
        this.cameras.main.fadeIn(gameOptions.fadeInOutTime);

        this.add.bitmapText(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * 0.2, 'minogram', 'CREDITS', 50).setOrigin(0.5);

        const leftCredits = this.add.bitmapText(gameOptions.gameWidth * 0.25, gameOptions.gameHeight * 0.3, 'minogram',
            'Special thanks to my support and inspiration at home!\n\n' +
            'Thanks to my play testers.\n\n\n' +
            'Framework:\n' +
            'Code:\n' +
            'Bundler:\n' +
            'Graphics:\n' +
            'Music:\n' +
            'Sound effects:',
            10).setOrigin(0);

        this.add.bitmapText(leftCredits.x + gameOptions.gameWidth * 0.16, leftCredits.y, 'minogram',
            '\n\n' +
            '\n\n\n' +
            'Phaser 3\n' +
            'Home made typescript spaghetti code\n' +
            'vite.js\n' +
            '1-Bit Platformer Pack from Kenney\n' +
            'Home made noise played on my instruments\n' +
            'My vacuum cleaner (rocket) and sounds from Kenney',
            10).setOrigin(0);

        this.add.image(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * 0.39, 'spriteSheet', 365);

        const leftPerson = this.add.image(gameOptions.gameWidth * 0.74, gameOptions.gameHeight * 0.31, 'spriteSheet', 263);
        this.add.image(leftPerson.x + leftPerson.displayHeight, leftPerson.y, 'spriteSheet', 264);
        this.add.image(leftPerson.x + leftPerson.displayWidth / 2, leftPerson.y - leftPerson.displayHeight * 0.3, 'spriteSheet', 40).setOrigin(0.5, 1);

        // Add keyboard inputs
        this.addKeys();

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

        // touch and mouse
        this.input.once('pointerdown', () => {
            this.backToMenu();
        });

        // Enter and Space key
        this.input.keyboard?.addKey('ENTER').once('down', () => {
            this.backToMenu();
        });

        this.input.keyboard?.addKey('SPACE').once('down', () => {
            this.backToMenu();
        });

    }

    backToMenu() {

        // change back to menu (but first fade out)
        this.cameras.main.fadeOut(gameOptions.fadeInOutTime);

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