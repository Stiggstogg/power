import Phaser from 'phaser';
//import WebFontFile from "../helper/WebFontFile";
import gameOptions from "../helper/gameOptions";
import tileSetImg from "../assets/images/1-Bit-Platformer-Tileset.png";
import letsgoImg from "../assets/images/letsgo.png";

// levels
import level1JSON from "../assets/levels/Level1.json";
//import level2JSON from "../assets/levels/Level2.json";

// fonts
import minogramPNG from "../assets/fonts/minogram_6x10.png";         // from here: https://frostyfreeze.itch.io/pixel-bitmap-fonts-png-xml (CC0 licensed)
// @ts-ignore: Suppress this TS error message, as in vite the config (assetsInclude: ['**/*.xml']) is setup in a way that xml files are handled as static assets
import minogramXML from "../assets/fonts/minogram_6x10.xml";

// "Loading" scene: Loads all assets and shows a progress bar while loading
export default class LoadingScene extends Phaser.Scene {

    // constructor
    constructor() {

        super({
            key: 'Loading'
        });

    }

    // Initialize parameters
    init(): void {

    }

    // Load all assets (for all scenes)
    preload(): void {

        // show logo
        this.add.sprite(gameOptions.gameWidth/2, gameOptions.gameHeight/2, 'logo').setScale(0.5); // logo is already preloaded in 'Boot' scene

        // text
        this.add.text(gameOptions.gameWidth/2, gameOptions.gameHeight * 0.20, 'CLOWNGAMING', {fontSize: '70px', color: '#FFFF00', fontStyle: 'bold'}).setOrigin(0.5);
        this.add.text(gameOptions.gameWidth/2, gameOptions.gameHeight * 0.8, 'Loading...', {fontSize: '30px', color: '#27FF00'}).setOrigin(0.5);

        // progress bar background (e.g grey)
        const bgBar = this.add.graphics();
        const barW = gameOptions.gameWidth * 0.5;            // progress bar width
        const barH = barW * 0.05;          // progress bar height
        const barX = gameOptions.gameWidth / 2 - barW / 2;       // progress bar x coordinate (origin is 0, 0)
        const barY = gameOptions.gameHeight * 0.9 - barH / 2   // progress bar y coordinate (origin is 0, 0)
        bgBar.setPosition(barX, barY);
        bgBar.fillStyle(0xF5F5F5, 1);
        bgBar.fillRect(0, 0, barW, barH);    // position is 0, 0 as it was already set with ".setPosition()"

        // progress bar
        const progressBar = this.add.graphics();
        progressBar.setPosition(barX, barY);

        // listen to the 'progress' event (fires every time an asset is loaded and 'value' is the relative progress)
        this.load.on('progress', function(value: number) {

            // clearing progress bar (to draw it again)
            progressBar.clear();

            // set style
            progressBar.fillStyle(0x27ff00, 1);

            // draw rectangle
            progressBar.fillRect(0, 0, value * barW, barH);

        }, this);

        // load images
        this.load.image('letsgo', letsgoImg);

        // load tile set image
        this.load.image('tileSet', tileSetImg);

        // load level tile maps (Tiled in JSON format)
        const levelArray = [            // put in here all the paths to the level json files
            level1JSON,
            //level2JSON
        ];

        gameOptions.maxLevel = levelArray.length;           // set the number of maximum levels

        for (let i = 0; i < levelArray.length; i++) {
            this.load.tilemapTiledJSON('Level ' + (i + 1).toString(), levelArray[i]);     // load each level
        }

        // load audio
        //this.load.audio('miss', 'assets/audio/Pew.mp3');

        // load sprite sheet
        this.load.spritesheet('spriteSheet', tileSetImg, {frameWidth: 16, frameHeight: 16, spacing: 1});

        // load fonts (with "webfontloader")
        //this.load.addFile(new WebFontFile(this.load, 'Orbitron'));
        //this.load.addFile(new WebFontFile(this.load, 'Kenney Pixel', 'custom'));

        this.load.bitmapFont('minogram', minogramPNG, minogramXML);

    }

    // Add the animations and change to "Home" scene, directly after loading
    create() {

        this.createAnimations();
        this.scene.start('Home');
        //this.scene.start('Game', {level: 1, attempts: 0});

    }

    // create animations
    createAnimations() {

        // player animations
        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNames('spriteSheet', {frames: [240]}),
            frameRate: 0
        });

        this.anims.create({
            key: 'player-run',
            frames: this.anims.generateFrameNames('spriteSheet', {frames: [241, 242, 241, 243]}),
            frameRate: 10,
            yoyo: false,
            repeat: -1
        });

        this.anims.create({
            key: 'player-jump',
            frames: this.anims.generateFrameNames('spriteSheet', {frames: [244]}),
            frameRate: 0
        });

    }

}