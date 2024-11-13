import Player from "./Player.js";
import Enemy from "./Enemy.js";
import Platform from "./Platform.js";
import Background from "./Background.js";

export default class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: "Level2" });
        this.initialTime = 30; // Tiempo inicial en segundos
    }

    preload() {
        this.load.spritesheet("player", "./img/assets/walk.png", { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet("enemy", "./img/assets/fish.png", { frameWidth: 100, frameHeight: 100 });
        this.load.image("background", "./img/assets/background.jpg");
        this.load.image("island", "./img/assets/island.png");

        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);
    }

    create() {
        // Reiniciar tiempo restante al tiempo inicial
        this.timeRemaining = this.initialTime;

        // Fondo
        this.background = new Background(this, -200, 20, "background");

        // Nuevas posiciones de plataformas para aumentar dificultad
        const islandPositions = [
            { x: 0, y: 300 },
            { x: 100, y: 260 },
            { x: 300, y: 280 },
            { x: 380, y: 280 },
            { x: 540, y: 260 },
            { x: 100, y: 100 },
            { x: 180, y: 100 },
            { x: 260, y: 100 },
        ];

        // Crear las plataformas en las nuevas posiciones
        this.islands = islandPositions.map((pos) => {
            const island = new Platform(this, pos.x, pos.y, "island", 0.2);
            return island;
        });

        // Crear jugador
        this.player = new Player(this, 50, 250);

        // Crear enemigo
        this.enemy1 = new Enemy(this, 300, 300);

        // Configurar colisiones
        this.islands.forEach(island => {
            this.physics.add.collider(this.player, island);
            this.physics.add.collider(this.enemy1, island);
        });

        this.physics.add.collider(this.player, this.enemy1, this.handlePlayerEnemyCollision, null, this);

        // Configuración de controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.joystickCursors = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 50, y: 280, radius: 20,
            base: this.add.circle(0, 0, 50, 0x888888).setAlpha(0.3),
            thumb: this.add.circle(0, 0, 25, 0xcccccc).setAlpha(0.3),
        }).createCursorKeys();

        // Crear la animación de caminar del jugador
        this.anims.create({
            key: 'player-walk',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 24 }),
            frameRate: 25,
            repeat: -1
        });

        // Texto del temporizador visual
        this.timerText = this.add.text(10, 10, `Tiempo: ${this.timeRemaining}`, { fontSize: '20px', fill: '#ffffff' });

        // Temporizador para cambiar de nivel después de 30 segundos
        this.time.delayedCall(this.initialTime * 1000, () => {
            this.scene.start("Level3");
        });

        // Temporizador para actualizar el tiempo restante cada segundo
        this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Llamar a handleInput desde Level2 y pasarle los controles
        this.player.handleInput(this.cursors, this.keyA, this.keyD, this.keyW, this.keyS, this.joystickCursors);

        if (this.player.y < 50 || this.player.y > this.scale.height - 50) {
            //this.scene.restart();
            this.scene.start("Level3");
        }

        // Hacer que el enemigo siga al jugador
        this.enemy1.followPlayer(this.player, 65);
    }

    updateTimer() {
        this.timeRemaining -= 1; // Reducir el tiempo restante en 1 segundo
        this.timerText.setText(`Tiempo: ${this.timeRemaining}`); // Actualizar el texto del temporizador

        if (this.timeRemaining <= 0) {
            this.timeEvent.remove(); // Detener el temporizador
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (player.body.touching.down && player.getBounds().bottom >= enemy.getBounds().top) {
            player.setVelocityY(-200);
        } else {
            this.scene.restart();
        }
    }
}
