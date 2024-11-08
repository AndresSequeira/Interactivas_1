export default class Platform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, scale = 0.2) {
      super(scene, x, y, key);
      scene.add.existing(this);
      scene.physics.add.existing(this, true); // Objeto estático
      this.setScale(scale).setOrigin(0, 0).refreshBody();
      this.setSize(80, 50); // Ajuste del tamaño de colisión.
  }
}

