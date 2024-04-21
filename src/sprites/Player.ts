// player class

import gameOptions from "../helper/gameOptions";
import eventsCenter from "../helper/eventsCenter";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    private isFlying: boolean;
    private isSpeed: boolean;
    private speedStartTime: number;
    private flyParticle!: Phaser.GameObjects.Particles.ParticleEmitter;
    private deadParticle!: Phaser.GameObjects.Particles.ParticleEmitter;
    private isFlyingUp: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y, 'spriteSheet', 241);

        // add physics to the sprite
        scene.physics.add.existing(this);

        // set the proper size and offset for the body
        this.setSize(this.displayWidth * 0.75, this.displayHeight * 0.6875);
        this.setOffset(this.displayWidth * 0.125, this.displayHeight * 0.3125);

        this.play('player-idle');

        // initialize the properties
        this.isFlying = false;
        this.speedStartTime = Date.now() - gameOptions.playerSpeedTime;     //  start time (ensure it is working from the beginning)
        this.isSpeed = false;
        this.isFlyingUp = false;

        // set the color
        this.setTint(gameOptions.playerColor);

        // player collides with world bounds
        this.setCollideWorldBounds(true);

        // setup event listeners for power up pickup
        this.setupPickUpEvents();

        // setup particles
        this.setupParticles();

    }

    update() {
        super.update();

        // check if the player is flying down and then remove the rocket and particles
        if (this.isFlying && this.isFlyingUp && this.body!.velocity.y > 0) {

            this.play('player-fly-down');
            this.flyParticle.stop();
            this.scene.sound.get('fly').stop();

            this.isFlyingUp = false;

        }

        // stop the fly
        if (this.isFlying && this.body!.blocked.down && this.body!.velocity.y >= 0) {        // stop the jump

            this.isFlying = false;
            this.play('player-run');                        // change the animation
            this.setVelocityX(gameOptions.playerSpeed);         // change the x speed back to the running speed

        }

        // stop the speed
        if (this.isSpeed && this.body!.blocked.down && Date.now() > this.speedStartTime + gameOptions.playerSpeedTime) {        // stop the speed when the timer is over, the player is on the ground and the player is not flying

            this.isSpeed = false;
            this.play('player-run');                      // change the animation
            this.setVelocityX(gameOptions.playerSpeed);         // change the x speed back to the running speed
            this.scene.sound.get('speed').stop();

        }

        // update particle emitter position
        this.flyParticle.setPosition(this.x + this.displayWidth * (-5/16), this.y + this.displayHeight * (0/16));
        this.deadParticle.setPosition(this.x, this.y);

    }

    move() {

        this.setVelocityX(gameOptions.playerSpeed);
        this.play('player-run');

    }

    fly() {

        let ySpeed = -gameOptions.playerFlySpeed.y;

        if (this.isSpeed) {             // if the player is on speed then jump higher
            this.isSpeed = false;       // stop the speed
            this.scene.sound.get('speed').stop();       // stop the speed sound
            ySpeed = -gameOptions.playerFlySpeed.y - gameOptions.playerSpeedSpeed.y;
        }

        this.setVelocity(gameOptions.playerSpeed + gameOptions.playerFlySpeed.x, ySpeed);   // set the fly speed
        this.isFlying = true;
        this.isFlyingUp = true;
        this.play('player-fly-up');
        this.flyParticle.start();
        this.scene.sound.get('fly').play();

    }

    speed() {

        if (!this.isFlying) {      // only speed up if the player is not jumping
            this.setVelocityX(gameOptions.playerSpeed + gameOptions.playerSpeedSpeed.x);
            this.play('player-speed');
            this.scene.sound.get('speed').play();
        }

        this.isSpeed = true;
        this.speedStartTime = Date.now();

    }

    end(dead: boolean) {

        if (dead) {

            // let the player explode
            this.deadParticle.start();

            // play the dead sound
            this.scene.sound.play('dead');

        }

        // turn off all player sounds
        this.scene.sound.get('fly').stop();
        this.scene.sound.get('speed').stop();

        // turn off all particles
        this.flyParticle.stop();

        // destroy the player
        this.destroy();

    }

    setupPickUpEvents() {

        eventsCenter.on('powerUpPickedUp', (puType: string) => {

            switch (puType) {
                case 'Fly':
                    this.fly();
                    break;
                case 'Speed':
                    this.speed();
                    break;
                case 'Shoot':
                    console.log('SHOOOT!');         // TODO: Replace with real action
                    break;
            }

        });

    }

    setupParticles() {

        // setup the particle emitter for flying (rocket)
        const flyParticleConfig = {
            color: [0xffffff],
            lifespan: 100,
            angle: {min: 120, max: 140},
            //scale: {start: 1, end: 0, ease: 'sine.in'},
            speed: {min: 100, max: 150},
            quantity: 5,
            emitting: false
        }

        this.flyParticle = this.scene.add.particles(this.x, this.y, 'particle', flyParticleConfig);

        // setup the particle emitter for dying
        const deadParticleConfig = {
            color: [0xffffff],
            lifespan: 300,
            alpha: {min: 1, max: 0},
            angle: {min: 0, max: 360},
            scale: {start: 1, end: 3},
            speed: {min: 100, max: 150},
            quantity: 10,
            emitting: false,
            stopAfter: 30
        }

        this.deadParticle = this.scene.add.particles(300, 200, 'particle', deadParticleConfig);

    }

}