// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

// define playing elements
var asteroids;
var hiscore;
var lasers;
var lives;
var myfont;
var score;
var ship;

// pre load stuff
function preload() {
  myfont = loadFont('assets/HyperspaceBold.otf');
}

function setup() {
  // create canvas at full window size
  createCanvas(windowWidth, windowHeight);

  // initialize hi-score
  hiscore = 0;

  // set the font to be user throughout the game
  if (myfont) {
    textFont(myfont);
    textStyle(BOLD);
  }

  // initiate a new game
  initGame();
}

function draw() {
  // space is a dark place
  background(0);

  // draw the score
  updateInfo();

  // animate the asteroids
  for (var i = 0; i < asteroids.length; i++) {
    // ship collided with an asteroid
    if (ship.hits(asteroids[i])) {
      lives--;
      if (lives > 0) {
        ship = new Ship();
      } else {
        updateInfo();
        gameOver();
        break;
      }
    }

    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
  }

  // check if any laser hits any asteroid
  for (let i = lasers.length - 1; i >= 0; i--) {
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
  if (ship) {
    ship.render();
    ship.turn();
    ship.update();
    ship.edges();
  }

  // start a new level
  if (asteroids.length === 0) {
    newLevel();
  }
}

// game over
function gameOver() {
  // interrupt the main game loop
  noLoop();

  // remove game elements
  ship = null;
  lasers = [];
  asteroids = [];

  // draw GAME OVER
  push();
  fill(255);
  noStroke();
  textSize(48);
  textAlign(CENTER);
  text('GAME OVER', width * 0.5, height * 0.5);
  pop();
}

// initate a new game
function initGame() {
  // setup score and hi-score
  score = 0;
  updateHiScore();

  // every games starts with 5 lives
  lives = 5;

  // create new level
  newLevel();
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

// update game info
function updateInfo() {
  fill(255);
  noStroke();
  textSize(18);

  textAlign(RIGHT);
  text('Score:', 105, 20);
  text('Hi-Score:', 105, 40);
  text('Ratio:', 105, 60);
  text('Lives:', 105, 90);

  textAlign(LEFT);
  text(score, 110, 20);
  text(hiscore, 110, 40);
  var ratio = int(lasers.hits / lasers.total * 100);
  if (!ratio) ratio = 0;
  text(nf(ratio, 0, 0) + '%', 110, 60);

  // draw a ship for each life
  var x = 115;
  var y = 82;
  for (i = 1; i <= lives; i++) {
    push();
    translate(x, y);
    scale(0.5);
    ship.draw();
    pop();
    x += 20;
  }

  // draw the Atari copyright
  textSize(20);
  textAlign(CENTER);
  text('\u00A91979 ATARI INC', width / 2, height - 20);
}

function updateHiScore() {
  if (score > hiscore) {
    hiscore = score;
  }
}
