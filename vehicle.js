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
    this.acc.add(force);
  }

  // behaviors
  behaviors(good, bad) {
    var steerG = this.eat(good, 0.2, this.dna[2]);
    var steerB = this.eat(bad, -1, this.dna[3]);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  // keep vehicle from going outsite windows edges
  boundaries() {
    // keep this many pixels away from the edge
    var edge = 100;

    // initialize desired direction
    var desired = null;

    if (this.pos.x < edge) {
      // normalize maximum speed along X-axis
      desired = createVector(this.velMax, this.vel.y);
    } else if (this.pos.x > width - edge) {
      desired = createVector(-this.velMax, this.vel.y);
    }

    // normalize maximum speed along Y-axis
    if (this.pos.y < edge) {
      desired = createVector(this.vel.x, this.velMax);
    } else if (this.pos.y > height - edge) {
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
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + HALF_PI);
    scale(0.5);
    ship.draw();
    pop();
  }

  // find nearest asteroid and steer towards it
  SeekAndDestroy() {
    // find nearest asteroid
    var shortest = Infinity; // shortest distance to asteroid
    var nearest = null; // nearest asteroid; an array element
    for (var a = asteroids.length - 1; a >= 0; a--) {
      var distance = this.pos.dist(asteroids[a].pos);
      if (distance < shortest) {
        shortest = distance;
        nearest = asteroids[a];
      }
    }

    // draw bullseye on target
    if (debug) {
      noFill();
      stroke(255);
      strokeWeight(1);
      var mySize = nearest.r;
      ellipse(nearest.pos.x, nearest.pos.y, mySize * 0.75);
      ellipse(nearest.pos.x, nearest.pos.y, mySize * 0.5);
      line(nearest.pos.x, nearest.pos.y - mySize * 0.5, nearest.pos.x, nearest.pos.y + mySize * 0.5);
      line(nearest.pos.x - mySize * 0.5, nearest.pos.y, nearest.pos.x + mySize * 0.5, nearest.pos.y);
    }

    // vector pointing from the location to the target
    // normalize; scale to max speed
    var desired = p5.Vector.sub(nearest.pos, this.pos);
    desired.setMag(this.velMax);

    // adjust speed based on proximity
    // reverse course if asteroid is too near
    var distSlowDown = nearest.r * 10;
    var distReverse = nearest.r * 4;
    if (shortest < distReverse) {
      desired.mult(-2);
      // desired.rotate(random() < 0.5 ? QUARTER_PI : -QUARTER_PI);
    } else if (shortest < distSlowDown) {
      desired.mult(map(shortest, distReverse, distSlowDown, 0.75, 0.9));
    }

    // steering = desired minus velocity
    // limit to maximum steering force
    var course = p5.Vector.sub(desired, this.vel);
    course.limit(this.maxforce);

    // set new course
    this.applyForce(course);

    // fire laser
    // let curHeading = this.vel.heading();
    // let newHeading = course.heading() - HALF_PI;
    // if (shortest < 250 && (newHeading - curHeading) % HALF_PI < 0.01 && lasers.length === 0) {
    if (shortest < 350 && frameCount % 20 === 0) {
      // lasers.push(new Laser(this.pos, this.vel.heading()));
    }
  }

  // calculate steering force towards a target
  // STEER = DESIRED - VELOCITY
  seek(target) {
    var desired = p5.Vector.sub(target, this.pos); // vector pointing from the location to the target
    desired.setMag(this.velMax); // scale to maximum speed
    var steer = p5.Vector.sub(desired, this.vel); // steering = desired minus velocity
    steer.limit(this.maxforce); // limit to maximum steering force
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
