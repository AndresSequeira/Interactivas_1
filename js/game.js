// Game.js
import Player from './Player.js';
import Enemy from './Enemy.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload() {
        this.load.image('player', './img/assets/walk.png');
        this.load.image('enemy', './img/assets/fish.png');
        //this.load.image('background', './img/background.png');
    }

    create() {
        // Crea el fondo
        //this.add.image(320, 180, 'background'); // Ajusta según el tamaño de tu fondo

        // Crea el jugador
        this.player = new Player(this, 100, 180);

        // Crea el enemigo
        this.enemy = new Enemy(this, 400, 180);

        // Configura los controles
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        //this.player.update(this.cursors); // Actualiza el jugador
        //this.enemy.update(); // Actualiza el enemigo
    }
}

