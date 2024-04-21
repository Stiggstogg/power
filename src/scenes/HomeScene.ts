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
    private rocket!: Phaser.GameObjects.Sprite;
    private speed!: Phaser.GameObjects.Sprite;

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

        // setup music and start it (if not already playing)
        this.setupMusic();

        // setup dancers
        this.setupDancers();

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
        })

        // Create the menu with its entries
        this.createMenu(this.menuEntries);

        // Add keyboard inputs
        this.addKeys();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        // move power up boxes
        this.rocket.x -= 3;
        this.speed.x -= 3;

        if (this.rocket.x < 0) {
            this.rocket.x = gameOptions.gameWidth + this.rocket.displayWidth;
        }

        if (this.speed.x < 0) {
            this.speed.x = gameOptions.gameWidth + this.speed.displayWidth;
        }


    }


    // Creates the menu with its entries, sets the styles for it and adds the mouse events
    createMenu(menuEntries: string[]): void {

        // start position and y space between the entries
        const start = {x: gameOptions.gameWidth / 2, y: this.title.y + gameOptions.gameHeight * 0.3};      // start position
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

                this.cameras.main.fadeOut(gameOptions.fadeInOutTime);   // trigger the fade out, which will then trigger the scene change when finished.

                break;
            case 1:                 // start the "Howto" scene when the "How To Play" entry is selected
                console.log("Credits");
                break;
            case 2:                 // start the "Credits" scene when the "How To Play" entry is selected
                console.log("Credits");
                break;
        }

    }

    setupMusic() {

        // setup music
        const musicSound = this.sound.get('music');

        if (musicSound == null) {        // add it to the sound manager if it isn't yet available
            this.sound.add('music');
        }


        // setup music
        if (!this.sound.get('music').isPlaying) {
            this.sound.get('music').play({volume: 0.7, loop: true});
        }

    }

    setupDancers() {

        const xDist = 0.2;
        const yPos = 0.55;

        // player
        const player = this.add.sprite(gameOptions.gameWidth * xDist, gameOptions.gameHeight * yPos, 'tileSet').setOrigin(0.5).setScale(4);
        player.play('player-dance');

        // you
        const you = this.add.sprite(gameOptions.gameWidth * (1 - xDist), gameOptions.gameHeight * yPos, 'tileSet').setOrigin(0.5).setScale(4);
        you.play('you-dance');

        // power-ups
        this.rocket = this.add.sprite(gameOptions.gameWidth * 1.1, gameOptions.gameHeight, 'spriteSheet', gameOptions.iconNumberFly).setOrigin(1).setScale(3);
        this.speed = this.add.sprite(gameOptions.gameWidth * 1.6, gameOptions.gameHeight, 'spriteSheet', gameOptions.iconNumberSpeed).setOrigin(1).setScale(3);

    }

}