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
    private instructionText!: Phaser.GameObjects.BitmapText;
    private exit!: Phaser.Physics.Arcade.Image;

    // Constructor
    constructor() {
        super({
            key: 'Game'
        });
    }

    /// Initialize parameters
    init(data: GameSceneData): void {

        this.levelKey = 'Level ' + data.level.toString();        // generate level key
        this.gameData = data;

    }

    // Creates all objects of this scene
    create(): void {

        // increase the number of attempts
        this.gameData.attempts++;

        // start UI scene
        this.scene.launch('GameUI', this.gameData);

        // setup world
        this.setupWorld();

        // setup objects
        this.setupObjects();

        // let player move
        this.player.move();

        // set spawn power up event (when button is pressed)
        eventsCenter.on('spawnPowerUp', (x: number, y: number, puType: string) => {
           this.createPowerUp(x, y, puType);
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

    nextLevel() {

        // create the game data for the next level
        const newGameData: GameSceneData = {
            level: this.gameData.level + 1,
            attempts: this.gameData.attempts
        }

        if (this.gameData.level >= gameOptions.maxLevel) {

            this.scene.stop('GameUI');                  // stop game ui scene
            this.scene.start('Win', newGameData);       // show win screen

        }
        else {

            this.scene.stop('GameUI');                  // stop game ui scene
            this.scene.start('Game', newGameData);      // go to next level

        }

    }

    // setup game objects, e.g. player
    setupObjects(){

        // setup the player
        this.player = this.add.existing(new Player(this, gameOptions.playerStartPosition.x, gameOptions.playerStartPosition.y));            // create player
        this.cameras.main.startFollow(this.player, true, 1, 1, -gameOptions.gameWidth / 2 + 64, 0);     // make camera follow player
        this.physics.add.collider(this.player, this.platforms);                                                                             // setup collider with platforms

        // setup the power up group
        this.powerUpGroup = this.add.group();

        // setup collision with exit door
        this.physics.add.overlap(this.player, this.exit, () => {
            this.nextLevel();                                                                           // go to the next level when the player reaches the door
        });

    }

    // setup the world parameters, camera, platforms and decorations
    setupWorld() {

        // get and create level
        const map = this.make.tilemap({key: this.levelKey});                                // create a tile map
        const tileSet = map.addTilesetImage('1BitPlatformer', 'tileSet')!;          // create a tileSet

        // platforms
        this.platforms = map.createLayer('platforms', tileSet)!;                                                 // create a new layer for the platforms
        this.platforms.setCollisionByProperty({collides: true});                                               // set collisions for the platforms

        // exit
        const exitObjectLayer: any = map.getObjectLayer('exit');
        const exitObject = exitObjectLayer.objects[0];                                                                  // get exit object from object layer
        this.exit = this.physics.add.image(exitObject.x, exitObject.y, 'spriteSheet', 58).setOrigin(1);  // add the exit image

        this.exit.setSize(this.exit.displayWidth * 0.2, this.exit.displayHeight);                                 // change the position of the body, so that the collision with the player is only triggered at the right side of the door
        this.exit.setOffset(this.exit.displayWidth * 0.8, 0);

        this.physics.add.collider(this.exit, this.platforms);                                                           // exit needs to collide with the platforms

        // add the instruction text
        const mapProperties: any = map.properties;      // get the map properties (it is an array, but for simplicity and to avoid type errors I just used "any")

        for (let i = 0; i < mapProperties.length; i++) {
            if (mapProperties[i].name == 'instructions') {
                this.instructionText = this.add.bitmapText(gameOptions.gameWidth * 0.05, gameOptions.gameHeight * 0.1, 'minogram', mapProperties[i].value,10);
                this.instructionText.setMaxWidth(gameOptions.gameWidth * 0.2);
                break;
            }
        }

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
        const powerUp = this.add.existing(new PowerUp(this, worldX, worldY, effect, this.player));

        // setup collision with platforms
        this.physics.add.collider(powerUp, this.platforms);

        // setup pick up by a player
        this.physics.add.overlap(this.player, powerUp, () => {
            powerUp.pickedUp();
        });

        this.powerUpGroup.add(powerUp);

    }

}