// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

// check if laser hit asteroids
function checkLaserAsteroid() {
  // check all lasers
  for (let l = lasers.length - 1; l >= 0; l--) {
    // check all asteroids
    for (let a = asteroids.length - 1; a >= 0; a--) {
      // a laser hit an asteroid
      if (lasers[l].hits(asteroids[a])) {
        // increase score
        if (asteroids.size === 'SMALL') {
          score += 50;
        } else if (asteroids[a].size === 'MEDIUM') {
          score += 20;
        } else {
          score += 10;
        }

        // add an explosion
        explosions.push(new Explosion(asteroids[a].pos, 'asteroid'));

        // add two new asteroids
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

// check if laser hit asteroids
function checkShipAsteroid() {
  // check if player hits an asteroids
  for (let a = 0; a < asteroids.length; a++) {
    // ship collided with an asteroid
    if (ship.hits(asteroids[a])) {
      // change game state
      gameState = GAME_SHIP_DESTROYED;

      // add explosion
      explosions.push(new Explosion(ship.pos, 'ship'));

      // do not check anything else
      break;
    }
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
  // set text alignment
  textAlign(CENTER, CENTER);

  // draw game title
  textSize(64);
  text('ASTEROIDS', width * 0.5, height * 0.5);

  // draw instructions
  if (gameState === GAME_PAUSED) {
    myText = 'PRESS C TO CONTINUE';
  } else {
    myText = 'PRESS SPACE TO START';
  }
  textSize(32);
  text(myText, width * 0.5, height * 0.5 + textSize() * 2);
}

// player lost a life
function gameMinusOne() {
  // reduce number of lives
  lives--;

  if (lives > 0) {
    gameState = GAME_STARTED;
    newLevel();
  } else {
    gameOver();
    newGame();
  }
}

// game over
function gameOver() {
  // pause game loop
  gameState = GAME_OVER;

  // update hi-score
  if (score > hiscore) hiscore = score;
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
  } else if (key === 'C') {
    if (gameState === GAME_PAUSED) gameState = GAME_STARTED;

  } else if (key === 'P') {
    if (gameState === GAME_STARTED) gameState = GAME_PAUSED;
  }
}

// what happens when the key is released
function keyReleased() {
  ship.setRotation(0);
  ship.boosting(false);
}

// create a new game
function newGame() {
  // every game starts with 5 lives; increases by one after every level
  lives = 3;

  // every game starts with 5 asteroids; inceases by one after avery level
  numAsteroids = 5;

  // reset score
  score = 0;

  // start new initLevel
  newLevel();
}

// create a new level
function newLevel() {
  // create new asteroids
  createAsteroids();

  // add a new ship
  ship = new Ship();

  // empty out the array with lasers; reset stats
  lasers = [];
  lasers.hits = 0;
  lasers.total = 0;

  // empty out the array with explosions
  explosions = [];
}

// responsive UI
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
