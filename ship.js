// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

class Ship {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.r = 20; // scale
    this.heading = -HALF_PI; // heading in radians, upwards direction
    this.newHeading = null; //new heading in radions
    this.rotation = 0; // rotation
    this.vel = createVector(0, 0); // velocity
    this.isBoosting = false; // thrusting forward or not
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

    // draw exhaust
    if (player && this.isBoosting) triangle(-5, 15, 0, 25, 5, 15);

    // draw new heading
    // if (this.newHeading !== null) {
    //   let lineH = p5.Vector.fromAngle(this.newHeading - this.heading - HALF_PI);
    //   line(0, 0, lineH.x * 20, lineH.y * 20);
    // }
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
    rotate(this.heading + PI / 2);
    // rotate(this.heading);
    this.draw('player');
    pop();
  }

  // set rotation; will turn the ship
  setRotation(a) {
    this.rotation = a;
  }

  // turn ship
  turn() {
    // auto rotate the ship based on mouse/touch input
    if (this.newHeading !== null && this.rotation === 0) {
      // if difference to the new heading is less than HALF_PI turn clockwise
      // otherwise turn counter-clockwise
      if (this.newHeading - this.heading <= PI) {
        this.setRotation(0.05);
      } else {
        this.setRotation(-0.05);
      }
    }

    // rotate the ship
    this.heading += this.rotation;

    // if ships heading is within 0.05 stop turning
    console.log('heading=' + this.heading);
    console.log('target heading=' + this.newHeading);
    let myAngle = this.heading - this.newHeading;
    if (this.newHeading !== null && abs(myAngle) <= 0.1) {
      this.setRotation(0);
      this.newHeading = null;
      lasers.push(new Laser(ship.pos, ship.heading));
    }
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
