// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

function mousePressed() {
  if (gameState === GAME_PAUSED || gameState === GAME_NOT_STARTED) {
    gameState = GAME_STARTED;
  }
}
