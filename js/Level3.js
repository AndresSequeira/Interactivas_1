import Player from "./Player.js";
import Enemy from "./Enemy.js";
import Platform from "./Platform.js";
import Background from "./Background.js";

export default class Level3 extends Phaser.Scene {
    constructor() {
        super({ key: "Level3" });
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
        // Fondo del primer nivel
        this.background = new Background(this, -200, 20, "background");

        // Nuevas posiciones de plataformas para el tercer nivel
        const islandPositions = [
            { x: 70, y: 300 },
            { x: 200, y: 250 },
            { x: 370, y: 220 },
            { x: 520, y: 180 },
            { x: 650, y: 140 },
            { x: 100, y: 100 },
            { x: 250, y: 180 },
            { x: 500, y: 300 },
        ];

        // Crear las plataformas en las nuevas posiciones
        this.islands = islandPositions.map((pos) => {
            const island = new Platform(this, pos.x, pos.y, "island", 0.2);
            return island;
        });

        // Crear jugador
        this.player = new Player(this, 100, 270);

        // Crear tres enemigos con una velocidad menor
        this.enemy1 = new Enemy(this, 150, 150);

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
    }

    update() {
        // Llamar a handleInput desde Level3 y pasarle los controles
        this.player.handleInput(this.cursors, this.keyA, this.keyD, this.keyW, this.keyS, this.joystickCursors);

        if (this.player.y < 50 || this.player.y > this.scale.height - 50) {
            this.scene.restart();
        }

        // Hacer que los enemigos sigan al jugador con una velocidad menor
        const slowEnemySpeed = 40;
        this.enemy1.followPlayer(this.player, slowEnemySpeed);

    }

    handlePlayerEnemyCollision(player, enemy) {
        if (player.body.touching.down && player.getBounds().bottom >= enemy.getBounds().top) {
            player.setVelocityY(-200);
        } else {
            this.scene.restart();
        }
    }
}
