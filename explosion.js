// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

class Explosion {
  constructor(pos) {
    this.pos = pos.copy();
    this.particles = [];
    this.particleCount = 50;

    // add particles
    for (let p = 0; p < this.particleCount; p++) {
      this.particles.push(new Particle(this.pos.x, this.pos.y));
    }
  }

  // show explosion, meaning its particles
  show() {
    for (let p = this.particles.length - 1; p >= 0; p--) {
      this.particles[p].update();
      this.particles[p].show();
    }
  }

  // update explosion; reduce lifespan
  // particles will be removed when lifespan has ended (value is zero)
  update() {
    for (let p = this.particles.length - 1; p >= 0; p--) {
      this.particles[p].update();
      if (this.particles[p].lifespan <= 0) {
        this.particles.splice(p, 1);
        break;
      }
    }
  }
}
