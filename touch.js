// Asteroids game
// Original: Daniel Shiffman
// Extended: Marco van Malsen

function mouseClicked() {
  if (gameState === GAME_PAUSED || gameState === GAME_NOT_STARTED) {
    gameState = GAME_STARTED;
  } else if (gameState === GAME_STARTED) {
    // 0,0 coordinate is in upper left corner of window
    // angles are in radians; zero angle is along X-axis in positive direction

    // take the absolute distance along X and Y axis
    let deltaX = abs(mouseX - ship.pos.x);
    let deltaY = abs(mouseY - ship.pos.y);

    // calculate new heading (lower right quadrant)
    // always returns a number between zero and HALF_PI
    let newHeading = atan(deltaY / deltaX);

    // adjust angle based on where the user clicked
    // user clicked to the left and below the ship (lower left quadrant)
    if (mouseX < ship.pos.x && mouseY > ship.pos.y) {
      newHeading += HALF_PI;

      // user clicked to the left and above the ship (upper left quadrant)
    } else if (mouseX < ship.pos.x && mouseY < ship.pos.y) {
      newHeading += PI;

      // user click to the right and above the ship (upper right quadrant)
    } else if (mouseX > ship.pos.x && mouseY < ship.pos.y) {
      newHeading += PI + HALF_PI;
    }

    // send new heading to the ship
    ship.newHeading = newHeading;
  }
}
