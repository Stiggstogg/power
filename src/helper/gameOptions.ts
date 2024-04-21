// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

import Vector2 = Phaser.Math.Vector2;

class GameOptions {

    public readonly gameWidth: number;
    public readonly gameHeight: number;
    public readonly playerSpeed: number;
    public readonly powerUpSpeed: number;
    public readonly playerStartPosition: Phaser.Math.Vector2;
    public readonly playerFlySpeed: Phaser.Math.Vector2;
    public readonly playerSpeedSpeed: Phaser.Math.Vector2;
    public readonly playerSpeedTime: number;
    public readonly gravity: Phaser.Math.Vector2;
    public readonly spawnerPosition: Phaser.Math.Vector2;
    public readonly spawnerPowerUpOffset: Phaser.Math.Vector2;
    public readonly buttonCooldown: number;
    public readonly iconNumberFly: number;
    public readonly iconNumberSpeed: number;
    public readonly iconNumberShoot: number;
    public maxLevel: number;
    public readonly inactiveColor: number;
    public readonly playerColor: number;
    public readonly youColor: number;
    public readonly enemyColor: number;
    public readonly textColor: number;
    public readonly uiColor: number;
    public readonly batSpeed: number;
    public readonly batUpDown: number;
    public readonly fadeInOutTime: number;

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
        this.playerStartPosition = new Vector2(this.gameWidth * 0.1, this.gameHeight * 0.5);
        this.playerSpeed = 100;
        this.playerFlySpeed = new Vector2(50, 400);
        this.playerSpeedSpeed = new Vector2(100, 100);         // x is for the speed speed and y is for the additional jumping height if running
        this.playerSpeedTime = 1500;                                  // time for how long the player can speed in ms

        // Spawner
        this.spawnerPosition = new Vector2(this.gameWidth / 2, this.gameHeight * 0.25);
        this.spawnerPowerUpOffset = new Vector2(0, 16);                                 // offset of the point were power ups are spawned relative to the spawners position

        // Power-Up button
        this.buttonCooldown = 100;        // cooldown time, before you can spawn the next power up in ms

        // PowerUp
        this.powerUpSpeed = 150;
        this.iconNumberFly = 7;         // number of the icon for this power up in the spritesheet
        this.iconNumberSpeed = 10;
        this.iconNumberShoot = 8;

        // Bat Enemy
        this.batSpeed = 20;
        this.batUpDown = this.gameHeight * 0.0125;   // should be 8 pixels

        // ---------------------
        // Text styles
        // ---------------------

        // ---------------------
        // Colors
        // ---------------------

        this.inactiveColor = 0x808080;

        this.playerColor = 0xffffff;
        this.youColor = 0xffffff;
        this.enemyColor = 0xffffff;

        this.textColor = 0xffffff;
        this.uiColor = 0xffffff;

        // ---------------------
        // Miscellaneous
        // ---------------------

        this.maxLevel = 1;          // set maximum level (start value, will be changed on loading)
        this.fadeInOutTime = 300;

    }

}

export default new GameOptions();