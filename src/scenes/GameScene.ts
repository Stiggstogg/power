import Phaser from 'phaser';

import gameOptions from "../helper/gameOptions";
import {GameSceneData} from "../helper/interfaces";
import Player from "../sprites/Player";
import PowerUp from "../sprites/PowerUp";
import eventsCenter from "../helper/eventsCenter";
import Enemy from "../sprites/Enemy";

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private platforms!: Phaser.Tilemaps.TilemapLayer;
    private enemies!: Phaser.GameObjects.Group;
    private player!: Player;
    private levelKey!: string;
    private powerUpGroup!: Phaser.GameObjects.Group;
    private gameData!: GameSceneData;
    private instructionText!: Phaser.GameObjects.BitmapText;
    private exit!: Phaser.Physics.Arcade.Image;
    private endType!: string;

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

        // start UI scene
        this.scene.launch('GameUI', this.gameData);

        // fade in
        this.cameras.main.fadeIn(gameOptions.fadeInOutTime);

        // setup world
        this.setupWorld();

        // setup objects
        this.setupObjects();

        // setup arrows for you and player (only in first level)
        if (this.gameData.level == 1) {
            this.setupArrows();
        }

        // setup event listeners
        this.setupEventListeners();

        // Add keyboard inputs
        this.addKeys();

        // setup sounds
        this.setupSounds();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        // update player (but only if both body and player are defined)
        if (typeof this.player !== 'undefined' && typeof this.player.body !== 'undefined') {
            this.player.update();
        }

        // update power ups
        this.powerUpGroup.getChildren().forEach((powerUp) => {
                powerUp.update();
        });

        // update bat enemies
        this.enemies.getChildren().forEach((enemy) => {
            enemy.update();
        });

    }

    // Add keyboard input to the scene.
    addKeys(): void {

        // add keyboard controls
        this.input.keyboard?.addKey('ENTER').once('down', () => {
            this.startLevel();
        });

        this.input.keyboard?.addKey('SPACE').once('down', () => {
            this.startLevel();
        });

    }

    // function which is executed when the level is ended (e.g. exit reached, exit reached of last level, retry, go back to menu
    endLevel(endType: string) {

        eventsCenter.emit('sceneFadeout');                     // emits the fadeout event so that the game UI can also fade out

        this.endType = endType;                                     // write the end type for the cleanup level scene

        this.cameras.main.fadeOut(gameOptions.fadeInOutTime);       // fade out the scene (this will trigger the cleanupLevel() method as soon as it is fully faded out

    }

    cleanupLevel() {

        this.scene.stop('GameUI');                  // stop game ui scene

        switch (this.endType) {
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
                this.gameData.attempts++;       // // increase the number of attempts (Deaths)
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
            this.sound.play('win', {volume: gameOptions.volumeWin});                                                         // play the win sound

            this.add.particles(this.cameras.main.worldView.x + gameOptions.gameWidth, this.cameras.main.worldView.y + gameOptions.gameHeight, 'particle',{      // play fireworks
                color: [0xffffff],
                lifespan: gameOptions.fadeInOutTime,
                alpha: {min: 0, max: 1},
                angle: {min: 180, max: 270},
                scale: {start: 1, end: 10},
                speed: {min: 700, max: 1000},
                quantity: 20,
                emitting: true,
                stopAfter: 200
            });

            this.player.end(false);
            this.endLevel('exit');                                                                           // go to the next level when the player reaches the door
        });

        // setup player collision with enemies
        this.physics.add.overlap(this.player, this.enemies, () => {

            this.player.end(true);

            // destroy all powerups as they otherwise create an error (because they rely on the player to be defined)
            this.powerUpGroup.getChildren().forEach((powerUp) => {
                powerUp.destroy();
            });

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

        // decorations
        map.createLayer('decorations', tileSet)!.setTint(gameOptions.inactiveColor);

        // platforms
        this.platforms = map.createLayer('platforms', tileSet)!;                                                 // create a new layer for the platforms
        this.platforms.setCollisionByProperty({collides: true});                                               // set collisions for the platformsg

        // enemies
        const enemiesObjects: any = map.getObjectLayer('enemies')!.objects;
        this.enemies = this.add.group();

        for (let i = 0; i < enemiesObjects.length; i++) {
            this.enemies.add(this.add.existing(new Enemy(this, enemiesObjects[i].x, enemiesObjects[i].y, enemiesObjects[i].type)));
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
                this.instructionText = this.add.bitmapText(gameOptions.gameWidth * 0.02, gameOptions.gameHeight * 0.20, 'minogram', mapProperties[i].value,10);
                this.instructionText.setMaxWidth(gameOptions.gameWidth * 0.35);
                this.instructionText.setTint(gameOptions.textColor);
                break;
            }
        }

        // set world boundaries to tile map size
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        // set the camera
        this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);     // set the camera boundaries (to the world size)

    }

    setupEventListeners() {

        // set start event (click anywhere on the screen)
        this.input.once('pointerdown', () => {
            this.startLevel();
        });

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

        // trigger the cleanuplevel method when the fadeout is finished
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.cleanupLevel();
        });

        // turn off all event listeners on shutdown
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventsCenter.removeAllListeners();
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

        this.sound.get('spawn').play({volume: gameOptions.volumeSpawn});

    }

    // start the level
    startLevel() {

        // start the movement on the player
        this.player.move();

        // remove the instructions text
        this.instructionText.destroy();

        // emit the event that the level is started (for the UI scene to activate buttons)
        eventsCenter.emit('startLevel');

    }

    // setup sounds
    setupSounds() {

        // sound when spawning a new powerup
        const spawnSound = this.sound.get('spawn');
        if (spawnSound == null) {        // add it to the sound manager if it isn't yet available
            this.sound.add('spawn');
        }

        // sound when rocket is activated
        const flySound = this.sound.get('fly');
        if (flySound == null) {        // add it to the sound manager if it isn't yet available
            this.sound.add('fly', {loop: true});
        }

        // sound when speed is activated
        const speedSound = this.sound.get('speed');
        if (speedSound == null) {        // add it to the sound manager if it isn't yet available
            this.sound.add('speed', {loop: true});
        }

        // sound when speed is activated
        const pickupSound = this.sound.get('pickup');
        if (pickupSound == null) {        // add it to the sound manager if it isn't yet available
            this.sound.add('pickup');
        }

        // sound when speed is activated
        const deadSound = this.sound.get('dead');
        if (deadSound == null) {        // add it to the sound manager if it isn't yet available
            this.sound.add('dead');
        }

        // sound when the level was completed
        const winSound = this.sound.get('win');
        if (winSound == null) {        // add it to the sound manager if it isn't yet available
            this.sound.add('win');
        }

        // stop all looped sounds when the scene is shutdown
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.sound.get('fly').stop();
            this.sound.get('speed').stop();
        });

    }

    // setup arrows and description for first level
    setupArrows() {

        // arrow and text for you
        const arrowMovement = gameOptions.gameWidth * 0.02;

        const arrowYou = this.add.sprite(gameOptions.gameWidth * 0.55, gameOptions.gameHeight * 0.2, 'spriteSheet', 92);
        const nameYou = this.add.bitmapText(arrowYou.x + gameOptions.gameWidth * 0.015, arrowYou.y + gameOptions.gameHeight * 0.005, 'minogram' , 'YOU').setOrigin(0, 0.5);

        this.tweens.add({
            targets: arrowYou,
            duration: 500,
            x: arrowYou.x - arrowMovement,
            repeat: -1,
            yoyo: true,
            ease: 'easeOutQuint'
        });

        // arrow and text for player
        const arrowPlayer = this.add.sprite(gameOptions.gameWidth * 0.15, gameOptions.gameHeight * 0.82, 'spriteSheet', 92);
        const namePlayer = this.add.bitmapText(arrowPlayer.x + gameOptions.gameWidth * 0.015, arrowPlayer.y + gameOptions.gameHeight * 0.005, 'minogram' , 'PLAYER').setOrigin(0, 0.5);

        // add tweens

        this.tweens.add({
            targets: arrowPlayer,
            duration: 500,
            x: arrowPlayer.x - arrowMovement,
            repeat: -1,
            yoyo: true,
            ease: 'easeOutQuint'
        });

        // remove when the level starts
        eventsCenter.once('startLevel', () => {
            arrowYou.destroy();
            nameYou.destroy();
            arrowPlayer.destroy();
            namePlayer.destroy();
        });

    }

}