// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

function mousePressed() {
  // record last user interaction
  lastInteraction = frameCount;

  // ignore when not in mouse mode
  // if (gameMode != MOUSE_MODE) return;

  if (gameState === GAME_PAUSED || gameState === GAME_NOT_STARTED) {
    gameMode = MOUSE_MODE;
    gameState = GAME_STARTED;

  } else if (gameMode === MOUSE_MODE && gameState === GAME_STARTED) {
    // lasers.push(new Laser(ship.pos, ship.vel.heading()));
    lasers.push(new Laser(vehicles[0].pos, vehicles[0].vel.heading()));
  }

  // prevent default behavoir
  return false;
}

function mouseMoved() {
  // ignore when not in mouse mode
  if (gameMode != MOUSE_MODE) return;
  ship.seek();
}

function mouseDragged() {
  // ignore when not in mouse mode
  if (gameMode != MOUSE_MODE) return;

  // vehicle follows mouse
  ship.seek();
}
