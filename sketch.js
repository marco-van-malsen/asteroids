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
var fps; // current framerate (take with 1 second interval)
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

  // show explosions
  var shipExploded = false;
  for (let x = explosions.length - 1; x >= 0; x--) {
    // check if ship has exploded
    if (explosions[x].type === 'ship') shipExploded = true;

    // show explosion
    explosions[x].update();

    // remove explosions when finished
    if (explosions[x].particles.length > 0) {
      explosions[x].show();
    } else {
      explosions.splice(x, 1);
    }
  }

  // animate the asteroids
  for (let a = 0; a < asteroids.length; a++) {
    // ship collided with an asteroid
    if (ship.hits(asteroids[a])) {
      // show explosion
      explosions.push(new Explosion(ship.pos, 'ship'));
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

  // wait for ship explision to finish
  if (shipExploded) return;

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
          explosions.push(new Explosion(asteroids[a].pos, 'asteroid'));

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

  // start a new level
  // user gets a new life afeter every level
  if (asteroids.length === 0) {
    lives++;
    numAsteroids++;
    initLevel();
  }
}
