import Phaser from 'phaser';

import Sponge from '../sprites/Sponge'
import gameOptions from "../helper/gameOptions";

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private floor1!: Phaser.GameObjects.TileSprite;
    private floor2!: Phaser.GameObjects.TileSprite;
    private player!: Phaser.GameObjects.Sprite;
    private staticGroup!: Phaser.Physics.Arcade.StaticGroup;

    // Constructor
    constructor() {
        super({
            key: 'Game'
        });
    }

    /// Initialize parameters
    init(): void {

    }

    // load assets
    preload(): void {

    }

    // Creates all objects of this scene
    create(): void {

        // setup world
        this.physics.world.bounds.width = gameOptions.gameWidth*2;
        this.physics.world.bounds.height = gameOptions.gameHeight;

        // set the camera
        this.cameras.main.setBounds(0, 0, gameOptions.gameWidth*2, gameOptions.gameHeight);       // set the camera boundaries (to the world size)

        // create floor
        this.floor1 = this.add.tileSprite(0, 476, 1140, 64, 'spritesheet',0).setOrigin(0);
        this.floor2 = this.add.tileSprite(1340, 476, 940, 64, 'spritesheet',0).setOrigin(0);

        // create player
        this.player = this.add.sprite(50, 350, 'spritesheet', 1);

        this.cameras.main.startFollow(this.player, false, 1, 1, -gameOptions.gameWidth / 2 + 64, 0);

        // add physics
        this.staticGroup = this.physics.add.staticGroup([this.floor1, this.floor2]);
        this.physics.add.existing(this.player, false);

        // setup collisions and overlap
        this.physics.add.collider(this.player, this.staticGroup);

        // set speed of player and disable physics for powerup
        this.player.body.setVelocityX(100);

        // Add keyboard inputs
        this.addKeys();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

    }

    // Add keyboard input to the scene.
    addKeys(): void {

        this.input.keyboard!.addKey('Space').on('down', function(this: GameScene) {
            this.spaceEnterKey()
        }, this);

    }

    // Action which happens when the enter or space key is pressed.
    spaceEnterKey(): void {

        const spawnposition = this.cameras.main.worldView.x + gameOptions.gameWidth / 2;

        const powerup = this.add.sprite(spawnposition, 50, 'spritesheet', 2);
        this.physics.add.existing(powerup, false);

        powerup.body.setVelocityX(-100);

        this.physics.add.collider(powerup, this.staticGroup);
        this.physics.add.overlap(this.player, powerup, () => {
            powerup.destroy();
            this.player.body.setVelocity(500,-1000);
        });


    }

}