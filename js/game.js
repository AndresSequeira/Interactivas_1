// Game.js
import Player from "./Player.js";
import Enemy from "./Enemy.js";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }

  preload() {
    this.load.spritesheet("player", "./img/assets/walk.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
    this.load.spritesheet("enemy", "./img/assets/fish.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.image("background", "./img/assets/background.jpg");
  }

  create() {
    // Crea el fondo
    this.background = this.add.image(-200, 0, "background");
    this.background.setScale(0.5);
    this.background.setOrigin(0, 0);

    // Crea el jugador
    this.player = new Player(this, 100, 10);
    this.player.setScale(0.4);

    // Crea el enemigo
    this.enemy = new Enemy(this, 400, 180);
    this.enemy.setScale(0.6);

    // Configura los controles
    this.cursors = this.input.keyboard.createCursorKeys();

    //methods block
    // Crear la animación para el jugador
    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 24 }),
      frameRate: 25, // Velocidad de la animación
      repeat: -1, // Repetir indefinidamente
    });

    // Crear la animación para el enemigo (pez)
    this.anims.create({
      key: "fish",
      frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 24 }),
      frameRate: 25, // Velocidad de la animación
      repeat: -1, // Repetir indefinidamente
    });
  }

  update() {
    this.player.anims.play("player-walk", true);
    //this.player.anims.play("fish", true);
    this.player.update(this.cursors); // Actualiza el jugador
    this.enemy.update(); // Actualiza el enemigo
  }
}
