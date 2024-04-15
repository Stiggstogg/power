import Phaser from 'phaser';

import gameOptions from "../helper/gameOptions";
import {GameSceneData} from "../helper/interfaces";
import Player from "../sprites/Player";
import PowerUp from "../sprites/PowerUp";
import eventsCenter from "../helper/eventsCenter";

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private platforms!: Phaser.Tilemaps.TilemapLayer;
    private player!: Player;
    private levelKey!: string;
    private powerUpGroup!: Phaser.GameObjects.Group;
    private gameData!: GameSceneData;

    // Constructor
    constructor() {
        super({
            key: 'Game'
        });
    }

    /// Initialize parameters
    init(data: GameSceneData): void {

        this.levelKey = 'level' + data.level.toString();        // generate level key
        this.gameData = data;

    }

    // Creates all objects of this scene
    create(): void {

        // start UI scene
        this.scene.launch('GameUI', this.gameData);

        // setup world
        this.setupWorld();

        // setup objects
        this.setupObjects();

        // let player move
        this.player.move();

        // set spawn power up event
        eventsCenter.on('spawnPowerUp', (x: number, y: number, effect: string) => {
           this.createPowerUp(x, y, effect);
        });

        // Add keyboard inputs
        this.addKeys();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        this.player.update();

        this.powerUpGroup.getChildren().forEach((powerUp) => {
            powerUp.update();
        });

    }

    // Add keyboard input to the scene.
    addKeys(): void {


    }

    // setup game objects, e.g. player
    setupObjects(){

        // setup the player
        this.player = this.add.existing(new Player(this, gameOptions.playerStartPosition.x, gameOptions.playerStartPosition.y));            // create player
        this.cameras.main.startFollow(this.player, true, 1, 1, -gameOptions.gameWidth / 2 + 64, 0);     // make camera follow player
        this.physics.add.collider(this.player, this.platforms);                                                                             // setup collider with platforms

        // setup the power up group
        this.powerUpGroup = this.add.group();

    }

    // setup the world parameters, camera, platforms and decorations
    setupWorld() {

        // get and create level
        const map = this.make.tilemap({key: this.levelKey});                                // create a tile map
        const tileSet = map.addTilesetImage('1BitPlatformer', 'tileSet')!;          // create a tileSet

        map.createLayer('decorations', tileSet);                                                                 // create a new layer for the decorations

        this.platforms = map.createLayer('platforms', tileSet)!;                                                 // create a new layer for the platforms
        this.platforms.setCollisionByProperty({collides: true});                                               // set collisions for the platforms

        // set world boundaries to tile map size
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        // set the camera
        this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);     // set the camera boundaries (to the world size)

    }

    // create power up
    createPowerUp(x: number, y: number, effect: string) {

        // calculate from screen coordinates to world coordinates
        const worldX = this.cameras.main.worldView.x + x + gameOptions.spawnerPowerUpOffset.x;
        const worldY = this.cameras.main.worldView.y + y + gameOptions.spawnerPowerUpOffset.y;

        // create power Up
        const powerUp = this.add.existing(new PowerUp(this, worldX, worldY, effect));

        // setup collision with platforms
        this.physics.add.collider(powerUp, this.platforms);

        // setup pick up by a player
        this.physics.add.overlap(this.player, powerUp, () => {
            powerUp.pickedUp();
        });

        this.powerUpGroup.add(powerUp);

    }

}