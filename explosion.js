// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

class Explosion {
  constructor(pos, type) {
    this.pos = pos.copy();
    this.particles = [];
    this.type = type;

    // # of partickes for ship or asteroid
    if (this.type === 'ship') {
      this.particleCount = 200;
    } else {
      this.particleCount = 50;
    }

    // add particles
    for (let p = 0; p < this.particleCount; p++) {
      this.particles.push(new Particle(this.pos, this.type));
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
      }
    }
  }
}

// draw explosions; remove when complete
function drawExplosions() {
  for (let x = explosions.length - 1; x >= 0; x--) {
    // update explosion
    explosions[x].update();

    // show explosion or removed when complete
    if (explosions[x].particles.length > 0) {
      explosions[x].show();
    } else {
      // the explosion was from a ship
      if (explosions[x].type === 'ship') gameMinusOne();
      explosions.splice(x, 1);
    }
  }
}
