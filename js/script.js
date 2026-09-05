// Game state
let currMoleTile = null;
let currPlantTile = null;
let score = 0;
let lives = 3;
let time = 30;
let gameOver = false;
let paused = false;

// Game intervals
let moleInterval = null;
let plantInterval = null;
let timerInterval = null;
let difficultyInterval = null;

// Difficulty
let moleDelay = 1000;
let plantDelay = 2000;

// Game statistics
let molesHit = 0;
let plantsHit = 0;
let missedMoles = 0;
let totalClicks = 0;
let currentStreak = 0;
let bestStreak = 0;

// Saved scores
let highScore = Number(localStorage.getItem("highScore")) || 0;
let bestAccuracy = Number(localStorage.getItem("bestAccuracy")) || 0;

// Audio
let audioContext = null;

// DOM elements
const board = document.getElementById("board");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const timeElement = document.getElementById("time");
const restartButton = document.getElementById("restart");
let gameModal = document.getElementById("gameModal");
let modalTitle = document.getElementById("modalTitle");
let modalMessage = document.getElementById("modalMessage");
let modalScore = document.getElementById("modalScore");
let modalHighScore = document.getElementById("modalHighScore");
let modalRestart = document.getElementById("modalRestart");
let pauseButton = null;

// Event listeners
window.addEventListener("load", startGame);
restartButton?.addEventListener("click", restartGame);
modalRestart?.addEventListener("click", restartGame);
document.addEventListener("keydown", handleKeyboard);

// Start game
function startGame() {
  clearGameIntervals();
  score = 0;
  lives = 3;
  time = 30;
  gameOver = false;
  paused = false;
  moleDelay = 1000;
  plantDelay = 2000;
  molesHit = 0;
  plantsHit = 0;
  missedMoles = 0;
  totalClicks = 0;
  currentStreak = 0;
  bestStreak = 0;
  currMoleTile = null;
  currPlantTile = null;
  closeModal();
  clearTiles();
  createBoard();
  createPauseButton();
  updateScore();
  updateLives();
  updateTime();
  updatePauseButton();
  moleInterval = setInterval(setMole, moleDelay);
  plantInterval = setInterval(setPlant, plantDelay);
  timerInterval = setInterval(updateTimer, 1000);
  difficultyInterval = setInterval(increaseDifficulty, 5000);
  setMole();
}

// Create game board
function createBoard() {
  board.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const tile = document.createElement("div");

    tile.id = i.toString();
    tile.tabIndex = 0;
    tile.setAttribute("role", "button");
    tile.setAttribute("aria-label", `Game tile ${i + 1}`);
    tile.addEventListener("click", selectTile);
    tile.addEventListener("keydown", handleTileKeyboard);

    board.appendChild(tile);
  }
}

// Create pause button
function createPauseButton() {
  if (pauseButton) {
    pauseButton.remove();
  }

  pauseButton = document.createElement("button");
  pauseButton.id = "pause";
  pauseButton.type = "button";
  pauseButton.textContent = "Pause Game";
  pauseButton.addEventListener("click", togglePause);

  restartButton.parentNode.insertBefore(pauseButton, restartButton);
}

// Get random tile
function getRandomTile() {
  return Math.floor(Math.random() * 9).toString();
}

// Spawn mole
function setMole() {
  if (gameOver || paused) {
    return;
  }

  if (currMoleTile) {
    clearMoleTile();
  }

  let randomTile = getRandomTile();
  let attempts = 0;

  while (currPlantTile && currPlantTile.id === randomTile && attempts < 20) {
    randomTile = getRandomTile();
    attempts++;
  }

  if (currPlantTile && currPlantTile.id === randomTile) {
    return;
  }

  const tile = document.getElementById(randomTile);

  if (!tile) {
    return;
  }

  const mole = document.createElement("img");
  mole.src = "assets/monty-mole.png";
  mole.alt = "Mole";

  tile.appendChild(mole);
  currMoleTile = tile;

  animateTile(tile);
}

// Spawn plant
function setPlant() {
  if (gameOver || paused) {
    return;
  }

  if (currPlantTile) {
    clearPlantTile();
  }

  let randomTile = getRandomTile();
  let attempts = 0;

  while (currMoleTile && currMoleTile.id === randomTile && attempts < 20) {
    randomTile = getRandomTile();
    attempts++;
  }

  if (currMoleTile && currMoleTile.id === randomTile) {
    return;
  }

  const tile = document.getElementById(randomTile);

  if (!tile) {
    return;
  }

  const plant = document.createElement("img");
  plant.src = "assets/piranha-plant.png";
  plant.alt = "Piranha plant";

  tile.appendChild(plant);
  currPlantTile = tile;

  animateTile(tile);
}

// Handle tile click
function selectTile(event) {
  if (gameOver || paused) {
    return;
  }

  initializeAudio();

  const clickedTile = event.currentTarget;

  totalClicks++;

  if (clickedTile === currMoleTile) {
    score += 10;
    molesHit++;
    currentStreak++;
    bestStreak = Math.max(bestStreak, currentStreak);

    updateScore();
    playHitSound();
    showHitFeedback(clickedTile, "+10");
    clearMoleTile();

    return;
  }

  if (clickedTile === currPlantTile) {
    lives--;
    plantsHit++;
    currentStreak = 0;

    updateLives();
    playPlantSound();
    showHitFeedback(clickedTile, "-1");
    clearPlantTile();

    if (lives <= 0) {
      endGame("Game Over");
    }

    return;
  }

  missedMoles++;
  currentStreak = 0;

  playMissSound();
  showHitFeedback(clickedTile, "MISS");
}

// Keyboard controls
function handleKeyboard(event) {
  if (gameOver) {
    return;
  }

  if (event.key === " " || event.key.toLowerCase() === "p") {
    event.preventDefault();
    togglePause();

    return;
  }

  if (event.key === "r" || event.key === "R") {
    restartGame();

    return;
  }

  const keyNumber = Number(event.key);

  if (keyNumber >= 1 && keyNumber <= 9) {
    const tile = document.getElementById((keyNumber - 1).toString());

    if (tile) {
      tile.focus();
      selectTile({
        currentTarget: tile,
      });
    }

    return;
  }

  const focusedTile = document.activeElement;

  if (
    focusedTile &&
    focusedTile.parentElement === board &&
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
  ) {
    event.preventDefault();
    moveFocus(event.key);
  }
}

// Tile keyboard controls
function handleTileKeyboard(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    selectTile(event);
  }
}

// Move tile focus
function moveFocus(direction) {
  const currentTile = document.activeElement;

  if (!currentTile || currentTile.parentElement !== board) {
    return;
  }

  const currentIndex = Number(currentTile.id);
  let nextIndex = currentIndex;

  if (direction === "ArrowUp" && currentIndex >= 3) {
    nextIndex -= 3;
  }

  if (direction === "ArrowDown" && currentIndex <= 5) {
    nextIndex += 3;
  }

  if (direction === "ArrowLeft" && currentIndex % 3 !== 0) {
    nextIndex--;
  }

  if (direction === "ArrowRight" && currentIndex % 3 !== 2) {
    nextIndex++;
  }

  const nextTile = document.getElementById(nextIndex.toString());

  if (nextTile) {
    nextTile.focus();
  }
}

// Update score
function updateScore() {
  scoreElement.textContent = score;
}

// Update lives
function updateLives() {
  livesElement.textContent = lives;
}

// Update time
function updateTime() {
  timeElement.textContent = time;
}

// Update timer
function updateTimer() {
  if (gameOver || paused) {
    return;
  }

  time--;
  updateTime();

  if (time <= 0) {
    endGame("Time's Up");
  }
}

// Increase difficulty
function increaseDifficulty() {
  if (gameOver || paused) {
    return;
  }

  moleDelay = Math.max(400, moleDelay - 100);
  plantDelay = Math.max(800, plantDelay - 100);

  restartSpawnIntervals();
}

// Restart spawn intervals
function restartSpawnIntervals() {
  clearInterval(moleInterval);
  clearInterval(plantInterval);

  moleInterval = setInterval(setMole, moleDelay);
  plantInterval = setInterval(setPlant, plantDelay);
}

// Pause or resume game
function togglePause() {
  if (gameOver) {
    return;
  }

  paused = !paused;

  updatePauseButton();

  if (paused) {
    pauseAudio();
  } else {
    initializeAudio();
  }
}

// Update pause button
function updatePauseButton() {
  if (!pauseButton) {
    return;
  }

  pauseButton.textContent = paused ? "Resume Game" : "Pause Game";
  pauseButton.setAttribute("aria-pressed", String(paused));
}

// End game
function endGame(message) {
  if (gameOver) {
    return;
  }

  gameOver = true;
  paused = false;

  clearGameIntervals();
  clearTiles();

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  const accuracy = calculateAccuracy();

  if (accuracy > bestAccuracy) {
    bestAccuracy = accuracy;
    localStorage.setItem("bestAccuracy", bestAccuracy);
  }

  playGameOverSound();
  showModal(message, accuracy);
}

// Show game over modal
function showModal(message, accuracy) {
  if (!gameModal) {
    createModal();
  }

  modalTitle.textContent = message;
  modalMessage.textContent =
    message === "Time's Up"
      ? "The timer has reached zero."
      : "You lost all your lives.";

  modalScore.textContent = score;
  modalHighScore.textContent = highScore;

  const existingStats = gameModal.querySelector(".modal-stats");

  if (existingStats) {
    existingStats.remove();
  }

  const stats = document.createElement("div");

  stats.className = "modal-stats";
  stats.innerHTML = `
        <p>Moles Hit: <span>${molesHit}</span></p>
        <p>Plants Hit: <span>${plantsHit}</span></p>
        <p>Misses: <span>${missedMoles}</span></p>
        <p>Best Streak: <span>${bestStreak}</span></p>
        <p>Accuracy: <span>${accuracy}%</span></p>
    `;

  modalRestart.before(stats);

  gameModal.classList.add("show");
  gameModal.setAttribute("aria-hidden", "false");

  modalRestart.focus();
}

// Create modal if needed
function createModal() {
  gameModal = document.createElement("div");

  gameModal.id = "gameModal";
  gameModal.className = "modal";
  gameModal.setAttribute("aria-hidden", "true");

  gameModal.innerHTML = `
        <div class="modal-box" role="dialog" aria-modal="true">
            <h2 id="modalTitle">Game Over</h2>
            <p id="modalMessage"></p>
            <div class="modal-score">
                <p>Score: <span id="modalScore">0</span></p>
                <p>High Score: <span id="modalHighScore">0</span></p>
            </div>
            <button id="modalRestart" type="button">Play Again</button>
        </div>
    `;

  document.body.appendChild(gameModal);

  modalTitle = document.getElementById("modalTitle");
  modalMessage = document.getElementById("modalMessage");
  modalScore = document.getElementById("modalScore");
  modalHighScore = document.getElementById("modalHighScore");
  modalRestart = document.getElementById("modalRestart");

  modalRestart.addEventListener("click", restartGame);
}

// Close modal
function closeModal() {
  if (!gameModal) {
    return;
  }

  gameModal.classList.remove("show");
  gameModal.setAttribute("aria-hidden", "true");
}

// Restart game
function restartGame() {
  clearGameIntervals();
  startGame();
}

// Clear all intervals
function clearGameIntervals() {
  clearInterval(moleInterval);
  clearInterval(plantInterval);
  clearInterval(timerInterval);
  clearInterval(difficultyInterval);

  moleInterval = null;
  plantInterval = null;
  timerInterval = null;
  difficultyInterval = null;
}

// Clear mole tile
function clearMoleTile() {
  if (!currMoleTile) {
    return;
  }

  currMoleTile.innerHTML = "";
  currMoleTile = null;
}

// Clear plant tile
function clearPlantTile() {
  if (!currPlantTile) {
    return;
  }

  currPlantTile.innerHTML = "";
  currPlantTile = null;
}

// Clear board
function clearTiles() {
  clearMoleTile();
  clearPlantTile();

  board.querySelectorAll("div").forEach((tile) => {
    tile.innerHTML = "";
  });
}

// Animate tile
function animateTile(tile) {
  if (!tile.animate) {
    return;
  }

  tile.animate(
    [
      {
        transform: "scale(0.96)",
      },
      {
        transform: "scale(1)",
      },
    ],
    {
      duration: 160,
      easing: "ease-out",
    },
  );
}

// Show hit feedback
function showHitFeedback(tile, text) {
  const feedback = document.createElement("span");

  feedback.textContent = text;
  feedback.style.position = "absolute";
  feedback.style.left = "50%";
  feedback.style.top = "50%";
  feedback.style.transform = "translate(-50%, -50%)";
  feedback.style.zIndex = "10";
  feedback.style.fontSize = "clamp(16px, 4vw, 28px)";
  feedback.style.fontWeight = "700";
  feedback.style.pointerEvents = "none";
  feedback.style.color = "#ffffff";
  feedback.style.textShadow = "0 2px 5px rgba(0, 0, 0, 0.4)";

  if (getComputedStyle(tile).position === "static") {
    tile.style.position = "relative";
  }

  tile.appendChild(feedback);

  feedback
    .animate(
      [
        {
          opacity: 1,
          transform: "translate(-50%, -50%) scale(1)",
        },
        {
          opacity: 0,
          transform: "translate(-50%, -90%) scale(1.2)",
        },
      ],
      {
        duration: 500,
        easing: "ease-out",
      },
    )
    .finished.then(() => {
      feedback.remove();
    });
}

// Calculate accuracy
function calculateAccuracy() {
  if (totalClicks === 0) {
    return 0;
  }

  return Math.round((molesHit / totalClicks) * 100);
}

// Initialize audio
function initializeAudio() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return;
    }

    audioContext = new AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

// Create sound tone
function createTone(frequency, duration, type = "sine", volume = 0.04) {
  if (!audioContext) {
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration,
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

// Game sounds
function playHitSound() {
  initializeAudio();
  createTone(700, 0.08, "square", 0.04);
}

function playPlantSound() {
  initializeAudio();
  createTone(180, 0.15, "sawtooth", 0.05);
}

function playMissSound() {
  initializeAudio();
  createTone(120, 0.08, "triangle", 0.025);
}

function playGameOverSound() {
  initializeAudio();
  createTone(260, 0.12, "sine", 0.04);

  setTimeout(() => {
    createTone(180, 0.2, "sine", 0.04);
  }, 120);
}

// Pause audio
function pauseAudio() {
  if (!audioContext) {
    return;
  }

  if (audioContext.state === "running") {
    audioContext.suspend();
  }
}
