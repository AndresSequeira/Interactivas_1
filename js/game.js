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
    this.load.spritesheet("player", "./img/assets/walk.png", { frameWidth: 200, frameHeight: 200 });
    this.load.spritesheet("enemy", "./img/assets/fish.png", { frameWidth: 100, frameHeight: 100 });
    this.load.image("background", "./img/assets/background.jpg");
    this.load.image("ground", "./img/assets/ground.png");
    this.load.image("island", "./img/assets/island.png");

     // joystick
     let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
     this.load.plugin('rexvirtualjoystickplugin', url, true);
  }

  create() {
    // Crear la animación para el jugador
    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 24 }),
      frameRate: 25,
      repeat: 1,
    });

    
    // Agregar física arcade
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Crea el fondo
    this.background = this.add.image(-200, 20, "background");
    this.background.setScale(0.5);
    this.background.setOrigin(0, 0);

    // Crear plataformas
    const islandPositions = [
      { x: 90, y: 260 },
      { x: 270, y: 230 },
      { x: 480, y: 260 },
      { x: 405, y: 260 },
      { x: 160, y: 180 },
      { x: -30, y: 220 },
      { x: 570, y: 220 },
      { x: 440, y: 150 },
    ];

    // Crear las islas
    this.islands = islandPositions.map((pos) => {
      const island = new Platform(this, pos.x, pos.y, "island", 1);
      island.setScale(0.2);
      island.setSize(80, 50);
      return island;
    });

    // Crea el jugador
    this.player = new Player(this, 100, 225);
    this.player.setScale(0.5);
    this.player.setSize(40, 115);
    this.player.body.setGravityY(300);

    // Crea el enemigo
    let enemyHeatBoxW = 90;
    let enemyHeatBoxH = 30;
    this.enemy = new Enemy(this, 300, 150);
    this.enemy.setScale(0.6);
    this.enemy.setSize(enemyHeatBoxW, enemyHeatBoxH);
    this.enemy.setOffset(
      (this.enemy.width - enemyHeatBoxW) / 2,
      (this.enemy.height - enemyHeatBoxH) / 2
    );
    this.enemy.body.setGravityY(0);

    // Hacer que las plataformas interactúen con otros objetos físicos
    this.islands.forEach((island) => {
      this.physics.add.collider(this.player, island);
    });

    // Configurar los controles
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    // joystick
    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 50,
      y: 280,
      radius: 20,
      base: this.add.circle(0, 0, 50, 0x888888).setAlpha(0.3), // Opacidad del base al 30%
      thumb: this.add.circle(0, 0, 25, 0xcccccc).setAlpha(0.3), // Opacidad del thumb al 30%
    });

    this.joystickCursors = this.joyStick.createCursorKeys();

    // Detectar colisiones entre el jugador y el enemigo
    this.physics.add.collider(this.player, this.enemy, this.handlePlayerEnemyCollision, null, this);
  }

  update() {
    this.player.anims.play("player-walk", true);
    const playerSpeed = 150;
    const enemySpeed = 65; // Velocidad del enemigo

    // Detener el jugador si no toca ninguna tecla
    this.player.setVelocityX(0);

    // Mover al jugador
    if (this.keyA.isDown || this.joystickCursors.left.isDown) {
      this.player.setVelocityX(-playerSpeed);
      this.player.setFlipX(true);
      console.log("🍟 Mover a la izquierda");
    } else if (this.keyD.isDown || this.joystickCursors.right.isDown) {
      this.player.setVelocityX(playerSpeed);
      this.player.setFlipX(false);
      console.log("🤖 Mover a la derecha");
    }

    if (this.keyW.isDown && this.player.body.touching.down || this.joystickCursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-170);
      console.log("🚀 Saltar");
    }

    if (this.keyS.isDown && !this.player.body.touching.down || this.joystickCursors.down.isDown && !this.player.body.touching.down) {
      this.player.setVelocityY(200);
      console.log("🚀 Caer");
    }

    // Comprobar si el jugador se sale de los límites verticales de la escena
    if (this.player.y < 30 || this.player.y > this.scale.height) {
        console.log("👤 Reiniciando la escena por salir de los límites");
        this.scene.restart(); // Reinicia la escena si el jugador está fuera de los límites
    }

    // Hacer que el enemigo siga al jugador
    this.followPlayer(this.enemy, this.player, enemySpeed);
  }

  handlePlayerEnemyCollision(player, enemy) {
    // Verifica si el jugador está tocando la parte inferior del enemigo
    if (player.body.touching.down && player.getBounds().bottom >= enemy.getBounds().top) {
      player.setVelocityY(-200); // Ajusta este valor según la altura del salto deseada
      console.log("🚀 Saltar más alto por colisión con el enemigo");
    } else {
      this.scene.restart(); // Reinicia la escena si no está tocando desde arriba
    }
  }

  followPlayer(enemy, player, speed) {
    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);

    // Verifica si el enemigo está a una cierta distancia del jugador
    if (distance < 300) { // Cambia este valor para ajustar la distancia de seguimiento
      this.physics.moveToObject(enemy, player, speed);
    }
    if(player.x < enemy.x){
      enemy.setFlipX(false);
    } else if (enemy.x < player.x){
      enemy.setFlipX(true);
    }
  }
}
