// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

class Laser {
  constructor(spos, angle) {
    this.pos = createVector(spos.x, spos.y);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(15);
    if (cheats) this.vel.mult(3);
    lasers.total += 1;
  }

  // check if the laser hits an asteroid
  hits(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);

    // normal game play; laser must hit asteroid
    if (d < asteroid.r) {
      lasers.hits += 1;
      return true;

      // cheating enabled; laser must come close to asteroid
    } else if (cheats && d < asteroid.r * 2) {
      lasers.hits += 1;
      return true;

      // laser missed
    } else {
      return false;
    }
  }

  // check if laser left the screen
  offscreen() {
    // cheats enabled; laser wraps around the playing area
    if (cheats) {
      if (this.pos.x > width) {
        this.pos.x = 0;
      } else if (this.pos.x < 0) {
        this.pos.x = width;
      }

      if (this.pos.y > height) {
        this.pos.y = 0;
      } else if (this.pos.y < 0) {
        this.pos.y = height;
      }

      // the laser does not leave the screen
      return false;

      // normal game play; return if laser left the screen or not
    } else {
      return (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0);
    }
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

// draw the lasers
function drawLasers() {
  for (let l = lasers.length - 1; l >= 0; l--) {
    // show the laser
    lasers[l].render();
    lasers[l].update();

    // remove laser when it leaves the scren
    if (lasers[l].offscreen()) {
      lasers.splice(l, 1);
    }
  }
}
