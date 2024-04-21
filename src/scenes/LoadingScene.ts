import Phaser from 'phaser';
//import WebFontFile from "../helper/WebFontFile";
import gameOptions from "../helper/gameOptions";

// images
import tileSetImg from "../assets/images/1-Bit-Platformer-Tileset.png";
import particleImg from "../assets/images/particle.png";

// audio
import spawnSnd from "../assets/sounds/impactPlank_medium_003.ogg";
import flySnd from "../assets/sounds/engine-loud.mp3";
import speedSnd from "../assets/sounds/footstep_carpet_004.ogg";
import deadSnd from "../assets/sounds/explosion4.ogg";
import pickupSnd from "../assets/sounds/pickup2.ogg";
import winSnd from "../assets/sounds/jingles-retro_02.ogg";


// levels
import level1JSON from "../assets/levels/Level1.json";
import level2JSON from "../assets/levels/Level2.json";
import level3JSON from "../assets/levels/Level3.json";
import level4JSON from "../assets/levels/Level4.json";
import level5JSON from "../assets/levels/Level5.json";
import level6JSON from "../assets/levels/Level6.json";

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
        this.load.image('particle', particleImg);

        // load tile set image
        this.load.image('tileSet', tileSetImg);

        // load level tile maps (Tiled in JSON format)
        const levelArray = [            // put in here all the paths to the level json files
            level1JSON,
            level2JSON,
            level3JSON,
            level4JSON,
            level5JSON,
            level6JSON,
        ];

        gameOptions.maxLevel = levelArray.length;           // set the number of maximum levels

        for (let i = 0; i < levelArray.length; i++) {
            this.load.tilemapTiledJSON('Level ' + (i + 1).toString(), levelArray[i]);     // load each level
        }

        // load audio
        this.load.audio('spawn', spawnSnd);
        this.load.audio('fly', flySnd);
        this.load.audio('speed', speedSnd);
        this.load.audio('dead', deadSnd);
        this.load.audio('pickup', pickupSnd);
        this.load.audio('win', winSnd);

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
        //this.scene.start('Home');                         // TODO: change back to this at the end
        this.scene.start('Home', {level: 4, attempts: 0});

    }

    // create animations
    createAnimations() {

        // player animations

        // create blinikng array for idle
        let noBlinking: number[] = Array(23).fill(240);
        let blinking = [262];

        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNames('spriteSheet', {frames: blinking.concat(noBlinking, blinking)}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'player-run',
            frames: this.anims.generateFrameNames('spriteSheet', {frames: [241, 242, 241, 243]}),
            frameRate: 10,
            yoyo: false,
            repeat: -1
        });

        this.anims.create({
            key: 'player-fly-up',
            frames: this.anims.generateFrameNames('spriteSheet', {frames: [260]}),
            frameRate: 0,
        });

        this.anims.create({
            key: 'player-fly-down',
            frames: this.anims.generateFrameNames('spriteSheet', {frames: [244]}),
            frameRate: 0
        });

        this.anims.create({
            key: 'player-speed',
            frames: this.anims.generateFrameNames('spriteSheet', {frames: [241, 242, 241, 243]}),
            frameRate: 20,
            yoyo: false,
            repeat: -1
        });

        // you
        noBlinking = Array(33).fill(285);
        blinking = [300];

        this.anims.create({
            key: 'you-idle',
            frames: this.anims.generateFrameNames('spriteSheet', {frames: blinking.concat(noBlinking, blinking)}),
            frameRate: 10,
            repeat: -1,
            yoyo: false
        });

        // bat
        this.anims.create({
            key: 'batEnemy-idle',
            frames: this.anims.generateFrameNames('spriteSheet', {frames: [383, 384]}),
            frameRate: 10,
            repeat: -1
        });

    }

}