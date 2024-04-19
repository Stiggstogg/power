import Phaser from 'phaser';

import gameOptions from "../helper/gameOptions";
import {GameSceneData} from "../helper/interfaces";
import Player from "../sprites/Player";
import PowerUp from "../sprites/PowerUp";
import eventsCenter from "../helper/eventsCenter";

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private platforms!: Phaser.Tilemaps.TilemapLayer;
    private spikes!: Phaser.Physics.Arcade.StaticGroup;
    private player!: Player;
    private levelKey!: string;
    private powerUpGroup!: Phaser.GameObjects.Group;
    private gameData!: GameSceneData;
    private instructionText!: Phaser.GameObjects.BitmapText;
    private exit!: Phaser.Physics.Arcade.Image;
    private letsgo!: Phaser.GameObjects.Image;
    private letsgoText!: Phaser.GameObjects.BitmapText;

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
        //this.player.move();

        // setup event listeners
        this.setupEventListeners();

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

    // function which is executed when the level is ended (e.g. exit reached, exit reached of last level, retry, go back to menu
    endLevel(endType: string) {

        this.scene.stop('GameUI');                  // stop game ui scene

        switch (endType) {
            case 'exit': {                              // player reached the exit
                const newGameData: GameSceneData = {
                    level: this.gameData.level + 1,
                    attempts: this.gameData.attempts
                }

                if (newGameData.level > gameOptions.maxLevel) {          // last level

                    this.scene.start('Win', newGameData);

                }
                else {

                    this.scene.start('Game', newGameData);      // go to next level

                }
                break;
            }
            case 'retry': {                  // retry button was pressed
                this.scene.start('Game', this.gameData);
                break;
            }
            case 'menu': {                    // menu button was pressed
                this.scene.start('Home');
                break;
            }
        }

    }

    // setup game objects, e.g. player
    setupObjects(){

        // setup the player
        this.player = this.add.existing(new Player(this, gameOptions.playerStartPosition.x, gameOptions.playerStartPosition.y));            // create player
        this.cameras.main.startFollow(this.player, true, 1, 1, -gameOptions.gameWidth / 2 + 64, 0);     // make camera follow player
        this.physics.add.collider(this.player, this.platforms);                                                                             // setup collider with platforms

        // setup player collision with exit door
        this.physics.add.overlap(this.player, this.exit, () => {
            this.endLevel('exit');                                                                           // go to the next level when the player reaches the door
        });

        // setup player collision with spikes

        this.physics.add.overlap(this.player, this.spikes, () => {
            this.endLevel('retry');                                                                           // go to the next level when the player reaches the door
        });

        // setup the power up group
        this.powerUpGroup = this.add.group();

    }

    // setup the world parameters, camera, platforms and decorations
    setupWorld() {

        // get and create level
        const map = this.make.tilemap({key: this.levelKey});                                // create a tile map
        const tileSet = map.addTilesetImage('1BitPlatformer', 'tileSet')!;          // create a tileSet

        // platforms
        this.platforms = map.createLayer('platforms', tileSet)!;                                                 // create a new layer for the platforms
        this.platforms.setCollisionByProperty({collides: true});                                               // set collisions for the platforms

        // enemies
        const enemiesObjects: any = map.getObjectLayer('enemies')!.objects;
        this.spikes = this.physics.add.staticGroup();                                                                   // create a static spike group

        for (let i = 0; i < enemiesObjects.length; i++) {

            let spike = this.spikes.get(enemiesObjects[i].x, enemiesObjects[i].y, 'spriteSheet', 122);      // create a new spike
            spike.setOrigin(1);
            spike.refreshBody();
            spike.setSize(spike.displayWidth, spike.displayHeight * 0.5);
            spike.setOffset(0, spike.displayHeight * 0.5);
            spike.setTint(gameOptions.enemyColor);

        }

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
                this.instructionText = this.add.bitmapText(gameOptions.gameWidth * 0.02, gameOptions.gameHeight * 0.15, 'minogram', mapProperties[i].value,10);
                this.instructionText.setMaxWidth(gameOptions.gameWidth * 0.35);
                break;
            }
        }

        // set world boundaries to tile map size
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        // set the camera
        this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);     // set the camera boundaries (to the world size)

        // lets go button
        this.letsgo = this.add.image(gameOptions.gameWidth * 0.02, gameOptions.gameHeight * 0.62, 'letsgo').setOrigin(0);
        this.letsgo.setInteractive();

        this.letsgoText = this.add.bitmapText(this.letsgo.x + this.letsgo.displayWidth / 2, this.letsgo.y + this.letsgo.displayHeight / 2 + gameOptions.gameHeight * 0.01, 'minogram', 'Let\'s go!', 20).setOrigin(0.5);
        this.letsgoText.setTint(0x000000);

    }

    setupEventListeners() {

        // set spawn power up event (when button is pressed)
        eventsCenter.on('spawnPowerUp', (x: number, y: number, puType: string) => {
            this.createPowerUp(x, y, puType);
        });

        // set retry button event
        eventsCenter.once('retryButton', () => {
            this.endLevel('retry');
        });

        // set retry button event
        eventsCenter.once('menuButton', () => {
            this.endLevel('menu');
        });

        // turn off all events on shutdown
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventsCenter.off('spawnPowerUp');
            eventsCenter.off('powerUpPickedUp');
        });

        // setup event of lets go button
        this.letsgo.on('pointerdown', () => {
            this.player.move();
            this.letsgo.destroy();
        });

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