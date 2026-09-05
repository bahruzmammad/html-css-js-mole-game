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

  moleInterval = setInterval(setMole, 1000);
  plantInterval = setInterval(setPlant, 2000);

  timerInterval = setInterval(updateTimer, 1000);

  setMole();
}

function createBoard() {
  const board = document.getElementById("board");

  board.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const tile = document.createElement("div");
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    board.appendChild(tile);
  }
}

function getRandomTile() {
  const number = Math.floor(Math.random() * 9);
  return number.toString();
}

function setMole() {
  if (gameOver) {
    return;
  }

  if (currMoleTile) {
    currMoleTile.innerHTML = "";
    currMoleTile = null;
  }

  let randomTile = getRandomTile();

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

function setPlant() {
  if (gameOver) {
    return;
  }

  if (currPlantTile) {
    currPlantTile.innerHTML = "";
    currPlantTile = null;
  }

  let randomTile = getRandomTile();

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

function selectTile(event) {
  if (gameOver) {
    return;
  }

  const clickedTile = event.currentTarget;

  if (clickedTile === currMoleTile) {
    score += 10;
    updateScore();
    clickedTile.innerHTML = "";
    currMoleTile = null;
    return;
  }

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

function updateScore() {
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.innerText = score;
  }
}

function updateLives() {
  const livesElement = document.getElementById("lives");
  if (livesElement) {
    livesElement.innerText = lives;
  }
}

function updateTime() {
  const timeElement = document.getElementById("time");
  if (timeElement) {
    timeElement.innerText = time;
  }
}

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

function endGame(message) {
  if (gameOver) {
    return;
  }

  gameOver = true;

  clearGameIntervals();

  if (currMoleTile) {
    currMoleTile.innerHTML = "";
    currMoleTile = null;
  }

  if (currPlantTile) {
    currPlantTile.innerHTML = "";
    currPlantTile = null;
  }

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

function restartGame() {
  clearGameIntervals();
  startGame();
}

function clearGameIntervals() {
  clearInterval(moleInterval);
  clearInterval(plantInterval);
  clearInterval(timerInterval);

  moleInterval = null;
  plantInterval = null;
  timerInterval = null;
}
