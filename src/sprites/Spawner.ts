// spawner class

export default class Spawner extends Phaser.GameObjects.Container {

    private spawnGuy: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y);

        // add images to container
        const pipe = new Phaser.GameObjects.Image(scene, 0, 5, 'spriteSheet', 247);
        const platform1 = new Phaser.GameObjects.Image(scene, -16, 0, 'spriteSheet', 64);
        const platform2 = new Phaser.GameObjects.Image(scene, 0, 0, 'spriteSheet', 65);
        const platform3 = new Phaser.GameObjects.Image(scene, 16, 0, 'spriteSheet', 66);
        this.spawnGuy = new Phaser.GameObjects.Sprite(scene, 0, -16, 'spriteSheet', 285);
        this.spawnGuy.play('you-idle');

        this.add([pipe, platform1, platform2, platform3, this.spawnGuy]);

    }

    update() {
        super.update();


    }


}