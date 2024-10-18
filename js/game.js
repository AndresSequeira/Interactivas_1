// Game.js
import Player from "./Player.js";
import Enemy from "./Enemy.js";
import Platform from "./Platform.js";
import Background from "./Background.js";

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
    this.load.image("ground", "./img/assets/ground.png");
  }

  create() {
    //methods block
    // Crear la animación para el jugador
    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 24 }),
      frameRate: 25, // Velocidad de la animación
      repeat: -1, // Repetir indefinidamente
    });

    // Agregar física arcade
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Crea el fondo
    this.background = this.add.image(-200, 0, "background");
    this.background.setScale(0.5);
    this.background.setOrigin(0, 0);

    // Crear otra plataforma a la izquierda
    this.leftPlatform = new Platform(this, -15, 310, "ground", 1);
    this.leftPlatform.setSize(200, 40);

    // Crear una plataforma a la derecha más arriba
    this.rightPlatform = new Platform(this, 420, 310, "ground", 1);
    this.rightPlatform.setSize(200, 40);

    // Crear el suelo en el centro y aplicar una escala
    this.ground = new Platform(this, 200, 310, "ground", 1);
    this.ground.setSize(200, 40);

    // Crea el jugador
    this.player = new Player(this, 0, 285);
    this.player.setScale(0.5);
    this.player.setSize(115,115);
    this.player.body.setGravityY(300);

    // Crea el enemigo
    this.enemy = new Enemy(this, 400, 285);
    this.enemy.setScale(0.6);
    this.enemy.setSize(100, 100);
    this.enemy.body.setGravityY(300);

    // Hacer que las plataformas interactúen con otros objetos físicos
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.leftPlatform);
    this.physics.add.collider(this.player, this.rightPlatform);
    this.physics.add.collider(this.enemy, this.ground);
    this.physics.add.collider(this.enemy, this.leftPlatform);
    this.physics.add.collider(this.enemy, this.rightPlatform);

    // Configura los controles
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.player.anims.play("player-walk", true);
    this.player.update(this.cursors); // Actualiza el jugador
    this.enemy.update(); // Actualiza el enemigo
  }
}
