export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true).setScale(0.5).setGravityY(300).setSize(40, 115);
    }

    handleInput(cursors, keyA, keyD, keyW, keyS, joystickCursors) {
        const playerSpeed = 150;
        let isMoving = false;

        this.setVelocityX(0); // Detener al jugador si no se presiona ninguna tecla

        // Movimiento horizontal
        if (keyA.isDown || cursors.left.isDown || joystickCursors.left.isDown) {
            this.setVelocityX(-playerSpeed);
            this.setFlipX(true);
            isMoving = true;
        } else if (keyD.isDown || cursors.right.isDown || joystickCursors.right.isDown) {
            this.setVelocityX(playerSpeed);
            this.setFlipX(false);
            isMoving = true;
        }

        // Movimiento vertical (saltar)
        if ((keyW.isDown || cursors.up.isDown || joystickCursors.up.isDown) && this.body.touching.down) {
            this.setVelocityY(-190);
            isMoving = true;
        }

        if ((keyS.isDown || cursors.down.isDown || joystickCursors.down.isDown) && this.body.touching.down) {
            this.setVelocityY(0);
            isMoving = true;
        }

        // Reproducir animación de caminar si el jugador se mueve, detenerla si no
        if (isMoving) {
            this.anims.play('player-walk', true);
        } else {
            this.anims.stop();
        }
    }
}
