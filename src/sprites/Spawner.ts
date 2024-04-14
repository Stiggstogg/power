// spawner class

import Player from "./Player";

export default class Spawner extends Phaser.GameObjects.Container {

    private spawnGuy: Phaser.GameObjects.Image;
    private player: Player;

    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {

        super(scene, x, y);

        this.player = player;

        // add images to container
        const pipe = new Phaser.GameObjects.Image(scene, 0, 5, 'spriteSheet', 247);
        const platform1 = new Phaser.GameObjects.Image(scene, -16, 0, 'spriteSheet', 64);
        const platform2 = new Phaser.GameObjects.Image(scene, 0, 0, 'spriteSheet', 65);
        const platform3 = new Phaser.GameObjects.Image(scene, 16, 0, 'spriteSheet', 66);
        this.spawnGuy = new Phaser.GameObjects.Image(scene, 0, -16, 'spriteSheet', 285);

        this.add([pipe, platform1, platform2, platform3, this.spawnGuy]);

        // physics
        scene.physics.add.existing(this);                   // add physics
        if ('setVelocityX' in this.body!) {
            this.body!.setAllowGravity(false);                  // do not apply gravity (needs to be set with if statement, because it could be null (TypeScript)
        }

    }

    update() {
        super.update();

        if ('setVelocityX' in this.body!) {
            this.body!.setVelocityX(this.player.body!.velocity.x);   // set speed to the same speed as the player (needs to be set with if statement, because it could be null (TypeScript)
        }

    }


}