export default class Background extends Phaser.GameObjects.Image {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        scene.add.existing(this);
        this.setOrigin(0, 0).setScale(0.5); // Ajustes de posición y escala.
    }
}
