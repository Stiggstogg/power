// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

import Vector2 = Phaser.Math.Vector2;

class GameOptions {

    public readonly gameWidth: number;
    public readonly gameHeight: number;
    public readonly textStyles: Phaser.Types.GameObjects.Text.TextStyle[];
    public readonly playerSpeed: number;
    public readonly powerUpSpeed: number;
    public readonly playerStartPosition: Phaser.Math.Vector2;
    public readonly playerJumpSpeed: Phaser.Math.Vector2;
    public readonly gravity: Phaser.Math.Vector2;
    public readonly spawnerPosition: Phaser.Math.Vector2;
    public readonly spawnerPowerUpOffset: Phaser.Math.Vector2;
    public readonly iconNumberFly: number;
    public readonly iconNumberSpeed: number;
    public readonly iconNumberShoot: number;
    public maxLevel: number;

    constructor() {

        // ---------------------
        // Game and world area
        // ---------------------

        // Width and height of the game (canvas)
        this.gameWidth = 640;
        this.gameHeight = 304;

        // gravity
        this.gravity = new Vector2(0, 1000);

        // ---------------------
        // Objects parameters
        // ---------------------

        // Player
        this.playerStartPosition = new Vector2(32, 150);
        this.playerSpeed = 100;
        this.playerJumpSpeed = new Vector2(50, 400);

        // Spawner
        this.spawnerPosition = new Vector2(this.gameWidth / 2, this.gameHeight * 0.2);
        this.spawnerPowerUpOffset = new Vector2(0, 16);                                 // offset of the point were power ups are spawned relative to the spawners position

        // PowerUp
        this.powerUpSpeed = 150;
        this.iconNumberFly = 7;         // number of the icon for this power up in the spritesheet
        this.iconNumberSpeed = 10;
        this.iconNumberShoot = 8;

        // ---------------------
        // Text styles
        // ---------------------

        this.textStyles = [];

        // Text style 0: Title
        this.textStyles.push({
            fontFamily: 'Orbitron',
            fontSize: '100px',
            color: '#FFE500',
            fontStyle: 'bold'
        });

        // ---------------------
        // Miscellaneous
        // ---------------------

        this.maxLevel = 1;          // set maximum level (start value, will be changed on loading)

    }

}

export default new GameOptions();