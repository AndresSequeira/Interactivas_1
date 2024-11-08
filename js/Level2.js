import Player from "./Player.js";
import Enemy from "./Enemy.js";
import Platform from "./Platform.js";
import Background from "./Background.js";

export default class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: "Level2" });
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
        // Fondo
        this.background = new Background(this, -200, 20, "background2");

        // Nuevas posiciones de plataformas para aumentar dificultad
        const islandPositions = [
            { x: 50, y: 300 },
            { x: 200, y: 250 },
            { x: 350, y: 200 },
            { x: 500, y: 150 },
            { x: 650, y: 100 },
            { x: 800, y: 50 },
            { x: 150, y: 150 },
            { x: 450, y: 300 },
        ];

        // Crear las plataformas en las nuevas posiciones
        this.islands = islandPositions.map((pos) => {
            const island = new Platform(this, pos.x, pos.y, "island", 0.2);
            return island;
        });

        // Crear jugador
        this.player = new Player(this, 100, 250);

        // Crear enemigo
        this.enemy1 = new Enemy(this, 300, 300);

        // Configurar colisiones
        this.islands.forEach(island => {
            this.physics.add.collider(this.player, island);
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
    }

    update() {
        // Llamar a handleInput desde Level2 y pasarle los controles
        this.player.handleInput(this.cursors, this.keyA, this.keyD, this.keyW, this.keyS, this.joystickCursors);

        if (this.player.y < 50 || this.player.y > this.scale.height - 50) {
            this.scene.restart();
        }

        // Hacer que el enemigo siga al jugador
        this.enemy1.followPlayer(this.player, 65);
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (player.body.touching.down && player.getBounds().bottom >= enemy.getBounds().top) {
            player.setVelocityY(-200);
        } else {
            this.scene.restart();
          //this.scene.start("Level3"); codigo para pasar de nivel 
        }
    }
}
