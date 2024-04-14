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

        // PowerUp
        this.powerUpSpeed = 150;

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

    }

}

export default new GameOptions();