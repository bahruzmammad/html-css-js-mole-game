/*
  js/script.js

  Bu fayl "Whack a Mole" oyununun əsas loqikasını ehtiva edir.
  Aşağıdakı dəyişənlər və funksiyalar oyunun işləməsi üçün vacibdir:

  Dəyişənlər:
  - currMoleTile, currPlantTile: hazırda mədə (mole) və bitkinin yerləşdiyi DOM elementi
  - score, lives, time: oyun göstəriciləri
  - gameOver: oyunun bitib-bitmədiyini bildirir
  - moleInterval, plantInterval, timerInterval: setInterval üçün handlerlər
  - highScore: brauzerin localStorage-dan alınan yüksək bal

  Əsas funksiyalar:
  - startGame(): oyun vəziyyətini sıfırlayır və interval-ları başladır
  - createBoard(): 3x3 (9 hüceyrə) DOM lövhəsini yaradır
  - setMole(), setPlant(): təsadüfi hüceyrədə mole/plant göstərir
  - selectTile(): istifadəçi kliklədikdə işləyən funksiya — mole/plant aşkarlanıb müvafiq reaksiya
  - updateScore(), updateLives(), updateTime(): HTML elementlərini yeniləyir
  - updateTimer(): saniyə sayını azaldır və vaxt bitdikdə oyunu bitirir
  - endGame(): oyunu dayandırır, high score-u saxlayır və istifadəçiyə xəbərdarlıq göstərir
  - restartGame(): oyun yenidən başlayır
  - clearGameIntervals(): bütün interval-ları təmizləyir

  İzah (qısa):
  - Oyun yüklənəndə startGame() çağırılır. O, lövhəni yaradır, göstəriciləri sıfırlayır
    və mole/plant üçün interval-ları təyin edir. Kullanıcı bir hüceyrəni kliklədikdə
    selectTile() yoxlayır ki, kliklənən hüceyrədə mole var (xal əlavə olunur) yoxsa plant var
    (həyat azalır). Vaxt və ya həyat tükənəndə endGame() çağırılır.
*/

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
  // Yenidən başlama düyməsini bağlayırıq və oyunu start edirik
  document.getElementById("restart").addEventListener("click", restartGame);

  startGame();
});

// Oyunu başlanğıc vəziyyətinə gətirir
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

  // Mole və plant üçün interval-ları təyin edirik
  moleInterval = setInterval(setMole, 1000); // hər 1 saniyədə mole
  plantInterval = setInterval(setPlant, 2000); // hər 2 saniyədə plant

  // Vaxt sayacı
  timerInterval = setInterval(updateTimer, 1000);

  // Oyuna dərhal mole göstər
  setMole();
}

/* =========================
   CREATE BOARD
   3x3 grid — hər hüceyrə click event-ə bağlanır
   ========================= */
function createBoard() {
  const board = document.getElementById("board");

  board.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const tile = document.createElement("div");

    tile.id = i.toString();

    // Klik hadisəsi — istifadəçi hüceyrəni vurduqda selectTile işləyir
    tile.addEventListener("click", selectTile);

    board.appendChild(tile);
  }
}

/* =========================
   RANDOM TILE
   0-8 arası təsadüfi nömrə qaytarır
   ========================= */
function getRandomTile() {
  const number = Math.floor(Math.random() * 9);

  return number.toString();
}

/* =========================
   MOLE
   Mövcud mole-i silib yeni hüceyrədə mole göstərir
   Əgər həmin hüceyrədə plant varsa, mole yerləşdirmir (toqquşma önlənir)
   ========================= */
function setMole() {
  if (gameOver) {
    return;
  }

  // Köhnə mole-i sil
  if (currMoleTile) {
    currMoleTile.innerHTML = "";
    currMoleTile = null;
  }

  let randomTile = getRandomTile();

  // Mole-i plant olan hüceyrəyə qoyma
  if (currPlantTile && currPlantTile.id === randomTile) {
    return;
  }

  const tile = document.getElementById(randomTile);

  if (!tile) {
    return;
  }

  const mole = document.createElement("img");

  // DİQQƏT: js faylı "js/" qovluğunda olduğu üçün assets yolu ../assets/ olaraq qalmalıdır
  mole.src = "../assets/monty-mole.png";
  mole.alt = "Mole";

  tile.appendChild(mole);

  currMoleTile = tile;
}

/* =========================
   PLANT
   Plant də eyni şəkildə göstərilir; mole ilə toqquşmaya icazə verilmir
   ========================= */
function setPlant() {
  if (gameOver) {
    return;
  }

  // Köhnə plant-i sil
  if (currPlantTile) {
    currPlantTile.innerHTML = "";
    currPlantTile = null;
  }

  let randomTile = getRandomTile();

  // Plant-i mole olan hüceyrəyə qoyma
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
   İstifadəçi hüceyrəni kliklədikdə burada yoxlanılır:
   - Mole kliklənibsə score artırılır və mole silinir
   - Plant kliklənibsə lives azalır və plant silinir
   ========================= */
function selectTile(event) {
  if (gameOver) {
    return;
  }

  const clickedTile = event.currentTarget;

  // Mole kliklənmişsə
  if (clickedTile === currMoleTile) {
    score += 10;

    updateScore();

    clickedTile.innerHTML = "";

    currMoleTile = null;

    return;
  }

  // Plant kliklənmişsə
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
   SCORE / LIVES / TIMER helpers
   DOM elementlərini yeniləyir
   ========================= */
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

/* =========================
   TIMER COUNTDOWN
   Hər saniyə çağırılır; vaxt 0-a çatdıqda oyunu bitirir
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
   Oyun bitdikdə interval-ları təmizləyir, obyektləri silir və high score-u saxlayır
   ========================= */
function endGame(message) {
  if (gameOver) {
    return;
  }

  gameOver = true;

  clearGameIntervals();

  // Mole-i sil
  if (currMoleTile) {
    currMoleTile.innerHTML = "";
    currMoleTile = null;
  }

  // Plant-i sil
  if (currPlantTile) {
    currPlantTile.innerHTML = "";
    currPlantTile = null;
  }

  // Yüksək balı yadda saxla
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
   Restart düyməsi ilə çağırılır: interval-ları təmizləyir və oyunu yenidən başlayır
   ========================= */
function restartGame() {
  clearGameIntervals();

  startGame();
}

/* =========================
   CLEAR INTERVALS
   setInterval-lərlə yaradılmış handler-ları dayandırır
   ========================= */
function clearGameIntervals() {
  clearInterval(moleInterval);
  clearInterval(plantInterval);
  clearInterval(timerInterval);

  moleInterval = null;
  plantInterval = null;
  timerInterval = null;
}
