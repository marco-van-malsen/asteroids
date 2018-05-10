class Vehicle {
  constructor(x, y) {
    this.acc = createVector(0, 0);
    this.vel = createVector(random(-2, -1, 1, 2), random(-2, -1, 1, 2));
    this.pos = createVector(x, y);
    this.r = 4;
    this.velMax = 5;
    this.maxforce = 0.5;
  }

  // apply force to vehicle
  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acc.add(force);
  }

  boundaries() {
    var d = 25;

    var desired = null;

    if (this.pos.x < d) {
      // normalize maximum speed along X-axis
      desired = createVector(this.velMax, this.vel.y);
    } else if (this.pos.x > width - d) {
      desired = createVector(-this.velMax, this.vel.y);
    }

    // normalize maximum speed along Y-axis
    if (this.pos.y < d) {
      desired = createVector(this.vel.x, this.velMax);
    } else if (this.pos.y > height - d) {
      desired = createVector(this.vel.x, -this.velMax);
    }

    // normalize speed and angle
    if (desired !== null) {
      desired.normalize();
      desired.mult(this.velMax);
      var steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  // draw the vehicle
  display() {
    // get angle from velocity
    var angle = this.vel.heading() + HALF_PI;

    // remember current settings
    push();

    // translatate and rotate to draw vehicle
    translate(this.pos.x, this.pos.y);
    rotate(angle);

    // draw vehicle
    fill(255);
    stroke(255);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    // restore settings
    pop();
  }

  // calculate steering force towards a target
  // STEER = DESIRED - VELOCITY
  seek(target) {
    var desired = p5.Vector.sub(target, this.pos); // vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.velMax);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
  }

  // Method to update location
  update() {
    this.vel.add(this.acc); // update velocity
    this.vel.limit(this.velMax); // limit speed
    this.pos.add(this.vel); // add velocity
    this.acc.mult(0); // reset acceleration
  }
}
