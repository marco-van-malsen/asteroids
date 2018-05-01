// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

const GAME_NOT_STARTED = 0;
const GAME_STARTED = 1;
const GAME_PAUSED = 2;
const GAME_OVER = 3;

// define playing elements
var asteroids; // array with asteroids
var explosion; // array with explosions (asteroid)
var gameState; // boolean keep track if game has been started
var hiscore; // highest score since start
var lasers; // array with all shots fired
var lives; // number of lives (left)
var myfont; // font
var numAsteroids; // total number of asteroids at beginning of level
var score; // score of current game
var ship; // the player

// pre load stuff
function preload() {
  myFont = loadFont('assets/HyperspaceBold.otf');
}

function setup() {
  // create canvas at full window size
  createCanvas(windowWidth, windowHeight);

  // set text font
  textFont(myFont);

  // initialize hi-score
  hiscore = 0;

  // every games starts with 5 lives
  gameState = GAME_NOT_STARTED;

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
  if (gameState !== GAME_STARTED) {
    drawGameTitle();
    return;
  }

  // animate the asteroids
  for (let a = 0; a < asteroids.length; a++) {
    // ship collided with an asteroid
    if (ship.hits(asteroids[a])) {
      lives--;
      if (lives > 0) {
        ship = new Ship();
      } else {
        drawGameStats();
        gameOver();
        break;
      }
    }

    asteroids[a].render();
    asteroids[a].update();
    asteroids[a].edges();
  }

  // check if any laser hits any asteroid
  for (let l = lasers.length - 1; l >= 0; l--) {
    // show the laser
    lasers[l].render();
    lasers[l].update();

    // remove laser when it leaves the scren
    if (lasers[l].offscreen()) {
      lasers.splice(l, 1);
    } else {
      for (let a = asteroids.length - 1; a >= 0; a--) {
        if (lasers[l].hits(asteroids[a])) {
          //increase score
          if (asteroids.size === 'SMALL') {
            score += 50;
          } else if (asteroids[a].size === 'MEDIUM') {
            score += 20;
          } else {
            score += 10;
          }

          // show explosion
          explosions.push(new Explosion(asteroids[a].pos, asteroids[a].vel, a));

          // breakup asteroid
          if (asteroids[a].size != 'SMALL') {
            var newAsteroids = asteroids[a].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }

          // remove asteroid and laser
          asteroids.splice(a, 1);
          lasers.splice(l, 1);
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

  // show explosions
  for (let x = explosions.length - 1; x >= 0; x--) {
    explosions[x].update();
    explosions[x].show();

    // remove explosions when finished
    if (explosions[x].particles.length <= 0) explosions.splice(x, 1);
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
  text('INSPIRED BY \u00A91979 ATARI INC', width / 2, height - 20);
}

// draw game statistics
function drawGameStats() {
  fill(255);
  noStroke();
  textSize(20);

  textAlign(RIGHT, CENTER);
  text('Score:', 115, 20);
  text('Hi-Score:', 115, 40);
  text('Ratio:', 115, 60);
  text('Lives:', 115, 90);

  textAlign(LEFT);
  text(score, 120, 20);
  text(hiscore, 120, 40);

  // draw hit mis ratio
  push();
  noFill();
  stroke(255);
  rect(120, 52, 100, 20);

  var ratio = round(lasers.hits / lasers.total * 100);
  ratio = nf(ratio, 0, 0);
  if (ratio > 0) {
    fill(255, 100);
    noStroke();
    rect(120, 52, ratio, 20);
  }
  pop();

  // draw ratio text
  if (ratio >= 0) text(ratio + '%', 230, 60);

  // draw a ship for each life
  var x = 125;
  var y = 92;
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
  textAlign(CENTER, CENTER);
  textSize(64);
  text('ASTEROIDS', width * 0.5, height * 0.5);
  textSize(32);

  if (gameState === GAME_PAUSED) {
    myText = 'PRESS P TO CONTINUE';
  } else {
    myText = 'PRESS SPACE TO START';
  }
  text(myText, width * 0.5, height * 0.5 + 48);
}

// game over
function gameOver() {
  // pause game loop
  gameState = GAME_OVER;

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
  // array with explosions
  explosions = [];

  // every game starts with 5 lives; increases by one after every level
  lives = 5;

  // every game starts with 5 asteroids; inceases by one after avery level
  numAsteroids = 5;

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
    if (gameState === GAME_STARTED) {
      lasers.push(new Laser(ship.pos, ship.heading));
    } else if (gameState === GAME_NOT_STARTED || gameState === GAME_OVER) {
      gameState = GAME_STARTED;
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

    // P-key; pause or unpause game
  } else if (key === 'P') {
    if (gameState === GAME_NOT_STARTED || gameState === GAME_OVER) return;
    gameState = (gameState === GAME_PAUSED ? GAME_STARTED : GAME_PAUSED);
  }
}

// what happens when the key is released
function keyReleased() {
  ship.setRotation(0);
  ship.boosting(false);
}

function pauseGame() {
  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
