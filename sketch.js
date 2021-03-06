// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

// setup constants to keep track of game state
const GAME_NOT_STARTED = 0;
const GAME_STARTED = 1;
const GAME_DEMO = 2;
const GAME_PAUSED = 3;
const GAME_SHIP_DESTROYED = 4;
const GAME_OVER = 5;

// game mode
const KEYBOARD_MODE = 0;
const MOUSE_MODE = 1;

// define playing elements
var asteroids = []; // array with asteroids
var cheats = false; // enable cheats
var debug = true; // debug mode
var explosions = []; // array with explosions (asteroid)
var fps = 0; // current framerate (take with 1 second interval)
var gameMode = KEYBOARD_MODE; // game mode either keyboard or mouse/touch
var gameState = GAME_NOT_STARTED; // boolean keep track if game has been started
var hiscore = 0; // highest score since start
var lastInteraction = 0; // last frame-number user interacted with system
var lasers = []; // array with all shots fired
var lives = 3; // number of lives (left)
var myfont = ''; // font
var numAsteroids = 5; // total number of asteroids at beginning of the game
var score = 0; // score of current game
var ship = null; // the player


// temporary stuff
var vehicles = [];

// pre load required assets (fonts, sounds, images)
function preload() {
  myFont = loadFont('assets/HyperspaceBold.otf');
}

// runs once when started (eg. F5)
function setup() {
  // create canvas at full window size
  createCanvas(windowWidth, windowHeight);

  // set text font
  textFont(myFont);

  // start a new game
  newGame();

  // temporarily add steering behaviour vehicles
  vehicles.push(new Vehicle(width * 0.5, height * 0.5));
}

// loops every frame
function draw() {
  // space is a dark place
  background(0);

  // draw the game stats
  drawGameStats();

  // draw the Atari Copyright
  drawAtariCopyright();

  // switch to demo mode after certain inactivity
  if (gameState !== GAME_DEMO && gameState != GAME_STARTED && frameCount - lastInteraction > 300) {
    gameState = GAME_DEMO;
  }

  // wait for player to start the game
  if (gameState !== GAME_STARTED && gameState !== GAME_SHIP_DESTROYED && gameState !== GAME_DEMO) {
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

  // check if the ship hit an asteroid
  if (gameState !== GAME_SHIP_DESTROYED) checkShipAsteroid();

  // start a new level when all asteroids are destroyed
  if (asteroids.length === 0) {
    lives++; // player gets an extra life
    numAsteroids++; // add one more asteroid
    newLevel(); // start a new level
    gameState = GAME_PAUSED; // pause the game
  }

  // draw steering behaviour vehicles
  if (gameState === GAME_DEMO || cheats) {
    for (var i = vehicles.length - 1; i >= 0; i--) {
      // vehicles[i].boundaries();
      vehicles[i].SeekAndDestroy();
      vehicles[i].update();
      vehicles[i].display();
    }
  }
}
