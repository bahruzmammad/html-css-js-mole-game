let currMoleTile = null;
let currPlantTile = null;

let score = 0;
let lives = 3;
let time = 30;
let gameOver = false;

let moleInterval;
let plantInterval;
let timerInterval;

let highScore = Number(localStorage.getItem("highScore")) || 0;

window.addEventListener("load", function () {
  document.getElementById("restart").addEventListener("click", restartGame);

  startGame();
});

function startGame() {
  score = 0;
  lives = 3;
  time = 30;
  gameOver = false;

  currMoleTile = null;
  currPlantTile = null;

  updateScore();
  updateLives();
  updateTime();

  createBoard();

  clearGameIntervals();

  // Start mole and plant
  moleInterval = setInterval(setMole, 1000);
  plantInterval = setInterval(setPlant, 2000);

  // Start timer
  timerInterval = setInterval(updateTimer, 1000);

  // Show mole immediately
  setMole();
}

/* =========================
   CREATE BOARD
========================= */

function createBoard() {
  const board = document.getElementById("board");

  board.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const tile = document.createElement("div");

    tile.id = i.toString();

    // Important: click event
    tile.addEventListener("click", selectTile);

    board.appendChild(tile);
  }
}

/* =========================
   RANDOM TILE
========================= */

function getRandomTile() {
  const number = Math.floor(Math.random() * 9);

  return number.toString();
}

/* =========================
   MOLE
========================= */

function setMole() {
  if (gameOver) {
    return;
  }

  // Remove old mole
  if (currMoleTile) {
    currMoleTile.innerHTML = "";
    currMoleTile = null;
  }

  let randomTile = getRandomTile();

  // Don't put mole on plant
  if (currPlantTile && currPlantTile.id === randomTile) {
    return;
  }

  const tile = document.getElementById(randomTile);

  if (!tile) {
    return;
  }

  const mole = document.createElement("img");

  mole.src = "../assets/monty-mole.png";
  mole.alt = "Mole";

  tile.appendChild(mole);

  currMoleTile = tile;
}

/* =========================
   PLANT
========================= */

function setPlant() {
  if (gameOver) {
    return;
  }

  // Remove old plant
  if (currPlantTile) {
    currPlantTile.innerHTML = "";
    currPlantTile = null;
  }

  let randomTile = getRandomTile();

  // Don't put plant on mole
  if (currMoleTile && currMoleTile.id === randomTile) {
    return;
  }

  const tile = document.getElementById(randomTile);

  if (!tile) {
    return;
  }

  const plant = document.createElement("img");

  plant.src = "../assets/piranha-plant.png";
  plant.alt = "Plant";

  tile.appendChild(plant);

  currPlantTile = tile;
}

/* =========================
   CLICK TILE
========================= */

function selectTile(event) {
  if (gameOver) {
    return;
  }

  const clickedTile = event.currentTarget;

  /*
        Mole clicked
    */

  if (clickedTile === currMoleTile) {
    score += 10;

    updateScore();

    clickedTile.innerHTML = "";

    currMoleTile = null;

    return;
  }

  /*
        Plant clicked
    */

  if (clickedTile === currPlantTile) {
    lives--;

    updateLives();

    clickedTile.innerHTML = "";

    currPlantTile = null;

    if (lives <= 0) {
      endGame("GAME OVER");
    }

    return;
  }
}

/* =========================
   SCORE
========================= */

function updateScore() {
  const scoreElement = document.getElementById("score");

  if (scoreElement) {
    scoreElement.innerText = score;
  }
}

/* =========================
   LIVES
========================= */

function updateLives() {
  const livesElement = document.getElementById("lives");

  if (livesElement) {
    livesElement.innerText = lives;
  }
}

/* =========================
   TIMER
========================= */

function updateTime() {
  const timeElement = document.getElementById("time");

  if (timeElement) {
    timeElement.innerText = time;
  }
}

/* =========================
   TIMER COUNTDOWN
========================= */

function updateTimer() {
  if (gameOver) {
    return;
  }

  time--;

  updateTime();

  if (time <= 0) {
    endGame("TIME'S UP");
  }
}

/* =========================
   END GAME
========================= */

function endGame(message) {
  if (gameOver) {
    return;
  }

  gameOver = true;

  clearGameIntervals();

  // Remove mole
  if (currMoleTile) {
    currMoleTile.innerHTML = "";
    currMoleTile = null;
  }

  // Remove plant
  if (currPlantTile) {
    currPlantTile.innerHTML = "";
    currPlantTile = null;
  }

  // Save high score
  if (score > highScore) {
    highScore = score;

    localStorage.setItem("highScore", highScore);
  }

  const scoreElement = document.getElementById("score");

  if (scoreElement) {
    scoreElement.innerText = message + ": " + score;
  }

  alert(message + "\n\nScore: " + score + "\nHigh Score: " + highScore);
}

/* =========================
   RESTART GAME
========================= */

function restartGame() {
  clearGameIntervals();

  startGame();
}

/* =========================
   CLEAR INTERVALS
========================= */

function clearGameIntervals() {
  clearInterval(moleInterval);
  clearInterval(plantInterval);
  clearInterval(timerInterval);

  moleInterval = null;
  plantInterval = null;
  timerInterval = null;
}
