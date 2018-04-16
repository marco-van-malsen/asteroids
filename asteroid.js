// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

class Asteroid {
  constructor(pos, size) {
    // breakup just destroyed asteroid; copy position
    // or select random position
    if (pos) {
      this.pos = pos.copy();
    } else {
      this.pos = createVector(random(width), random(height));
    }

    // asteroid starts as LARGE
    // a laser hit breaks of the asteroid in two smaller pieces
    // LARGE to MEDIUM to SMALL to DESTOYED
    if (size === 'SMALL') {
      this.size = 'DESTROYED';
    } else if (size === 'MEDIUM') {
      this.size = 'SMALL';
    } else if (size === 'LARGE') {
      this.size = 'MEDIUM';
    } else {
      this.size = 'LARGE';
    }

    // the asteroids size (determines the score)
    if (this.size === 'LARGE') {
      this.r = random(40, 60);
    } else if (this.size === 'MEDIUM') {
      this.r = random(20, 30);
    } else if (this.size === 'SMALL') {
      this.r = random(10, 15);
    }

    // set speed
    this.vel = p5.Vector.random2D();

    // set number of edges
    this.total = floor(random(5, 15));

    // set offset for each edge
    this.offset = [];
    for (var i = 0; i < this.total; i++) {
      this.offset[i] = random(-this.r * 0.33, this.r * 0.33);
    }
  }

  // breakup asteroid into two smaller asteroids
  breakup() {
    var newA = [];
    newA[0] = new Asteroid(this.pos, this.size);
    newA[1] = new Asteroid(this.pos, this.size);
    return newA;
  }

  // asteroids will wrap-around the screen
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

  // render the asteroid
  render() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }

  update() {
    this.pos.add(this.vel);
  }
}
