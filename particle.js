// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.lifespan = 255;
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(1, 2));
  }

  // show particle
  show() {
    push();
    strokeWeight(2);
    stroke(255, this.lifespan);
    point(this.pos.x, this.pos.y);
    pop();
  }

  // update particle position and lifespan
  update() {
    this.lifespan -= 5;
    this.pos.add(this.vel);
  }
}
