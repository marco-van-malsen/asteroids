// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

class Laser {
  constructor(spos, angle) {
    this.pos = createVector(spos.x, spos.y);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(15);
    lasers.total += 1;
  }

  // check if the laser hits an asteroid
  hits(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < asteroid.r) {
      lasers.hits += 1;
      return true;
    } else {
      return false;
    }
  }

  // check if laser left the screen
  offscreen() {
    if (this.pos.x > width || this.pos.x < 0) {
      return true;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      return true;
    }
    return false;
  }

  // show the laser
  render() {
    push();
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  }

  // update laser's position
  update() {
    this.pos.add(this.vel);
  }
}
