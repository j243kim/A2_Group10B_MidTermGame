/*
 * "Fragmented" - A TBI Awareness Game
 * Group 10B, GBDA 302: Global Digital Project 2 (Winter 2026)
 * University of Waterloo
 *
 * A p5.js game about navigating daily tasks after a Traumatic Brain Injury.
 * Players experience memory difficulties and sensory overload through
 * gameplay mechanics rather than text-based explanation [5].
 *
 * Mechanics:
 * 1. Memory Fade - Objective text fades; press M to recall briefly.
 *    Represents short-term memory challenges common after TBI [1][2].
 * 2. Sensory Overload - Meter rises over time, faster in stimulus zones.
 *    Calm Zone recovers. Reflects sensory processing difficulties [3].
 * 3. Cognitive Fatigue - Movement speed decreases with overload [2].
 *
 * Accessibility:
 * - Low Sensory Mode (press L) reduces visual effects [4].
 * - Clear visual hierarchy and plain language [4].
 *
 * References (ACM format):
 * [1] Centers for Disease Control and Prevention. 2024. Get the Facts About
 *     TBI. Retrieved March 3, 2026 from
 *     https://www.cdc.gov/traumatic-brain-injury/data-research/facts-stats/
 * [2] B. Johansson, P. Berglund, and L. Ronnback. 2009. Mental fatigue and
 *     impaired information processing after mild and moderate traumatic brain
 *     injury. Brain Injury 23, 13-14, 1027-1040.
 * [3] H.L. Lew, J.H. Poole, S.B. Guillory, R.M. Salerno, G. Leskin, and
 *     B. Sigford. 2006. Persistent problems after traumatic brain injury:
 *     The need for long-term follow-up and coordinated care. Journal of
 *     Rehabilitation Research and Development 43, 2, 199-212.
 * [4] Game Accessibility Guidelines. 2012. Retrieved March 3, 2026 from
 *     https://gameaccessibilityguidelines.com/
 * [5] I. Bogost. 2007. Persuasive Games: The Expressive Power of Videogames.
 *     MIT Press, Cambridge, MA.
 */

// ===================== CONSTANTS =====================
const CANVAS_W = 800;
const CANVAS_H = 600;
const HUD_TOP = 65;
const HUD_BOTTOM = 38;
const PLAY_TOP = HUD_TOP;
const PLAY_BOTTOM = CANVAS_H - HUD_BOTTOM;

// ===================== GAME STATES =====================
const STATE_START = "start";
const STATE_PLAY = "play";
const STATE_WIN = "win";
const STATE_LOSE = "lose";
let gameState = STATE_START;

// ===================== AUDIO (Web Audio API) =====================
let audioCtx = null;
let audioReady = false;
let ambientOsc = null;
let ambientGain = null;

function initAudio() {
  if (audioReady) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioReady = true;
  } catch (e) {
    // Web Audio not supported — game still playable without sound
  }
}

// Generic tone generator
function playTone(freq, dur, type, vol) {
  if (!audioCtx) return;
  let osc = audioCtx.createOscillator();
  let g = audioCtx.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(vol || 0.1, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  osc.connect(g);
  g.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + dur + 0.05);
}

function playCollectSound() {
  playTone(523.25, 0.12, "sine", 0.15);
  setTimeout(() => playTone(659.25, 0.12, "sine", 0.12), 80);
  setTimeout(() => playTone(783.99, 0.18, "sine", 0.1), 160);
}

function playRecallSound() {
  playTone(440, 0.1, "triangle", 0.08);
  setTimeout(() => playTone(554.37, 0.15, "triangle", 0.06), 100);
}

function playRespawnSound() {
  playTone(330, 0.15, "sine", 0.08);
  setTimeout(() => playTone(392, 0.15, "sine", 0.08), 150);
}

function playCheckpointSound() {
  playTone(392, 0.12, "sine", 0.1);
  setTimeout(() => playTone(523.25, 0.18, "sine", 0.1), 120);
}

function playWinSound() {
  [523, 659, 784, 1047].forEach(function (f, i) {
    setTimeout(() => playTone(f, 0.25, "sine", 0.12), i * 180);
  });
}

function playLoseSound() {
  [300, 250, 200].forEach(function (f, i) {
    setTimeout(() => playTone(f, 0.3, "sawtooth", 0.05), i * 280);
  });
}

// Ambient drone that scales with overload [3]
function startAmbient() {
  if (!audioCtx || ambientOsc) return;
  ambientOsc = audioCtx.createOscillator();
  ambientGain = audioCtx.createGain();
  ambientOsc.type = "sine";
  ambientOsc.frequency.value = 65;
  ambientGain.gain.value = 0.008;
  ambientOsc.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);
  ambientOsc.start();
}

function stopAmbient() {
  if (ambientOsc) {
    try {
      ambientOsc.stop();
    } catch (e) {}
    ambientOsc = null;
    ambientGain = null;
  }
}

function updateAmbient() {
  if (!ambientGain || !ambientOsc) return;
  // Audio intensity scales with overload — creates sensory pressure [3]
  ambientGain.gain.value = map(overload, 0, overloadMax, 0.006, 0.055);
  ambientOsc.frequency.value = map(overload, 0, overloadMax, 60, 175);
}

// ===================== PLAYER =====================
let playerX, playerY;
const playerSize = 18;
const baseSpeed = 3;

// ===================== LEVEL DATA =====================
let walls = [];
let stimulusZones = [];
let calmZone = {};
let decorations = [];
let stars = [];
const starsNeeded = 5;

// ===================== MECHANICS =====================
// Memory Fade [1][2]
let objective = "";
let showObjective = true;
let memoryTimer = 999999;

// Sensory Overload [3]
let overload = 0;
const overloadMax = 100;

// Level phases (teach -> combine)
let levelPhase = 0;

// Checkpoints & respawns
let checkpoints = [];
let checkpointIndex = 0;
let checkpointToastTimer = 0;
let respawnsLeft = 3;

// Accessibility [4]
let lowSensoryMode = false;

// ===================== PARTICLES =====================
let particles = [];

// ===================== SOUND FLAGS =====================
let endSoundPlayed = false;
let overloadWarnCooldown = 0;
let calmSoundCooldown = 0;

// ===================== HELPERS =====================
function starsCollected() {
  return starsNeeded - stars.length;
}

// Circle-AABB collision for wall checks
function hitsWall(px, py) {
  let r = playerSize / 2;
  for (let i = 0; i < walls.length; i++) {
    let w = walls[i];
    let closestX = constrain(px, w.x, w.x + w.w);
    let closestY = constrain(py, w.y, w.y + w.h);
    let dx = px - closestX;
    let dy = py - closestY;
    if (dx * dx + dy * dy < r * r) return true;
  }
  return false;
}

// Point in rectangle check
function inRect(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

// Draw a 5-pointed star shape
function drawStarShape(cx, cy, r1, r2, npoints) {
  let angle = TWO_PI / npoints;
  let half = angle / 2.0;
  beginShape();
  for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += angle) {
    vertex(cx + cos(a) * r2, cy + sin(a) * r2);
    vertex(cx + cos(a + half) * r1, cy + sin(a + half) * r1);
  }
  endShape(CLOSE);
}

// Rounded panel
function drawPanel(x, y, w, h, r) {
  noStroke();
  fill(16, 18, 38, 210);
  rectMode(CORNER);
  rect(x, y, w, h, r || 6);
}

// ===================== p5.js SETUP =====================
function setup() {
  let canvas = createCanvas(CANVAS_W, CANVAS_H);
  canvas.parent("game-container");
  textAlign(CENTER, CENTER);
  initLevel();
}

// ===================== LEVEL INITIALIZATION =====================
function initLevel() {
  // Player start
  playerX = 80;
  playerY = 310;

  // Objective & memory
  objective = "Collect " + starsNeeded + " stars";
  showObjective = true;
  memoryTimer = 999999;

  // Overload
  overload = 0;

  // Phase
  levelPhase = 0;

  // Respawns
  respawnsLeft = 3;

  // Particles
  particles = [];

  // Sound flags
  endSoundPlayed = false;
  overloadWarnCooldown = 0;
  calmSoundCooldown = 0;

  // --- WALLS (create three connected rooms) ---
  walls = [
    // Divider 1: Room 1 | Room 2 — gap at y:250-335
    { x: 265, y: PLAY_TOP, w: 14, h: 185 },
    { x: 265, y: 335, w: 14, h: PLAY_BOTTOM - 335 },
    // Divider 2: Room 2 | Room 3 — gap at y:330-410
    { x: 505, y: PLAY_TOP, w: 14, h: 265 },
    { x: 505, y: 410, w: 14, h: PLAY_BOTTOM - 410 },
    // Room 2 internal obstacle
    { x: 350, y: 180, w: 105, h: 12 },
    // Room 3 internal obstacles
    { x: 600, y: 290, w: 12, h: 110 },
    { x: 650, y: 425, w: 110, h: 12 },
  ];

  // --- STIMULUS ZONES (increase overload faster) [3] ---
  stimulusZones = [
    { x: 252, y: 250, w: 42, h: 85 }, // Passage Room 1 -> 2
    { x: 492, y: 325, w: 42, h: 85 }, // Passage Room 2 -> 3
    { x: 555, y: 395, w: 85, h: 65 }, // Inside Room 3
  ];

  // --- CALM ZONE [3] ---
  calmZone = { x: 690, y: 120, w: 90, h: 90 };

  // --- DECORATIONS (visual only, no collision) ---
  decorations = [
    // Room 1
    { x: 35, y: 105, w: 60, h: 28, col: [60, 55, 80] },
    { x: 40, y: 95, w: 50, h: 8, col: [80, 75, 100] },
    { x: 175, y: 485, w: 38, h: 38, col: [50, 70, 50] },
    { x: 100, y: 150, w: 20, h: 35, col: [70, 60, 85] },
    // Room 2
    { x: 325, y: 425, w: 48, h: 32, col: [75, 60, 70] },
    { x: 435, y: 105, w: 30, h: 42, col: [70, 65, 80] },
    { x: 380, y: 350, w: 25, h: 25, col: [65, 70, 65] },
    // Room 3
    { x: 545, y: 485, w: 52, h: 26, col: [65, 60, 78] },
    { x: 720, y: 350, w: 40, h: 20, col: [70, 68, 82] },
  ];

  // --- STARS (placed to match phase progression) ---
  // Phase 0 (tutorial): 2 easy stars in Room 1
  // Phase 1 (memory): 1 star in Room 2
  // Phase 2 (combined): 2 stars in Room 3
  stars = [
    { x: 160, y: 170, size: 13 },
    { x: 190, y: 440, size: 13 },
    { x: 410, y: 290, size: 13 },
    { x: 570, y: 130, size: 13 },
    { x: 740, y: 485, size: 13 },
  ];

  // --- CHECKPOINTS ---
  checkpoints = [
    { x: 80, y: 310, label: "Start" },
    { x: 300, y: 290, label: "Room 2" },
    { x: 540, y: 370, label: "Room 3" },
  ];
  checkpointIndex = 0;
  checkpointToastTimer = 0;
}

// ===================== DRAW LOOP =====================
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

// ===================== START SCREEN =====================
function drawStartScreen() {
  background(24, 26, 48);

  // Subtle background dots
  if (!lowSensoryMode) {
    noStroke();
    for (let i = 0; i < 40; i++) {
      let bx = (i * 137 + 20) % CANVAS_W;
      let by = (i * 89 + 40) % CANVAS_H;
      fill(255, 255, 255, 10);
      ellipse(bx, by, 3, 3);
    }
  }

  // Title
  fill(255, 215, 90);
  textSize(38);
  textStyle(BOLD);
  text("Fragmented", CANVAS_W / 2, 130);

  textStyle(NORMAL);
  textSize(15);
  fill(160, 160, 180);
  text("A game about Traumatic Brain Injury", CANVAS_W / 2, 170);

  // Narrative context [1][5]
  textSize(13);
  fill(190, 190, 210);
  text(
    "After a head injury, even simple tasks feel different.",
    CANVAS_W / 2,
    220,
  );
  text(
    "Your memory drifts. Sounds grow louder. Focus becomes fragile.",
    CANVAS_W / 2,
    240,
  );

  // Controls
  drawPanel(CANVAS_W / 2 - 160, 275, 320, 130, 10);
  fill(255, 215, 90);
  textSize(14);
  textStyle(BOLD);
  text("Controls", CANVAS_W / 2, 295);
  textStyle(NORMAL);
  fill(220, 220, 235);
  textSize(13);
  text("Arrow Keys — Move", CANVAS_W / 2, 320);
  text("M — Recall objective (memory aid)", CANVAS_W / 2, 340);
  text("L — Toggle Low Sensory Mode", CANVAS_W / 2, 360);
  text("Calm Zone — Reduce overload", CANVAS_W / 2, 380);

  // Start prompt
  fill(255);
  textSize(18);
  let pulse = lowSensoryMode ? 255 : 180 + sin(frameCount * 0.06) * 75;
  fill(255, 255, 255, pulse);
  text("Press ENTER to Start", CANVAS_W / 2, 450);

  // Low sensory indicator
  textSize(11);
  fill(130, 130, 150);
  text(
    "Press L for Low Sensory Mode" + (lowSensoryMode ? "  [ON]" : ""),
    CANVAS_W / 2,
    500,
  );
}

// ===================== PLAY SCREEN =====================
function drawPlayScreen() {
  // Low sensory: lighter, calmer background [4]
  if (lowSensoryMode) {
    background(50, 52, 80);
  } else {
    background(35, 37, 65);
  }
  updateGame();

  // Screen shake at high overload [3] — disabled in low sensory
  push();
  if (overload > 70 && !lowSensoryMode) {
    let shake = map(overload, 70, 100, 0, 3);
    translate(random(-shake, shake), random(-shake, shake));
  }

  drawLevel();
  pop();

  // Tunnel vision vignette at high overload [3] — disabled in low sensory
  if (overload > 55 && !lowSensoryMode) {
    drawVignette();
  }

  // HUD (drawn on top, no shake)
  drawHUD();

  // Low sensory mode persistent indicator [4]
  if (lowSensoryMode) {
    fill(120, 220, 180, 180);
    noStroke();
    rectMode(CORNER);
    rect(CANVAS_W - 130, PLAY_TOP + 4, 122, 20, 4);
    fill(30, 50, 40);
    textSize(10);
    textAlign(CENTER, CENTER);
    text("LOW SENSORY MODE", CANVAS_W - 69, PLAY_TOP + 14);
  }

  checkWinCondition();
  checkLoseOrRespawn();
}

// ===================== WIN SCREEN =====================
function drawWinScreen() {
  background(28, 65, 35);

  if (!endSoundPlayed) {
    playWinSound();
    stopAmbient();
    endSoundPlayed = true;
  }

  // Subtle particles
  if (!lowSensoryMode) {
    noStroke();
    for (let i = 0; i < 20; i++) {
      let px = (frameCount * 0.5 + i * 41) % CANVAS_W;
      let py = sin(frameCount * 0.02 + i) * 80 + CANVAS_H / 2;
      fill(255, 215, 90, 30);
      ellipse(px, py, 5, 5);
    }
  }

  fill(255, 215, 90);
  textSize(40);
  textStyle(BOLD);
  text("Task Complete", CANVAS_W / 2, 180);

  textStyle(NORMAL);
  textSize(16);
  fill(220, 220, 235);
  text("You collected all the stars.", CANVAS_W / 2, 230);

  // Empathy message (not pity) [5]
  textSize(13);
  fill(180, 200, 185);
  text("You managed the overload and completed the task.", CANVAS_W / 2, 290);
  text(
    "For many TBI survivors, this kind of effort is part of every day.",
    CANVAS_W / 2,
    310,
  );

  fill(255);
  textSize(16);
  text("Press ENTER to Play Again", CANVAS_W / 2, 400);
}

// ===================== LOSE SCREEN =====================
function drawLoseScreen() {
  background(65, 28, 28);

  if (!endSoundPlayed) {
    playLoseSound();
    stopAmbient();
    endSoundPlayed = true;
  }

  fill(255, 130, 130);
  textSize(40);
  textStyle(BOLD);
  text("Overloaded", CANVAS_W / 2, 180);

  textStyle(NORMAL);
  textSize(16);
  fill(220, 200, 200);
  text("The sensory input became too much.", CANVAS_W / 2, 230);

  // Supportive message [1]
  textSize(13);
  fill(200, 180, 180);
  text(
    "Taking breaks and finding calm spaces helps — try again.",
    CANVAS_W / 2,
    290,
  );

  fill(255);
  textSize(16);
  text("Press ENTER to Try Again", CANVAS_W / 2, 400);
}

// ===================== GAME UPDATE =====================
function updateGame() {
  // --- PLAYER MOVEMENT ---
  // Cognitive fatigue: speed decreases with overload [2]
  let speed = baseSpeed * map(overload, 0, overloadMax, 1.0, 0.55);

  let newX = playerX;
  let newY = playerY;
  if (keyIsDown(LEFT_ARROW)) newX -= speed;
  if (keyIsDown(RIGHT_ARROW)) newX += speed;
  if (keyIsDown(UP_ARROW)) newY -= speed;
  if (keyIsDown(DOWN_ARROW)) newY += speed;

  // Constrain to play area
  newX = constrain(newX, playerSize / 2 + 4, CANVAS_W - playerSize / 2 - 4);
  newY = constrain(
    newY,
    PLAY_TOP + playerSize / 2,
    PLAY_BOTTOM - playerSize / 2,
  );

  // Wall collision — check X and Y separately for smooth sliding
  if (!hitsWall(newX, playerY)) playerX = newX;
  if (!hitsWall(playerX, newY)) playerY = newY;

  // --- LEVEL PROGRESSION ---
  // Phase 0: tutorial (collect 2 stars, no pressure)
  if (levelPhase === 0 && starsCollected() >= 2) {
    levelPhase = 1;
    showObjective = true;
    memoryTimer = 150;
    setCheckpoint(1);
  }
  // Phase 1: memory fade active, gentle overload
  if (levelPhase === 1 && starsCollected() >= 3) {
    levelPhase = 2;
    memoryTimer = min(memoryTimer, 120);
    setCheckpoint(2);
  }

  // --- MECHANIC 1: MEMORY FADE [1][2] ---
  if (levelPhase >= 1) {
    memoryTimer -= 1;
    if (memoryTimer <= 0) showObjective = false;
  } else {
    showObjective = true;
  }

  // --- MECHANIC 2: SENSORY OVERLOAD [3] ---
  let overloadRate = 0;
  if (levelPhase === 0) overloadRate = 0;
  if (levelPhase === 1) overloadRate = 0.02;
  if (levelPhase === 2) overloadRate = 0.065;

  // Stimulus zones increase overload faster [3]
  for (let sz of stimulusZones) {
    if (inRect(playerX, playerY, sz.x, sz.y, sz.w, sz.h)) {
      overloadRate += 0.12;
    }
  }

  overload += overloadRate;

  // Calm Zone recovery [3]
  let inCalm = inRect(
    playerX,
    playerY,
    calmZone.x,
    calmZone.y,
    calmZone.w,
    calmZone.h,
  );
  if (inCalm) {
    overload -= levelPhase === 2 ? 1.2 : 0.9;
    // Calm sound feedback
    if (calmSoundCooldown <= 0) {
      playTone(262, 0.6, "sine", 0.03);
      calmSoundCooldown = 90;
    }
  }
  calmSoundCooldown--;

  overload = constrain(overload, 0, overloadMax);

  // Overload audio warning
  if (overload > 80 && overloadWarnCooldown <= 0) {
    playTone(180, 0.2, "sawtooth", 0.03);
    overloadWarnCooldown = 60;
  }
  overloadWarnCooldown--;

  // Update ambient drone
  updateAmbient();

  // --- COLLECT STARS ---
  for (let i = stars.length - 1; i >= 0; i--) {
    let s = stars[i];
    let d = dist(playerX, playerY, s.x, s.y);
    if (d < playerSize / 2 + s.size / 2 + 5) {
      stars.splice(i, 1);
      playCollectSound();
      addParticles(s.x, s.y, [255, 220, 100]);

      // Brief memory refresh on collect
      if (levelPhase >= 1) {
        showObjective = true;
        memoryTimer = max(memoryTimer, 60);
      }
    }
  }

  // --- PARTICLES ---
  updateParticles();

  // --- CHECKPOINT TOAST ---
  if (checkpointToastTimer > 0) checkpointToastTimer--;
}

// ===================== WIN / LOSE =====================
function checkWinCondition() {
  if (stars.length === 0) {
    gameState = STATE_WIN;
  }
}

function checkLoseOrRespawn() {
  if (overload >= overloadMax) {
    if (respawnsLeft > 0) {
      respawnsLeft--;
      respawnAtCheckpoint();
      overload = 50;
      showObjective = true;
      memoryTimer = 90;
      playRespawnSound();
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

function setCheckpoint(idx) {
  if (idx <= checkpointIndex) return;
  checkpointIndex = idx;
  checkpointToastTimer = 140;
  playCheckpointSound();
}

// ===================== PARTICLES =====================
function addParticles(x, y, col) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-2.5, 2.5),
      vy: random(-2.5, 2.5),
      life: 35,
      maxLife: 35,
      col: col,
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.96;
    p.vy *= 0.96;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  noStroke();
  for (let p of particles) {
    let alpha = map(p.life, 0, p.maxLife, 0, 220);
    fill(p.col[0], p.col[1], p.col[2], alpha);
    let sz = map(p.life, 0, p.maxLife, 1, 5);
    ellipse(p.x, p.y, sz, sz);
  }
}

// ===================== LEVEL RENDERING =====================
function drawLevel() {
  // --- Background floor tiles (hidden in low sensory) [4] ---
  if (!lowSensoryMode) {
    drawFloorTiles();
  }

  // --- Stimulus zones (warm tint) [3] ---
  noStroke();
  for (let sz of stimulusZones) {
    if (lowSensoryMode) {
      // Low sensory: flat, no pulse, just a simple outlined box [4]
      noFill();
      stroke(200, 100, 80, 80);
      strokeWeight(2);
      rectMode(CORNER);
      rect(sz.x, sz.y, sz.w, sz.h, 4);
      noStroke();
      fill(200, 100, 80, 80);
      textSize(9);
      text("noise", sz.x + sz.w / 2, sz.y + sz.h / 2);
    } else {
      let pulse = sin(frameCount * 0.05) * 8;
      fill(200, 80, 60, 25 + pulse);
      rectMode(CORNER);
      rect(sz.x, sz.y, sz.w, sz.h, 4);
      fill(200, 100, 80, 50);
      textSize(9);
      text("noise", sz.x + sz.w / 2, sz.y + sz.h / 2);
    }
  }

  // --- Calm Zone [3] ---
  drawCalmZone();

  // --- Walls ---
  for (let w of walls) {
    noStroke();
    rectMode(CORNER);
    if (lowSensoryMode) {
      // Low sensory: flat solid walls, no shadow or highlight [4]
      fill(60, 58, 90);
      rect(w.x, w.y, w.w, w.h, 2);
    } else {
      // Wall shadow
      fill(10, 10, 25, 80);
      rect(w.x + 3, w.y + 3, w.w, w.h, 2);
      // Wall
      fill(45, 42, 72);
      rect(w.x, w.y, w.w, w.h, 2);
      // Wall highlight edge
      fill(65, 62, 95);
      rect(w.x, w.y, w.w, 3, 2);
    }
  }

  // --- Decorations ---
  for (let d of decorations) {
    noStroke();
    rectMode(CORNER);
    if (lowSensoryMode) {
      // Low sensory: simple solid rectangle, no shadow or highlight [4]
      fill(d.col[0], d.col[1], d.col[2]);
      rect(d.x, d.y, d.w, d.h, 3);
    } else {
      // Shadow
      fill(10, 10, 25, 40);
      rect(d.x + 2, d.y + 2, d.w, d.h, 3);
      // Object
      fill(d.col[0], d.col[1], d.col[2]);
      rect(d.x, d.y, d.w, d.h, 3);
      // Highlight
      fill(d.col[0] + 20, d.col[1] + 20, d.col[2] + 20, 120);
      rect(d.x, d.y, d.w, 4, 3);
    }
  }

  // --- Stars ---
  noStroke();
  for (let s of stars) {
    if (lowSensoryMode) {
      // Low sensory: simple solid circle, no glow or animation [4]
      fill(255, 215, 80);
      ellipse(s.x, s.y, s.size * 1.6, s.size * 1.6);
    } else {
      // Glow
      let glow = sin(frameCount * 0.06 + s.x) * 3;
      fill(255, 220, 80, 40);
      ellipse(s.x, s.y, s.size * 2.5 + glow, s.size * 2.5 + glow);
      // Star shape
      fill(255, 215, 80);
      drawStarShape(s.x, s.y, s.size * 0.4, s.size, 5);
    }
  }

  // --- Player ---
  drawPlayer();

  // --- Checkpoint marker ---
  drawCheckpointMarker();

  // --- Particles (hidden in low sensory) [4] ---
  if (!lowSensoryMode) {
    drawParticles();
  }

  // --- Overload haze [3] (disabled in low sensory) ---
  if (overload > 60 && !lowSensoryMode) {
    noStroke();
    fill(255, 255, 255, map(overload, 60, 100, 0, 40));
    rectMode(CORNER);
    rect(0, PLAY_TOP, CANVAS_W, PLAY_BOTTOM - PLAY_TOP);
  }
}

function drawFloorTiles() {
  // Subtle tile grid on floor
  stroke(50, 48, 78, 30);
  strokeWeight(1);
  let tileSize = 40;
  for (let x = 0; x < CANVAS_W; x += tileSize) {
    line(x, PLAY_TOP, x, PLAY_BOTTOM);
  }
  for (let y = PLAY_TOP; y < PLAY_BOTTOM; y += tileSize) {
    line(0, y, CANVAS_W, y);
  }
  noStroke();

  // Room labels (very faint)
  fill(255, 255, 255, 15);
  textSize(11);
  text("Room 1", 133, PLAY_BOTTOM - 12);
  text("Room 2", 385, PLAY_BOTTOM - 12);
  text("Room 3", 650, PLAY_BOTTOM - 12);
}

function drawCalmZone() {
  rectMode(CORNER);
  noStroke();

  let cz = calmZone;
  let pulse = 0;
  if (levelPhase === 2 && !lowSensoryMode) {
    pulse = sin(frameCount * 0.07) * 4;
  }

  // Glow
  fill(80, 190, 190, 20);
  rect(
    cz.x - 8 - pulse,
    cz.y - 8 - pulse,
    cz.w + 16 + pulse * 2,
    cz.h + 16 + pulse * 2,
    14,
  );

  // Zone
  fill(70, 170, 170, 180);
  rect(cz.x, cz.y, cz.w, cz.h, 10);

  // Inner pattern
  fill(90, 195, 195, 60);
  rect(cz.x + 8, cz.y + 8, cz.w - 16, cz.h - 16, 6);

  // Border
  noFill();
  stroke(200, 240, 240, 120);
  strokeWeight(2);
  rect(cz.x - 2, cz.y - 2, cz.w + 4, cz.h + 4, 12);
  noStroke();

  // Label
  fill(220, 255, 245);
  textSize(11);
  textStyle(BOLD);
  text("Calm Zone", cz.x + cz.w / 2, cz.y + cz.h / 2 - 1);
  textStyle(NORMAL);

  // Recovery feedback
  if (inRect(playerX, playerY, cz.x, cz.y, cz.w, cz.h)) {
    fill(180, 255, 220);
    textSize(10);
    text("Recovering...", cz.x + cz.w / 2, cz.y + cz.h / 2 + 10);
  }
}

function drawPlayer() {
  let px = playerX;
  let py = playerY;
  noStroke();

  // Shadow
  fill(10, 10, 30, 60);
  ellipse(px + 2, py + 10, 16, 6);

  // Body
  fill(90, 155, 230);
  ellipse(px, py + 2, 18, 22);

  // Head
  fill(240, 210, 180);
  ellipse(px, py - 9, 16, 16);

  // Eyes
  fill(50, 50, 70);
  ellipse(px - 2.5, py - 10, 2.5, 2.5);
  ellipse(px + 2.5, py - 10, 2.5, 2.5);

  // Overload indicator on player — face changes [3]
  // Baseline: neutral mouth
  stroke(50, 50, 70);
  strokeWeight(1.5);
  noFill();

  if (overload < 35) {
    // Calm / neutral — small straight mouth
    line(px - 3, py - 5, px + 3, py - 5);
  } else if (overload < 70) {
    // Anxious — small "o" mouth + subtle eyebrow tilt
    noStroke();
    fill(50, 50, 70);
    ellipse(px, py - 4.5, 3.2, 3.2);

    // eyebrows (light)
    stroke(50, 50, 70);
    strokeWeight(1.2);
    line(px - 5.2, py - 14.2, px - 1.8, py - 15.2);
    line(px + 1.8, py - 15.2, px + 5.2, py - 14.2);
  } else if (overload < 90) {
    // Stressed — frown (∩) + stronger eyebrows
    stroke(50, 50, 70);
    strokeWeight(1.6);
    arc(px, py - 3.8, 6, 4, PI, TWO_PI);

    strokeWeight(1.4);
    line(px - 5.5, py - 12.8, px - 1.5, py - 14.2);
    line(px + 1.5, py - 14.2, px + 5.5, py - 12.8);
  } else {
    // Overloaded — clenched teeth + "wide eyes" feel
    stroke(50, 50, 70);
    strokeWeight(1.4);

    let mouthUp = 2;
    // clenched mouth rectangle
    rectMode(CENTER);
    rect(px, py - 2.0 - mouthUp, 7.5, 3.2, 1);

    // teeth lines
    line(px - 2.5, py - 3.4 - mouthUp, px - 2.5, py - 0.6 - mouthUp);
    line(px, py - 3.4 - mouthUp, px, py - 0.6 - mouthUp);
    line(px + 2.5, py - 3.4 - mouthUp, px + 2.5, py - 0.6 - mouthUp);

    // eyebrows sharper
    strokeWeight(1.6);
    line(px - 5.5, py - 12.8, px - 1.5, py - 14.2);
    line(px + 1.5, py - 14.2, px + 5.5, py - 12.8);

    rectMode(CORNER);
  }

  noStroke();
}

function drawCheckpointMarker() {
  let cp = checkpoints[checkpointIndex];
  fill(255, 255, 255, 25);
  noStroke();
  ellipse(cp.x, cp.y, 30, 30);
  fill(255, 255, 255, 50);
  textSize(8);
  text("CP", cp.x, cp.y);
}

function drawVignette() {
  // Tunnel vision effect at high overload [3]
  let intensity = map(overload, 55, 100, 0, 180);
  noStroke();

  // Top
  for (let i = 0; i < 60; i++) {
    let a = map(i, 0, 60, intensity, 0);
    fill(15, 15, 30, a);
    rectMode(CORNER);
    rect(0, PLAY_TOP + i, CANVAS_W, 1);
  }
  // Bottom
  for (let i = 0; i < 60; i++) {
    let a = map(i, 0, 60, intensity, 0);
    fill(15, 15, 30, a);
    rect(0, PLAY_BOTTOM - i, CANVAS_W, 1);
  }
  // Left
  for (let i = 0; i < 60; i++) {
    let a = map(i, 0, 60, intensity, 0);
    fill(15, 15, 30, a);
    rect(i, PLAY_TOP, 1, PLAY_BOTTOM - PLAY_TOP);
  }
  // Right
  for (let i = 0; i < 60; i++) {
    let a = map(i, 0, 60, intensity, 0);
    fill(15, 15, 30, a);
    rect(CANVAS_W - i, PLAY_TOP, 1, PLAY_BOTTOM - PLAY_TOP);
  }
}

// ===================== HUD =====================
function drawHUD() {
  // Top HUD background
  drawPanel(0, 0, CANVAS_W, HUD_TOP, 0);

  // Objective (Memory Fade) [1]
  textAlign(CENTER, CENTER);
  if (showObjective) {
    fill(255);
    textSize(16);
    textStyle(BOLD);
    text(
      objective + "  (" + starsCollected() + "/" + starsNeeded + ")",
      CANVAS_W / 2,
      18,
    );
    textStyle(NORMAL);
  } else {
    // Faded — still visible but harder to read [1]
    fill(255, 60);
    textSize(16);
    text(
      objective + "  (" + starsCollected() + "/" + starsNeeded + ")",
      CANVAS_W / 2,
      18,
    );
  }

  // Phase hint
  textSize(11);
  fill(180, 180, 200);
  if (levelPhase === 0) {
    text("Collect the nearby stars to learn the goal.", CANVAS_W / 2, 42);
  } else if (levelPhase === 1) {
    text("Objective fading... Press M to recall it.", CANVAS_W / 2, 42);
  } else if (levelPhase === 2) {
    text(
      "Manage overload — reach the Calm Zone if it gets high.",
      CANVAS_W / 2,
      42,
    );
  }

  // Overload bar
  drawOverloadBar();

  // Respawns
  textAlign(LEFT, CENTER);
  fill(180, 180, 200);
  textSize(11);
  text("Lives: " + (respawnsLeft + 1), 20, 55);

  // Bottom control strip
  drawPanel(0, CANVAS_H - HUD_BOTTOM, CANVAS_W, HUD_BOTTOM, 0);
  textAlign(CENTER, CENTER);
  textSize(11);
  fill(140, 140, 160);
  text(
    "Arrow Keys: Move  |  M: Recall Objective  |  L: Low Sensory Mode" +
      (lowSensoryMode ? " [ON]" : ""),
    CANVAS_W / 2,
    CANVAS_H - HUD_BOTTOM / 2,
  );

  // Checkpoint toast
  drawCheckpointToast();
}

function drawOverloadBar() {
  // Bar position (top-right area)
  let barX = CANVAS_W - 185;
  let barY = 10;
  let barW = 150;
  let barH = 12;

  textAlign(LEFT, CENTER);
  fill(200, 200, 220);
  textSize(11);
  text("Overload", barX, barY + barH + 12);

  // Background
  rectMode(CORNER);
  noStroke();
  fill(60, 55, 80);
  rect(barX, barY, barW, barH, 4);

  // Fill
  let w = map(overload, 0, overloadMax, 0, barW);
  let r = map(overload, 0, overloadMax, 100, 255);
  let g = map(overload, 0, overloadMax, 180, 60);
  fill(r, g, 80);
  rect(barX, barY, w, barH, 4);

  // Border
  noFill();
  stroke(120, 115, 140);
  strokeWeight(1);
  rect(barX, barY, barW, barH, 4);
  noStroke();

  // Warning text
  if (overload > 80) {
    fill(255, 180, 180);
    textSize(10);
    text("Overstimulated!", barX, barY + barH + 26);
  } else if (levelPhase >= 2) {
    fill(160, 200, 200);
    textSize(10);
    text("Find the Calm Zone", barX, barY + barH + 26);
  }

  textAlign(CENTER, CENTER);
}

function drawCheckpointToast() {
  if (checkpointToastTimer > 0) {
    let cp = checkpoints[checkpointIndex];
    let alpha = map(checkpointToastTimer, 140, 0, 230, 0);

    fill(20, 60, 60, alpha * 0.7);
    rectMode(CENTER);
    rect(CANVAS_W / 2, PLAY_BOTTOM - 30, 220, 30, 8);

    fill(180, 255, 220, alpha);
    textSize(13);
    text("Checkpoint: " + cp.label, CANVAS_W / 2, PLAY_BOTTOM - 30);
    rectMode(CORNER);
  }
}

// ===================== INPUT =====================
function keyPressed() {
  // Init audio on first interaction (browser autoplay policy)
  initAudio();

  if (keyCode === ENTER) {
    if (
      gameState === STATE_START ||
      gameState === STATE_WIN ||
      gameState === STATE_LOSE
    ) {
      stopAmbient();
      initLevel();
      gameState = STATE_PLAY;
      startAmbient();
    }
  }

  // Memory recall [1][2] — keyCode 77 = M
  if (gameState === STATE_PLAY && keyCode === 77) {
    showObjective = true;
    if (levelPhase === 1) memoryTimer = 75;
    if (levelPhase === 2) memoryTimer = 50;
    playRecallSound();
  }

  // Low sensory mode toggle [4] — keyCode 76 = L
  if (keyCode === 76) {
    lowSensoryMode = !lowSensoryMode;
  }
}
