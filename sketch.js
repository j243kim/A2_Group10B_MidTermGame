/*
 * TBI Game - Group 10B
 * GBDA 302: Global Digital Project 2 (Winter 2026)
 *
 * Mechanics:
 * - Memory Fade (objective disappears; press M to recall briefly)
 * - Sensory Overload + Calm Zone (overload rises; recover in calm zone)
 *
 * Design Notes:
 * - Designed with TBI accessibility in mind: reduced visual noise, calm colors,
 *   plain language, clear hierarchy.
 * - Low sensory mode reduces pulsing, motion and visual effects.
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

// ==================== PLAYER ====================
let playerX = 100;
let playerY = 300;
let playerSize = 20;
let playerSpeed = 3;

// ==================== COLLECTIBLES ====================
let stars = [];
let starsNeeded = 5;

// ==================== MECHANIC 1: MEMORY FADE ====================
let objective = "";
let showObjective = true;
let memoryTimer = 300; // counts down; when hits 0 objective fades (or disappears)

// ==================== MECHANIC 2: OVERLOAD + RECOVERY ====================
let overload = 0;
let overloadMax = 100;

// Calm Zone (recovery area)
let calmX = 650;
let calmY = 320;
let calmSize = 120;

// ==================== LEVEL / CHECKPOINTS ====================
// Level phases:
// 0 = tutorial (no overload pressure, objective visible)
// 1 = memory phase (objective fades, M hint emphasized)
// 2 = combined (overload active + memory fade)
let levelPhase = 0;

// Checkpoints: respawn points to help first-time players finish
let checkpoints = [];
let checkpointIndex = 0;
let checkpointJustReached = false;
let checkpointToastTimer = 0;

// Limited respawns before true Game Over (for fairness)
let respawnsLeft = 3;

// Low sensory mode for Accessibility
let lowSensoryMode = false;

// Small helper: stars collected count
function starsCollected() {
  return starsNeeded - stars.length;
}

// Draw a rounded semi-transparent panel
function drawPanel(x, y, w, h, r) {
  noStroke();
  fill(20, 22, 44, 200);
  rectMode(CORNER);
  rect(x, y, w, h, r || 8);
}

// ==================== p5 SETUP/DRAW ====================
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

// ==================== SCREENS ====================
function drawStartScreen() {
  background(28, 30, 55);

  //ubtle static background dots (low visual noise)
  if (!lowSensoryMode) {
    for (let i = 0; i < 30; i++) {
      let bx = (i * 137 + 20) % CANVAS_W;
      let by = (i * 89 + 40) % CANVAS_H;
      fill(255, 255, 255, 12);
      noStroke();
      ellipse(bx, by, 3, 3);
    }
  }

  fill(255, 215, 90); // near-white
  textSize(40);
  textStyle(BOLD);
  text("TBI GAME: Collect the Stars ★", CANVAS_W / 2, CANVAS_H / 3);

  textSize(18);
  fill(160, 160, 180);
  text(
    "A accessible game for Traumatic Brain Injury",
    CANVAS_W / 2,
    CANVAS_H / 3 + 50,
  );

  textSize(14);
  fill(230, 230, 240);
  text("Arrow keys -> Move", CANVAS_W / 2, CANVAS_H / 3 + 85);
  text("M -> Recall objective", CANVAS_W / 2, CANVAS_H / 3 + 105);
  text("Calm Zone -> Reduce overload", CANVAS_W / 2, CANVAS_H / 3 + 125);

  textSize(14);
  fill(160, 160, 180);
  text(
    "**Press L anytime to toggle Low Sensory Mode",
    CANVAS_W / 2,
    CANVAS_H / 3 + 145,
  );

  textSize(20);
  fill(255);
  text("Press ENTER to START!", CANVAS_W / 2, CANVAS_H * 0.7);
}

function drawPlayScreen() {
  background(40, 40, 80);

  updateGame();
  drawLevel();

  checkWinCondition();
  // Lose condition handled via respawn system (see checkLoseOrRespawn)
  checkLoseOrRespawn();
}

function drawWinScreen() {
  background(30, 80, 30);

  fill(255);
  textSize(40);
  text("You Win!", CANVAS_W / 2, CANVAS_H / 3);

  textSize(18);
  fill(220);
  text("You collected all stars.", CANVAS_W / 2, CANVAS_H / 3 + 55);

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
  fill(220);
  text("Overload reached maximum.", CANVAS_W / 2, CANVAS_H / 3 + 55);

  textSize(18);
  fill(200);
  text("Press ENTER to Try Again", CANVAS_W / 2, CANVAS_H * 0.65);
}

// ==================== GAME RESET / LEVEL SETUP ====================
function resetGame() {
  // Player
  playerX = 100;
  playerY = 300;

  // Objective + memory
  objective = "Collect " + starsNeeded + " stars";
  showObjective = true;
  memoryTimer = 999999; // keep visible during phase 0

  // Overload
  overload = 0;

  // Level phase
  levelPhase = 0;

  // Respawns
  respawnsLeft = 3;

  // Calm zone position (later in the level feel)
  calmX = 650;
  calmY = 320;
  calmSize = 120;

  // Checkpoints (start + mid + near calm zone)
  checkpoints = [
    { x: 100, y: 300, label: "Start" },
    { x: 380, y: 300, label: "Mid" },
    { x: 620, y: 320, label: "Near Calm Zone" },
  ];
  checkpointIndex = 0;
  checkpointJustReached = false;
  checkpointToastTimer = 0;

  // Stars: intentionally placed to “teach then combine”
  // - 2 easy near start (tutorial)
  // - 1 mid (forces some travel, starts memory)
  // - 2 far near calm zone (combined with overload)
  stars = [
    { x: 180, y: 240, size: 15 },
    { x: 220, y: 360, size: 15 },
    { x: 420, y: 160, size: 15 },
    { x: 610, y: 190, size: 15 },
    { x: 730, y: 420, size: 15 },
  ];

  gameState = STATE_START;
}

// ==================== UPDATE ====================
function updateGame() {
  // -------- PLAYER MOVEMENT --------
  if (keyIsDown(LEFT_ARROW)) playerX -= playerSpeed;
  if (keyIsDown(RIGHT_ARROW)) playerX += playerSpeed;
  if (keyIsDown(UP_ARROW)) playerY -= playerSpeed;
  if (keyIsDown(DOWN_ARROW)) playerY += playerSpeed;

  playerX = constrain(playerX, 0, CANVAS_W);
  playerY = constrain(playerY, 0, CANVAS_H);

  // -------- LEVEL PROGRESSION (teach -> combine) --------
  // Phase transitions based on stars collected
  // Phase 0: collect 2 stars without pressure
  if (levelPhase === 0 && starsCollected() >= 2) {
    levelPhase = 1;
    // Start memory fade
    showObjective = true;
    memoryTimer = 240; // ~4 seconds
    // Checkpoint after learning the goal
    setCheckpoint(1);
  }

  // Phase 1: memory fade emphasized, still low overload pressure
  if (levelPhase === 1 && starsCollected() >= 3) {
    levelPhase = 2;
    // Make memory more challenging when combined
    memoryTimer = min(memoryTimer, 180);
    // Checkpoint before full overload pressure
    setCheckpoint(2);
  }

  // -------- MECHANIC 1: MEMORY FADE --------
  if (levelPhase >= 1) {
    memoryTimer -= 1;
    if (memoryTimer <= 0) {
      showObjective = false; // fade/lose clarity
    }
  } else {
    // Tutorial: keep objective visible
    showObjective = true;
  }

  // -------- MECHANIC 2: OVERLOAD + RECOVERY --------
  // Overload rate changes per phase
  let overloadRate = 0;
  if (levelPhase === 0) overloadRate = 0; // teach movement + collecting
  if (levelPhase === 1) overloadRate = 0.02; // gentle pressure
  if (levelPhase === 2) overloadRate = 0.07; // real pressure (combined)

  overload += overloadRate;

  // Recover if player in calm zone
  let dCalm = dist(playerX, playerY, calmX, calmY);
  let inCalm = dCalm < calmSize / 2;

  if (inCalm) {
    // faster recovery in combined phase
    overload -= levelPhase === 2 ? 1.1 : 0.8;
  }

  overload = constrain(overload, 0, overloadMax);

  // -------- COLLECT STARS --------
  for (let i = stars.length - 1; i >= 0; i--) {
    let s = stars[i];
    let dStar = dist(playerX, playerY, s.x, s.y);
    if (dStar < playerSize / 2 + s.size / 2 + 6) {
      stars.splice(i, 1);

      // Small reward: briefly show objective again when collecting (helps first-time players)
      if (levelPhase >= 1) {
        showObjective = true;
        memoryTimer = max(memoryTimer, 90); // ~1.5 seconds minimum
      }
    }
  }

  // -------- CHECKPOINT TOAST TIMER --------
  if (checkpointToastTimer > 0) checkpointToastTimer--;
}

// ==================== WIN / LOSE ====================
function checkWinCondition() {
  if (stars.length === 0) {
    gameState = STATE_WIN;
  }
}

// Instead of immediate game over, allow respawn at last checkpoint a few times
function checkLoseOrRespawn() {
  if (overload >= overloadMax) {
    if (respawnsLeft > 0) {
      respawnsLeft--;

      // Respawn at last checkpoint, reduce overload so they can continue
      respawnAtCheckpoint();

      // Make it feel like a “recovery moment”
      overload = 55; // not zero, still challenging

      // Briefly show objective to reduce confusion after respawn
      showObjective = true;
      memoryTimer = 150;
    } else {
      gameState = STATE_LOSE;
    }
  }
}

function respawnAtCheckpoint() {
  let cp = checkpoints[checkpointIndex];
  playerX = cp.x;
  playerY = cp.y;
}

// ==================== CHECKPOINT HELPERS ====================
function setCheckpoint(newIndex) {
  if (newIndex <= checkpointIndex) return; // never go backwards
  checkpointIndex = newIndex;
  checkpointJustReached = true;
  checkpointToastTimer = 140; // ~2.3 seconds
}

// ==================== DRAW ====================
function drawLevel() {
  // Simple “overload haze” when high
  if (overload > 65 && !lowSensoryMode) {
    fill(255, 255, 255, map(overload, 65, 100, 10, 55));
    rectMode(CORNER);
    rect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Calm Zone (with stronger visual when important)
  drawCalmZone();

  // Checkpoint marker (subtle)
  drawCheckpointMarker();

  // Stars
  noStroke();
  fill(255, 220, 100);
  for (let s of stars) {
    ellipse(s.x, s.y, s.size, s.size);
  }

  // Player
  fill(255);
  ellipse(playerX, playerY, playerSize, playerSize);

  // Goal / Objective UI
  drawObjectiveUI();

  // Overload UI + hints
  drawOverloadBar();

  // Checkpoint toast
  drawCheckpointToast();

  // Controls hint
  drawControlHints();
}

function drawCalmZone() {
  rectMode(CENTER);
  noStroke();

  // Pulse a bit in combined phase so players understand it's important
  let pulse = 0;
  if (levelPhase === 2 && !lowSensoryMode) {
    pulse = sin(frameCount * 0.08) * 6;
  }

  fill(100, 200, 200);
  rect(calmX, calmY, calmSize + pulse, calmSize + pulse, 12);

  // Border
  noFill();
  stroke(220);
  strokeWeight(2);
  rect(calmX, calmY, calmSize + pulse + 10, calmSize + pulse + 10, 14);
  noStroke();

  fill(0);
  textSize(12);
  text("Calm Zone", calmX, calmY);

  // If player is inside, show explicit feedback
  let dCalm = dist(playerX, playerY, calmX, calmY);
  if (dCalm < calmSize / 2) {
    fill(180, 255, 220);
    textSize(12);
    text("Recovering…", calmX, calmY + 20);
  }
}

function drawCheckpointMarker() {
  // draw a small marker for the CURRENT checkpoint (helps explain “checkpoint” concept)
  let cp = checkpoints[checkpointIndex];
  fill(255, 255, 255, 40);
  ellipse(cp.x, cp.y, 34, 34);

  fill(255, 255, 255, 70);
  textSize(10);
  text("CP", cp.x, cp.y);
}

function drawObjectiveUI() {
  textAlign(CENTER, CENTER);

  // Objective line (Memory Fade)
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

  // Phase-based tutorial prompt (clear goals for first-time players)
  textSize(12);
  fill(220);

  if (levelPhase === 0) {
    text("Collect the nearby stars to learn the goal.", CANVAS_W / 2, 52);
  } else if (levelPhase === 1) {
    text("Forgot the goal? Press M to recall it.", CANVAS_W / 2, 52);
  } else if (levelPhase === 2) {
    text(
      "Manage overload: reach the Calm Zone if it gets too high.",
      CANVAS_W / 2,
      52,
    );
  }

  // Reset align
  textAlign(CENTER, CENTER);
}

function drawCheckpointToast() {
  if (checkpointToastTimer > 0) {
    let cp = checkpoints[checkpointIndex];
    let alpha = map(checkpointToastTimer, 140, 0, 220, 0);

    fill(0, alpha * 0.6);
    rectMode(CENTER);
    rect(CANVAS_W / 2, CANVAS_H - 70, 240, 34, 8);

    fill(255, alpha);
    textSize(14);
    text("Checkpoint reached: " + cp.label, CANVAS_W / 2, CANVAS_H - 70);
  }
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
  rect(20, 75, 140, 12);

  // Filled amount
  let w = map(overload, 0, overloadMax, 0, 140);
  fill(255, 80, 80);
  rect(20, 75, w, 12);

  // Warnings / clarity
  if (overload > 85) {
    fill(255, 200, 200);
    textSize(12);
    text("Too much input!", 20, 98);
  } else if (levelPhase >= 1) {
    fill(220);
    textSize(12);
    text("Go to Calm Zone for recovery.", 20, 98);
  }

  // Respawns UI
  textAlign(LEFT, CENTER);
  fill(220);
  textSize(12);
  text("Respawns left: " + respawnsLeft, 20, 118);

  // Reset align
  textAlign(CENTER, CENTER);
}

function drawControlHints() {
  drawPanel(0, CANVAS_H - 40, CANVAS_W, 40, 0);
  textAlign(CENTER, CENTER);
  textSize(12);
  fill(160, 160, 180);
  text(
    "Arrow keys -> Move | M -> Recall objective | L -> Low Sensory Mode" +
      (lowSensoryMode ? " [LOW SENSORY ON] " : ""),
    CANVAS_W / 2,
    CANVAS_H - 20,
  );
}
// ==================== INPUT HANDLING ====================
function keyPressed() {
  if (keyCode === ENTER) {
    if (
      gameState === STATE_START ||
      gameState === STATE_WIN ||
      gameState === STATE_LOSE
    ) {
      gameState = STATE_PLAY;
      resetGame();
      gameState = STATE_PLAY; // resetGame sets START, so override
    }
  }

  if (gameState === STATE_PLAY && (key === "m" || key === "M")) {
    // Recall objective briefly
    showObjective = true;

    // The later the phase, the shorter the recall (harder)
    if (levelPhase === 1) memoryTimer = 120;
    if (levelPhase === 2) memoryTimer = 90;
  }

  if (key === "l" || key === "L") {
    lowSensoryMode = !lowSensoryMode;
  }
}

function mousePressed() {
  // optional
}
