/*
 * TBI Game - Group 10B
 * GBDA 302: Global Digital Project 2 (Winter 2026)
 *
 * A game designed to foster understanding of Traumatic Brain Injury (TBI)
 * through engaging gameplay mechanics.
 */

// ==================== GAME STATES ====================
const STATE_START = "start";
const STATE_PLAY = "play";
const STATE_WIN = "win";
const STATE_LOSE = "lose";

let gameState = STATE_START;

// ==================== CANVAS SETTINGS ====================
const CANVAS_W = 800;
const CANVAS_H = 600;

// ==================== GAME VARIABLES ====================
// Add your game-specific variables here (player, enemies, timer, score, etc.)

function setup() {
  let canvas = createCanvas(CANVAS_W, CANVAS_H);
  canvas.parent("game-container");
  textAlign(CENTER, CENTER);
  resetGame();
}

function draw() {
  switch (gameState) {
    case STATE_START:
      drawStartScreen();
      break;
    case STATE_PLAY:
      drawPlayScreen();
      break;
    case STATE_WIN:
      drawWinScreen();
      break;
    case STATE_LOSE:
      drawLoseScreen();
      break;
  }
}

// ==================== GAME SCREENS ====================

function drawStartScreen() {
  background(30, 30, 60);

  fill(255);
  textSize(40);
  text("TBI Game", CANVAS_W / 2, CANVAS_H / 3);

  textSize(18);
  fill(200);
  text("A game about Traumatic Brain Injury", CANVAS_W / 2, CANVAS_H / 3 + 50);

  textSize(20);
  fill(255);
  text("Press ENTER to Start", CANVAS_W / 2, CANVAS_H * 0.65);
}

function drawPlayScreen() {
  background(40, 40, 80);

  // --- UPDATE GAME LOGIC HERE ---
  updateGame();

  // --- DRAW GAME ELEMENTS HERE ---
  // Placeholder text - replace with actual game rendering
  fill(255);
  textSize(16);
  text("Game is running - build your level here!", CANVAS_W / 2, 30);

  // Check win/lose conditions
  checkWinCondition();
  checkLoseCondition();
}

function drawWinScreen() {
  background(30, 80, 30);

  fill(255);
  textSize(40);
  text("You Win!", CANVAS_W / 2, CANVAS_H / 3);

  textSize(18);
  fill(200);
  text("Press ENTER to Play Again", CANVAS_W / 2, CANVAS_H * 0.65);
}

function drawLoseScreen() {
  background(80, 30, 30);

  fill(255);
  textSize(40);
  text("Game Over", CANVAS_W / 2, CANVAS_H / 3);

  textSize(18);
  fill(200);
  text("Press ENTER to Try Again", CANVAS_W / 2, CANVAS_H * 0.65);
}

// ==================== GAME LOGIC ====================

function resetGame() {
  // Reset all game variables to their initial state here
  gameState = STATE_START;
}

function updateGame() {
  // Update player, enemies, timers, physics, etc.
}

function checkWinCondition() {
  // Define when the player wins
  // Example: if (score >= targetScore) { gameState = STATE_WIN; }
}

function checkLoseCondition() {
  // Define when the player loses
  // Example: if (health <= 0) { gameState = STATE_LOSE; }
}

// ==================== INPUT HANDLING ====================

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === STATE_START || gameState === STATE_WIN || gameState === STATE_LOSE) {
      gameState = STATE_PLAY;
      resetGame();
      gameState = STATE_PLAY; // resetGame sets to START, so override
    }
  }

  // Add gameplay key controls here (e.g., movement, actions)
}

function keyReleased() {
  // Handle key release events if needed
}

function mousePressed() {
  // Handle mouse click events if needed
}
