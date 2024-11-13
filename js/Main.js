import Game from './Game.js';
import Level2 from './Level2.js';
import Level3 from './Level3.js';

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
        }
    },
    scene: [Game, Level2, Level3] // Agrega Level3 aquí
};

let game = new Phaser.Game(config);
