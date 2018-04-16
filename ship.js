// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

class Ship {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.r = 20;
    this.heading = 0;
    this.rotation = 0;
    this.vel = createVector(0, 0);
    this.isBoosting = false;
  }

  // increase speed
  boost() {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.1);
    this.vel.add(force);
  }

  // speed up
  boosting(b) {
    this.isBoosting = b;
  }

  // draw the ship
  draw() {
    fill(0);
    stroke(255);
    beginShape();
    vertex(0, -20); // the nose
    vertex(15, 20); // lower right tip
    vertex(12, 15);
    vertex(-12, 15);
    vertex(-15, 20); // lower left tip
    endShape(CLOSE);
  }

  // if the ship leaves the screen it will appear on the opposite side
  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }

  // check if ship collides with an asteroid
  hits(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.r + asteroid.r) {
      return true;
    } else {
      return false;
    }
  }

  // show the ship
  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    this.draw();
    pop();
  }

  // set rotation; will turn the ship
  setRotation(a) {
    this.rotation = a;
  }

  // turn ship
  turn() {
    this.heading += this.rotation;
  }

  // update ships position
  update() {
    if (this.isBoosting) {
      this.boost();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  }
}
