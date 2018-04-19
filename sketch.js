// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

// define playing elements
var asteroids;
var gameStarted;
var hiscore;
var lasers;
var lives;
var myfont;
var numAsteroids;
var score;
var ship;

// pre load stuff
function preload() {
  myFont = loadFont('assets/HyperspaceBold.otf');
}

function setup() {
  // create canvas at full window size
  createCanvas(windowWidth, windowHeight);

  // initialize hi-score
  hiscore = 0;

  // every game starts with 5 asteroids; inceases by one after avery level
  numAsteroids = 5;

  // every game starts with 5 lives; increases by one after every level
  lives = 5;

  // every games starts with 5 lives
  gameStarted = false;

  // initiate a new game
  initGame();
}

function draw() {
  // space is a dark place
  background(0);

  // draw the score
  drawGameStats();

  // draw the Atari Copyright
  drawAtariCopyright();

  // Wait for player to start the game
  if (!gameStarted) {
    drawGameTitle();
    return;
  }

  // animate the asteroids
  for (var i = 0; i < asteroids.length; i++) {
    // ship collided with an asteroid
    if (ship.hits(asteroids[i])) {
      lives--;
      if (lives > 0) {
        ship = new Ship();
      } else {
        drawGameStats();
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
  // user gets a new life afeter every level
  if (asteroids.length === 0) {
    lives++;
    numAsteroids++;
    initGame();
  }
}

// draw the Atari copyright
function drawAtariCopyright() {
  textSize(20);
  textAlign(CENTER);
  textFont(myFont);
  text('INSPIRED BY \u00A91979 ATARI INC', width / 2, height - 20);
}

// draw game statistics
function drawGameStats() {
  fill(255);
  noStroke();
  textSize(20);
  textFont(myFont);

  textAlign(RIGHT);
  text('Score:', 115, 20);
  text('Hi-Score:', 115, 40);
  text('Ratio:', 115, 60);
  text('Lives:', 115, 90);

  textAlign(LEFT);
  text(score, 120, 20);
  text(hiscore, 120, 40);
  var ratio = round(lasers.hits / lasers.total * 100);
  if (!ratio) ratio = 0;
  text(nf(ratio, 0, 0) + '%', 120, 60);

  // draw a ship for each life
  var x = 125;
  var y = 82;
  for (i = 1; i <= lives; i++) {
    push();
    translate(x, y);
    scale(0.5);
    ship.draw();
    pop();
    x += 20;
  }
}

// draw the Asteroids game title
function drawGameTitle() {
  textAlign(CENTER);
  textFont(myFont);
  textSize(64);
  text('ASTEROIDS', width * 0.5, height * 0.5);
  textSize(32);
  text('PRESS SPACE TO START', width * 0.5, height * 0.5 + 48);
}

// game over
function gameOver() {
  // pause game loop
  gameStarted = false;

  // update hi-score
  if (score > hiscore) {
    hiscore = score;
  }

  // remove game elements
  ship = null;
  lasers = [];
  asteroids = [];
}

// initate a new game
function initGame() {
  // reset score
  score = 0;

  // add a new ship
  ship = new Ship();

  // create lasers
  lasers = [];
  lasers.hits = 0;
  lasers.total = 0;

  // create new asteroids
  asteroids = [];
  for (var i = 0; i < numAsteroids; i++) {
    asteroids.push(new Asteroid());
  }
}

// what happens when player presses a key
function keyPressed() {
  // SPACEBAR; add laser
  if (key == ' ') {
    if (gameStarted) {
      lasers.push(new Laser(ship.pos, ship.heading));
    } else {
      gameStarted = true;
      return;
    }

    // RIGHT ARROW; turn player clock wise
  } else if (keyCode === RIGHT_ARROW) {
    ship.setRotation(0.1);

    // LEFT ARROW; turn player counter clock wise
  } else if (keyCode === LEFT_ARROW) {
    ship.setRotation(-0.1);

    // UP ARROW; move forward
  } else if (keyCode === UP_ARROW) {
    ship.boosting(true);
  }
}

// what happens when the key is released
function keyReleased() {
  ship.setRotation(0);
  ship.boosting(false);
}
