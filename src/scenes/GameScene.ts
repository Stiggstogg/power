import Phaser from 'phaser';

import gameOptions from "../helper/gameOptions";

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private platforms!: Phaser.Tilemaps.TilemapLayer;
    private player!: Phaser.GameObjects.Sprite;

    // Constructor
    constructor() {
        super({
            key: 'Game'
        });
    }

    /// Initialize parameters
    init(): void {

    }

    // Creates all objects of this scene
    create(): void {

        // setup world
        this.physics.world.bounds.width = gameOptions.gameWidth*2;
        this.physics.world.bounds.height = gameOptions.gameHeight;

        // set the camera
        this.cameras.main.setBounds(0, 0, gameOptions.gameWidth*2, gameOptions.gameHeight);       // set the camera boundaries (to the world size)

        // create map
        const map = this.make.tilemap({
            key: 'level1'
        });
        const tileSet = map.addTilesetImage('1-Bit Platformer', 'tileSet')!;
        this.platforms = map.createLayer('Platformen', tileSet)!;
        this.platforms.setCollisionByProperty({collides: true});

        // create player
        this.player = this.add.sprite(32, 150, 'player');
        this.cameras.main.startFollow(this.player, true, 1, 1, -gameOptions.gameWidth / 2 + 64, 0);

        // add physics
        //this.staticGroup = this.physics.add.staticGroup([this.floor1, this.floor2, this.floor3]);
        this.physics.add.existing(this.player, false);

        // setup collisions and overlap
        this.physics.add.collider(this.player, this.platforms);

        // set speed of player
        if ("setVelocityX" in this.player.body!) {
            this.player.body.setVelocityX(100);
        }

        // set pointer event
        this.input.on('pointerdown', () =>
        {

            // top spawner
            const spawnX = this.cameras.main.worldView.x + gameOptions.gameWidth / 2;
            const spawnY = gameOptions.gameHeight * 0.1;

            const powerUp = this.physics.add.sprite(spawnX, spawnY, 'powerup');

            this.physics.add.collider(powerUp, this.platforms);

            // top spawner
            if ("setVelocityX" in powerUp.body!) {
                powerUp.body.setVelocityX(-100);
            }

            this.physics.add.overlap(this.player, powerUp, () => {
                powerUp.destroy();
                if ("setVelocity" in this.player.body!) {
                    this.player.body.setVelocity(500, -1000);
                }
            });

        });

        // Add keyboard inputs
        this.addKeys();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

    }

    // Add keyboard input to the scene.
    addKeys(): void {


    }

}