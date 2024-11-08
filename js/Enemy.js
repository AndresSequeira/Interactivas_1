// Enemy.js
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true).setScale(0.6).setGravityY(0);
        this.setSize(90, 30); // Ajustes del hitbox.
    }

    followPlayer(player, speed) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (distance < 300) {
            this.scene.physics.moveToObject(this, player, speed);
        }
        this.setFlipX(this.x < player.x); // Ajustar dirección.
    }
}


