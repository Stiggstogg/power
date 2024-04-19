import Phaser from 'phaser';
import gameOptions from "../helper/gameOptions";

// "Home" scene: Main game menu scene
export default class HomeScene extends Phaser.Scene {

    private title!: Phaser.GameObjects.BitmapText;
    private titleText!: string;
    private menuEntries!: string[];
    private selected!: number;
    private items!: Phaser.GameObjects.BitmapText[];


    // Constructor
    constructor() {
        super({
            key: 'Home'
        });
    }

    // Initialize parameters
    init(): void {

        // title text
        this.titleText = 'POWER UP ADVENTURE';

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

        // Title
        this.title = this.add.bitmapText(gameOptions.gameWidth / 2, gameOptions.gameHeight * 0.2, 'minogram', this.titleText, 50).setOrigin(0.5, 0.5);

        // Create the menu with its entries
        this.createMenu(this.menuEntries);

        // Add keyboard inputs
        this.addKeys();

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
            this.items[i].clearTint();         // change the style of all entries to the inactive style
            this.items[i].setFontSize(30);
        }

        this.items[this.selected].setTint(0xb8f818);   // change the style of the selected entry to the active style
        this.items[this.selected].setFontSize(40);

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
                this.scene.start('Game', {
                    level: 1,
                    attempts: 0                         // always start with 0, as at the beginning of the level the number of attempts will be increased by one
                });
                break;
            case 1:                 // start the "Howto" scene when the "How To Play" entry is selected
                console.log("Credits");
                break;
            case 2:                 // start the "Credits" scene when the "How To Play" entry is selected
                console.log("Credits");
                break;
        }

    }

}