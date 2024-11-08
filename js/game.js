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
        this.load.image("island", "./img/assets/island.png");

        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        this.load.plugin('rexvirtualjoystickplugin', url, true);
    }

    create() {
        this.background = new Background(this, -200, 20, "background");

        const islandPositions = [
            { x: 90, y: 260 },//
            { x: 270, y: 230 },//
            { x: 480, y: 260 },//
            { x: 405, y: 260 },//
            { x: 170, y: 190 },
            { x: -30, y: 220 },
            { x: 570, y: 220 },
            { x: 440, y: 150 },
        ];

        this.islands = islandPositions.map((pos) => {
            const island = new Platform(this, pos.x, pos.y, "island", 0.2);
            return island;
        });

        this.player = new Player(this, 100, 225);
        this.enemy = new Enemy(this, 300, 150);

        this.islands.forEach(island => {
            this.physics.add.collider(this.player, island);
        });

        this.physics.add.collider(this.player, this.enemy, this.handlePlayerEnemyCollision, null, this);

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
        // Llamar a handleInput desde Game y pasarle los controles
        this.player.handleInput(this.cursors, this.keyA, this.keyD, this.keyW, this.keyS, this.joystickCursors);

        if (this.player.y < 50 || this.player.y > this.scale.height - 50) {
            this.scene.restart();
        }

        this.enemy.followPlayer(this.player, 65);
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (player.body.touching.down && player.getBounds().bottom >= enemy.getBounds().top) {
            player.setVelocityY(-200);
        } else {
            this.scene.restart();
        }
    }
}
