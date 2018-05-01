// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

class Particle {
  constructor(pos, type) {
    this.pos = pos.copy();
    this.lifespan = 255;
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(1, 2));
    this.type = type;

    // random colored particles for ship exploding
    if (this.type === 'ship') {
      this.r = floor(random(256));
      this.g = floor(random(256));
      this.b = floor(random(256));

      // white particles for asteroid exploding
    } else {
      this.r = 255;
      this.g = 255;
      this.b = 255;
    }
  }

  // show particle
  show() {
    push();
    strokeWeight(this.type === 'ship' ? 2 : 1);
    stroke(this.r, this.g, this.b, this.lifespan);
    point(this.pos.x, this.pos.y);
    pop();
  }

  // update particle position and lifespan
  update() {
    this.lifespan -= 5;
    this.pos.add(this.vel);
  }
}
