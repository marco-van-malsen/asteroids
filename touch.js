// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

function touchStarted() {
  if (gameState === GAME_PAUSED || gameState === GAME_NOT_STARTED) {
    gamestate = GAME_STARTED;
  } else if (gameState === GAME_STARTED) {
    ship.heading = createVector(touches[0].x - ship.pos.x, touches[0].y - ship.pos.y);
  }
  
  // draw circle
  ellipse(mouseX, mouseY, 24, 24);
  
  // prevent default browser behavior
  return false;
}
