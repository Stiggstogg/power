// imports
import './style.css'
import Phaser from 'phaser'

// scene imports
import BootScene from './scenes/BootScene';
import LoadingScene from './scenes/LoadingScene';
import HomeScene from './scenes/HomeScene';
import GameScene from './scenes/GameScene';
import gameOptions from "./helper/gameOptions";
import GameUIScene from "./scenes/GameUIScene";

// Phaser 3 config
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: gameOptions.gameWidth,
    height: gameOptions.gameHeight,
    scene: [BootScene, LoadingScene, HomeScene, GameScene, GameUIScene],
    title: 'Power',                  // Shown in the console
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,                                     // if true pixel perfect rendering is used
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: gameOptions.gravity,
            debug: false
        }
    }
};

new Phaser.Game(config);