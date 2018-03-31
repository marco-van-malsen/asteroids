// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

var ship;
var asteroids = [];
var lasers = [];

function setup() {
  // create canvas at full window size
  createCanvas(windowWidth, windowHeight);

  // add a new ship
  ship = new Ship();

  // add asteroids
  for (var i = 0; i < 5; i++) {
    asteroids.push(new Asteroid());
  }
}

function draw() {
  // space is a dark place
  background(0);

  // animate the asteroids
  for (var i = 0; i < asteroids.length; i++) {
    // ship collide with an osteroid
    if (ship.hits(asteroids[i])) {
      console.log('ooops!');
    }
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
  }

  // check if any laser hits any asteroid
  for (var i = lasers.length - 1; i >= 0; i--) {
    // show the laser
    lasers[i].render();
    lasers[i].update();

    // remove laser when it leaves the scren
    if (lasers[i].offscreen()) {
      lasers.splice(i, 1);
    } else {
      for (var j = asteroids.length - 1; j >= 0; j--) {
        if (lasers[i].hits(asteroids[j])) {
          if (asteroids[j].r > 10) {
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          break;
        }
      }
    }
  }

  // show the ship
  ship.render();
  ship.turn();
  ship.update();
  ship.edges();
}

// what happens when player presses a key
function keyPressed() {
  // SPACEBAR; add lasser
  if (key == ' ') {
    lasers.push(new Laser(ship.pos, ship.heading));
    // RIGHT ARROW; turn player clock wise
  } else if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0.1);
    // LEFT ARROW; turn player counter clock wise
  } else if (keyCode == LEFT_ARROW) {
    ship.setRotation(-0.1);
    // UP ARROW; move forward
  } else if (keyCode == UP_ARROW) {
    ship.boosting(true);
  }
}

// what happens when the key is released
function keyReleased() {
  ship.setRotation(0);
  ship.boosting(false);
}