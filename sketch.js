// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

// define playing elements
var ship;
var asteroids;
var lasers;
var score;
var hiscore;
var myfont;

// pre load stuff
// function preload() {
// myfont = loadFont('hyperspace.otf');
// }

function setup() {
  // create canvas at full window size
  createCanvas(windowWidth, windowHeight);

  // initialize hi-score
  hiscore = 0;

  // set the font to be user throughout the game
  // textFont(myfont);

  // initiate a new game
  initGame();
}

function draw() {
  // space is a dark place
  background(0);

  // draw the score
  fill(255);
  noStroke();
  textSize(14);
  textStyle(NORMAL);

  textAlign(RIGHT);
  text('Score:', 75, 20);
  text('Hi-Score:', 75, 40);
  text('Ratio:', 75, 60);

  textAlign(LEFT);
  text(score, 80, 20);
  text(hiscore, 80, 40);
  var ratio = int(lasers.hits / lasers.total * 100);
  if (!ratio) ratio = 0;
  text(nf(ratio, 0, 0) + '%', 80, 60);

  // animate the asteroids
  for (var i = 0; i < asteroids.length; i++) {
    // ship collided with an osteroid
    if (ship.hits(asteroids[i])) {
      console.log('OOOP!');
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
          //increase score
          if (asteroids.size === 'SMALL') {
            score += 50;
          } else if (asteroids[j].size === 'MEDIUM') {
            score += 20;
          } else {
            score += 10;
          }

          // breakup asteroid
          if (asteroids[j].size != 'SMALL') {
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }

          // remove asteroid and laser
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

  //
  if (asteroids.length === 0) {
    newLevel();
  }
}

// initate a new game
function initGame() {
  // setup score and hi-score
  score = 0;
  if (score > hiscore) {
    hiscore = score;
  }

  // create new level
  newLevel()
}

// what happens when player presses a key
function keyPressed() {
  // SPACEBAR; add laser
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

function newLevel() {
  // add a new ship
  ship = new Ship();

  // create lasers
  lasers = [];
  lasers.hits = 0;
  lasers.total = 0;

  // create new asteroids
  asteroids = [];
  for (var i = 0; i < 5; i++) {
    asteroids.push(new Asteroid());
  }
}
