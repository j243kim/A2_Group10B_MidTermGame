/*
 * TBI Game - Group 10B
 * GBDA 302: Global Digital Project 2 (Winter 2026)
 *
 * - Mechanic 1: Memory Fade (objective disappears; press M to recall briefly)
 * - Mechanic 2: Sensory Overload + Calm Zone (overload rises; recover in calm zone)
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

// Player
let playerX = 100;
let playerY = 300;
let playerSize = 20;

// Collectibles (stars/fragments)
let stars = [];
let starsNeeded = 5;

// Mechanic 1: Memory Fade
let objective = "Collect 5 stars";
let showObjective = true;
let memoryTimer = 300; // counts down; when it hits 0 objective disappears

// Mechanic 2: Sensory Overload + Recovery
let overload = 0;
let overloadMax = 100;

// Calm zone (recovery area)
let calmX = 650;
let calmY = 300;
let calmSize = 110; // square size

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

  textSize(14);
  fill(200);
  text("Move: Arrow keys | Recall objective: M", CANVAS_W / 2, CANVAS_H / 3 + 85);
  text("Stand in Calm Zone to recover overload", CANVAS_W / 2, CANVAS_H / 3 + 105);

  textSize(20);
  fill(255);
  text("Press ENTER to Start", CANVAS_W / 2, CANVAS_H * 0.65);
}

function drawPlayScreen() {
  background(40, 40, 80);

  // --- UPDATE GAME LOGIC HERE ---
  updateGame();

  // --- DRAW GAME ELEMENTS HERE ---
  drawLevel();

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
  if (overload >= overloadMax) {
    text("Overload reached maximum.", CANVAS_W / 2, CANVAS_H / 3 + 50);
  } else {
    text("Press ENTER to Try Again", CANVAS_W / 2, CANVAS_H * 0.65);
  }

  textSize(18);
  fill(200);
  text("Press ENTER to Try Again", CANVAS_W / 2, CANVAS_H * 0.65);
}

// ==================== GAME LOGIC ====================

function resetGame() {
  // Reset all game variables to their initial state here

  // Player
  playerX = 100;
  playerY = 300;

  // Mechanic 1
  objective = "Collect " + starsNeeded + " stars";
  showObjective = true;
  memoryTimer = 300;

  // Mechanic 2
  overload = 0;

  // Stars
  stars = [];
  for (let i = 0; i < starsNeeded; i++) {
    stars.push({
      x: random(200, 740),
      y: random(80, 520),
      size: 15,
    });
  }

  gameState = STATE_START;
}

function updateGame() {
  // -------- PLAYER MOVEMENT --------
  if (keyIsDown(LEFT_ARROW)) playerX -= 3;
  if (keyIsDown(RIGHT_ARROW)) playerX += 3;
  if (keyIsDown(UP_ARROW)) playerY -= 3;
  if (keyIsDown(DOWN_ARROW)) playerY += 3;

  playerX = constrain(playerX, 0, CANVAS_W);
  playerY = constrain(playerY, 0, CANVAS_H);

  // -------- Mechanic 1: MEMORY FADE --------
  memoryTimer -= 1;
  if (memoryTimer <= 0) {
    showObjective = false;
  }

  // -------- Mechanic 2: OVERLOAD + RECOVERY --------
  // Overload slowly rises over time
  overload += 0.05;

  // Recover if player is in calm zone
  let dCalm = dist(playerX, playerY, calmX, calmY);
  if (dCalm < calmSize / 2) {
    overload -= 0.8;
  }

  overload = constrain(overload, 0, overloadMax);

  // -------- Collect stars --------
  for (let i = stars.length - 1; i >= 0; i--) {
    let s = stars[i];
    let dStar = dist(playerX, playerY, s.x, s.y);
    if (dStar < (playerSize / 2) + (s.size / 2) + 6) {
      stars.splice(i, 1);
    }
  }
}

function checkWinCondition() {
  // Define when the player wins
  if (stars.length === 0) {
    gameState = STATE_WIN;
  }
}

function checkLoseCondition() {
  // Define when the player loses
  if (overload >= overloadMax) {
    gameState = STATE_LOSE;
  }
}

// ==================== DRAW HELPERS ====================

function drawLevel() {
  // Optional: light overlay when overload is high (simple, no trig)
  if (overload > 60) {
    fill(255, 255, 255, 30);
    rectMode(CORNER);
    rect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Calm Zone
  rectMode(CENTER);
  noStroke();
  fill(100, 200, 200);
  rect(calmX, calmY, calmSize, calmSize, 10);

  fill(0);
  textSize(12);
  text("Calm Zone", calmX, calmY);

  // Stars
  noStroke();
  fill(255, 220, 100);
  for (let s of stars) {
    ellipse(s.x, s.y, s.size, s.size);
  }

  // Player
  fill(255);
  ellipse(playerX, playerY, playerSize, playerSize);

  // Objective text (Memory Fade)
  textAlign(CENTER, CENTER);
  if (showObjective) {
    fill(255);
    textSize(18);
    text(objective, CANVAS_W / 2, 28);
  } else {
    // faint reminder (still readable but “harder”)
    fill(255, 90);
    textSize(18);
    text(objective, CANVAS_W / 2, 28);
  }

  // Overload meter
  drawOverloadBar();
}

function drawOverloadBar() {
  // Label
  textAlign(LEFT, CENTER);
  fill(255);
  textSize(14);
  text("Overload", 20, 60);

  // Background bar
  rectMode(CORNER);
  noStroke();
  fill(200);
  rect(20, 75, 120, 12);

  // Filled amount
  // (overload goes 0..100, bar width is 120)
  let w = map(overload, 0, overloadMax, 0, 120);
  fill(255, 80, 80);
  rect(20, 75, w, 12);

  // Small hint when in calm zone
  let dCalm = dist(playerX, playerY, calmX, calmY);
  if (dCalm < calmSize / 2) {
    fill(180, 255, 220);
    textSize(12);
    text("Recovering…", 20, 98);
  } else if (overload > 85) {
    fill(255, 200, 200);
    textSize(12);
    text("Too much input!", 20, 98);
  }

  // Controls hint
  textAlign(RIGHT, CENTER);
  fill(220);
  textSize(12);
  text("Press M to recall objective", CANVAS_W - 20, CANVAS_H - 18);

  // Reset align
  textAlign(CENTER, CENTER);
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

  // Kevin Mechanic 1: Recall objective
  if (gameState === STATE_PLAY && (key === "m" || key === "M")) {
    showObjective = true;
    memoryTimer = 120; // show again briefly (~2 seconds)
  }

  // Add gameplay key controls here (e.g., movement, actions)
}

function keyReleased() {
  // Handle key release events if needed
}

function mousePressed() {
  // Handle mouse click events if needed
}
