// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

class Ship {
  constructor() {
    this.acc = createVector(0, 0); // acceleration
    this.isBoosting = false; // thrusting forward or not
    this.heading = -HALF_PI; // heading in radians, upwards direction
    this.newHeading = null; //new heading in radions
    this.pos = createVector(width * 0.5, height * 0.5); // initial position on screen
    this.r = 20; // size
    this.rotation = 0; // rotation
    this.turnAccuracy = 0.05; // two degrees turn accuracy
    this.vel = createVector(0, 0); // velocity
  }

  // increase speed
  boost() {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.1);
    this.vel.add(force);
  }

  // enable of disable boosting
  boosting(b) {
    this.isBoosting = b;
  }

  // draw the ship
  draw(player) {
    fill(0);
    stroke(255);
    beginShape();
    vertex(0, -22.5); // the nose
    vertex(15, 22.5); // lower right tip
    vertex(12.5, 15);
    vertex(-12.5, 15);
    vertex(-15, 22.5); // lower left tip
    endShape(CLOSE);

    if (player) {
      // draw exhaust
      if (this.isBoosting) triangle(-5, 15, 0, 25, 5, 15);
    }
  }

  // if the ship leaves the screen it will appear on the opposite side
  edges() {
    // left and right
    if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    } else if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    }

    // top and bottom
    if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    } else if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    }
  }

  // check if ship collides with an asteroid
  hits(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    return (d < this.r + asteroid.r);
  }

  // show the ship
  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + HALF_PI);
    this.draw('player');
    pop();
  }

  // set rotation; will turn the ship
  setRotation(a) {
    this.rotation = a;
  }

  // turn ship
  turn() {
    // rotate the ship
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

// draw the ship
function drawShip() {
  ship.turn();
  ship.update();
  ship.edges();
  ship.render();
}
