// Main.js
import Game from './Game.js';

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: Game, // Usa Game aquí
};

// Crear el juego y pasar el objeto de configuración
let game = new Phaser.Game(config);

