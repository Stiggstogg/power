import Phaser from 'phaser';
import gameOptions from "../helper/gameOptions";
import {GameSceneData} from "../helper/interfaces";

// "Home" scene: Main game menu scene
export default class HomeScene extends Phaser.Scene {

    private title!: Phaser.GameObjects.BitmapText;
    private titleText!: string;
    private menuEntries!: string[];
    private selected!: number;
    private items!: Phaser.GameObjects.BitmapText[];
    private destinationScene!: string;
    private gameSceneData!: GameSceneData;
    private rocket!: Phaser.Physics.Arcade.Sprite;
    private speed!: Phaser.Physics.Arcade.Sprite;

    // Constructor
    constructor() {
        super({
            key: 'Home'
        });
    }

    // Initialize parameters
    init(): void {

        // title text
        this.titleText = 'POWER-UP ADVENTURE';

        // menu entries
        this.menuEntries = [
            'Play',
            'Credits'
        ];

        // initialize empty parameters
        this.selected = 0;
        this.items = [];

    }

    // Shows the home screen and waits for the user to select a menu entry
    create(): void {

        // fade in
        this.cameras.main.fadeIn(gameOptions.fadeInOutTime);

        // change the scene when the fade out is complete
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(this.destinationScene, this.gameSceneData);
        });

        // initialize parameters
        this.destinationScene = 'Game';
        this.gameSceneData = {level: 1, attempts: 0};

        // Title
        const wiggle = 20;

        this.title = this.add.bitmapText(gameOptions.gameWidth / 2 + wiggle, gameOptions.gameHeight * 0.2, 'minogram', this.titleText, 50).setOrigin(0.5, 0.5);

        this.tweens.add({
            targets: this.title,
            duration: 800,
            x: this.title.x - 2 * wiggle,
            repeat: -1,
            yoyo: true,
            ease: 'easInExpo',
            delay: 400
        });

        // Create the menu with its entries
        this.createMenu(this.menuEntries);

        // setup music and start it (if not already playing)
        this.setupMusic();

        // setup dancers
        this.setupObjects();

        // Add keyboard inputs
        this.addKeys();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        if (this.rocket.x < - this.rocket.displayWidth) {
            this.rocket.x = gameOptions.gameWidth;
        }

        if (this.speed.x < - this.speed.displayWidth) {
            this.speed.x = gameOptions.gameWidth;
        }

    }


    // Creates the menu with its entries, sets the styles for it and adds the mouse events
    createMenu(menuEntries: string[]): void {

        // start position and y space between the entries
        const start = {x: gameOptions.gameWidth / 2, y: this.title.y + gameOptions.gameHeight * 0.25};      // start position
        const ySpace = gameOptions.gameHeight * 0.2;                                         // ySpace between the entries

        // create menu items (loop through each item)
        for (let i = 0;i < menuEntries.length; i++) {

            const item = this.add.bitmapText(start.x, start.y + i * ySpace, 'minogram' , menuEntries[i], 30).setOrigin(0.5);

            item.setInteractive();          // set interactive

            item.on(Phaser.Input.Events.POINTER_OVER, function(this: HomeScene) : void {        // set event action for mouse over (selecting it)
                this.selectSpecific(i);
            }, this);

            item.on(Phaser.Input.Events.POINTER_DOWN, function(this: HomeScene) : void {        // set event action for pointer down (clicking it with the mouse)
                this.selectSpecific(i);          // select the entry (if not already)
                this.spaceEnterKey();           // click it
            }, this);

            this.items.push(item);
        }

        this.highlightSelected();         // highlight the selected entry

    }

    // Select the next menu entry (when clicking down)
    selectNext(): void {

        // select the next, or if it is the last entry select the first again
        if (this.selected >= this.items.length - 1) {
            this.selected = 0;              // select the first entry
        }
        else {
            this.selected++;                // select the previous entry
        }

        // highlight the selected entry
        this.highlightSelected();

    }

    // Select the previous menu entry (when clicking up)
    selectPrevious(): void {

        // select the previous, or if it is the first entry select the last again
        if (this.selected <= 0) {
            this.selected = this.items.length -1;   // select the last entry
        }
        else {
            this.selected--;                        // select the previous entry
        }

        // highlight the selected entry
        this.highlightSelected();

    }

    // Select specific menu entry (when moving with the mouse over it)
    selectSpecific(itemIndex: number): void {

        this.selected = itemIndex;

        // highlight the selected entry
        this.highlightSelected();

    }

     // Highlights the selected entry (changing the styles of the deselected and selected entries)
    highlightSelected(): void {

        for (let i in this.items) {
            this.items[i].setTint(gameOptions.inactiveColor);         // change the style of all entries to the inactive style
            this.items[i].setFontSize(30);
            this.items[i].input!.hitArea.setTo(0, 0, this.items[i].width, this.items[i].height);      // reset the hit area
        }

        this.items[this.selected].clearTint();   // change the style of the selected entry to the active style
        this.items[this.selected].setFontSize(40);
        this.items[this.selected].input!.hitArea.setTo(0, 0, this.items[this.selected].width, this.items[this.selected].height);      // reset the hit area

    }

     // Add keyboard input to the scene.
    addKeys(): void {

        // up and down keys (moving the selection of the entries)
        this.input.keyboard!.addKey('Down').on('down', function(this: HomeScene) { this.selectNext() }, this);
        this.input.keyboard!.addKey('S').on('down', function(this: HomeScene) { this.selectNext() }, this);
        this.input.keyboard!.addKey('Up').on('down', function(this: HomeScene) { this.selectPrevious() }, this);
        this.input.keyboard!.addKey('W').on('down', function(this: HomeScene) { this.selectPrevious() }, this);

        // enter and space key (confirming a selection)
        this.input.keyboard!.addKey('Enter').on('down', function(this: HomeScene) { this.spaceEnterKey() }, this);
        this.input.keyboard!.addKey('Space').on('down', function(this: HomeScene) { this.spaceEnterKey() }, this);

    }

    // Action which happens when the enter or space key is pressed.
    spaceEnterKey() {

        switch(this.selected) {
            case 0:                 // start the game when the first entry is selected ("Start")
                this.destinationScene = 'Game';                 // set destination scene
                this.gameSceneData = {level: 1, attempts: 0};   // set game scene data

                break;
            case 1:                 // start the "Howto" scene when the "How To Play" entry is selected
                this.destinationScene = 'Credits';                 // set destination scene
                this.gameSceneData = {level: 1, attempts: 0};   // set game scene data
                break;
        }

        this.cameras.main.fadeOut(gameOptions.fadeInOutTime);   // trigger the fade out, which will then trigger the scene change when finished.

    }

    setupMusic() {

        // setup music
        const musicSound = this.sound.get('music');

        if (musicSound == null) {        // add it to the sound manager if it isn't yet available
            this.sound.add('music');
        }


        // setup music
        if (!this.sound.get('music').isPlaying) {
            this.sound.get('music').play({volume: gameOptions.volumeMusic, loop: true});
        }

    }

    setupObjects() {

        // player and you characters

        const xDist = 0.2;
        const yPos = 0.52;

        const player = this.add.sprite(gameOptions.gameWidth * xDist, gameOptions.gameHeight * yPos, 'spriteSheet', 320);
        player.setOrigin(0.5).setScale(4);
        player.play('player-dance');

        const you = this.add.sprite(gameOptions.gameWidth * (1 - xDist), gameOptions.gameHeight * yPos, 'spriteSheet', 322);
        you.setOrigin(0.5).setScale(4);
        you.play('you-dance');

        // power-ups and floor
        const floorScale = 3;
        const powerUpDistance = 0.5; // relative to game width
        const powerUpSpeed = -150;

        const floor = this.add.existing(new Phaser.GameObjects.TileSprite(this, -gameOptions.gameWidth * 0.5, gameOptions.gameHeight * 1.05, gameOptions.gameWidth * 2 / floorScale, 12, 'spriteSheet', 111));
        floor.setOrigin(0, 1);
        floor.setScale(3);
        this.physics.add.existing(floor, true);

        this.rocket = this.physics.add.sprite(gameOptions.gameWidth, floor.y - floor.displayHeight, 'spriteSheet', gameOptions.iconNumberFly);
        this.rocket.setOrigin(0,1).setScale(3);
        this.rocket.setVelocityX(powerUpSpeed);
        this.physics.add.collider(floor, this.rocket);

        this.speed = this.physics.add.sprite(gameOptions.gameWidth * (1 + powerUpDistance), floor.y - floor.displayHeight, 'spriteSheet', gameOptions.iconNumberSpeed);
        this.speed.setOrigin(0,1).setScale(3);
        this.speed.setVelocityX(powerUpSpeed);
        this.physics.add.collider(floor, this.speed);

    }

}