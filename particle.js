// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

class Particle {
  constructor(pos, type) {
    this.pos = pos.copy();
    this.lifespan = (type === 'ship' ? 200 : 100);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(1, 2));
    this.type = type;

    // color
    if (this.type === 'ship') {
      this.color = color(floor(random(256)), floor(random(256)), floor(random(256)), this.lifespan);
      // white
    } else {
      this.color = color(255, this.lifespan);
    }
  }

  // show particle
  show() {
    push();
    strokeWeight(2);
    stroke(this.color);
    point(this.pos.x, this.pos.y);
    pop();
  }

  // update particle position and lifespan
  update() {
    this.lifespan -= 20;
    this.pos.add(this.vel);
  }
}
