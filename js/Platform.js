export default class Platform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, scale = 1) {
      super(scene, x, y, key);

      // Agregar el sprite a la escena y al sistema de físicas
      scene.add.existing(this);
      scene.physics.add.existing(this, true); // El 'true' indica que es un objeto estático

      // Ajustar el origen del sprite a la esquina superior izquierda
      this.setOrigin(0, 0);

      // Aplicar escala al sprite
      this.setScale(1.1);

      // Refrescar el cuerpo físico después de escalar
      this.body.updateFromGameObject();

      // Ajustar el tamaño del cuerpo físico para que coincida con la imagen escalada
      this.body.setSize(this.displayWidth, this.displayHeight);
      this.body.setOffset(0, 0); // Ajustar el desplazamiento en caso de que el origen o hitbox se desalineen
  }
}
