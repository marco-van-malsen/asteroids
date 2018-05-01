// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

const GAME_NOT_STARTED = 0;
const GAME_STARTED = 1;
const GAME_PAUSED = 2;
const GAME_SHIP_DESTROYED = 3;
const GAME_OVER = 4;

// define playing elements
var asteroids = []; // array with asteroids
var explosions = []; // array with explosions (asteroid)
var fps = 0; // current framerate (take with 1 second interval)
var gameState = GAME_NOT_STARTED; // boolean keep track if game has been started
var hiscore = 0; // highest score since start
var lasers = []; // array with all shots fired
var lives = 5; // number of lives (left)
var myfont = ''; //5 font
var numAsteroids = 5; // total number of asteroids at beginning of the game
var score = 0; // score of current game
var ship = null; // the player

// pre load stuff
function preload() {
  myFont = loadFont('assets/HyperspaceBold.otf');
}

function setup() {
  // create canvas at full window size
  createCanvas(windowWidth, windowHeight);

  // set text font
  textFont(myFont);

  // initiate a new game
  newGame();
}

function draw() {
  // space is a dark place
  background(0);

  // draw the score
  drawGameStats();

  // draw the Atari Copyright
  drawAtariCopyright();

  // Wait for player to start the game
  if (gameState !== GAME_STARTED && gameState !== GAME_SHIP_DESTROYED) {
    drawGameTitle();
    return;
  }

  // draw the asteroids
  drawAsteroids();

  // draw lasers
  drawLasers();

  // draw the ship
  if (gameState !== GAME_SHIP_DESTROYED) drawShip();

  // draw explosions
  drawExplosions();

  // check if a laser hit an asteroid
  checkLaserAsteroid();

  // check if a laser hit an asteroid
  if (gameState !== GAME_SHIP_DESTROYED) checkShipAsteroid();

  // start a new level
  if (asteroids.length === 0) {
    // player gets an extra life
    lives++;

    // add one more asteroid
    numAsteroids++;

    // start a new level
    newLevel();

    // pause the game
    gameState = GAME_PAUSED;
  }
}
