// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

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
  text('Score:', 115, 10);
  text('Hi-Score:', 115, 30);
  text('Ratio:', 115, 50);
  text('FPS:', 115, 70);
  text('Lives:', 115, 90);

  textAlign(LEFT);
  text(score, 120, 10);
  text(hiscore, 120, 30);
  if (frameCount % 60 === 1) fps = floor(frameRate());
  text(fps, 120, 70);

  // draw hit mis ratio
  push();
  noFill();
  stroke(255);
  rect(120, 42, 100, 20);

  var ratio = round(lasers.hits / lasers.total * 100);
  ratio = nf(ratio, 0, 0);
  if (ratio > 0) {
    fill(255, 100);
    noStroke();
    rect(120, 42, ratio, 20);
  }
  pop();

  // draw ratio text
  if (ratio >= 0) text(ratio + '%', 230, 50);

  // draw a ship for each life
  var x = 125;
  var y = 97;
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
  if (score > hiscore) hiscore = score;

  // remove game elements
  ship = null;
  lasers = [];
  asteroids = [];
}

// initate a new game
function initGame() {
  // every game starts with 5 lives; increases by one after every level
  lives = 5;

  // every game starts with 5 asteroids; inceases by one after avery level
  numAsteroids = 5;

  // reset score
  score = 0;

  // start new initLevel
  initLevel();
}

function initLevel() {
  // array with explosions
  explosions = [];

  // add a new ship
  ship = new Ship();

  // create lasers
  lasers = [];
  lasers.hits = 0;
  lasers.total = 0;

  // create new asteroids
  asteroids = [];
  for (var i = 0; i < numAsteroids; i++) {
    asteroid = new Asteroid();

    // do not place asteroids near the ship
    if (asteroid.pos.x < width * 0.5 - 100 || asteroid.pos.x > width * 0.5 + 100 ||
      asteroid.pos.y < height * 0.5 - 100 || asteroid.pos.y > height * 0.5 + 100) {
      asteroids.push(new Asteroid());
    } else {
      i--;
    }
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
    ship.setRotation(0.05);

    // LEFT ARROW; turn player counter clock wise
  } else if (keyCode === LEFT_ARROW) {
    ship.setRotation(-0.05);

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
