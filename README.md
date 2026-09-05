# Whack-a-Mole

A small, dependency-free browser game built with HTML, CSS and JavaScript. Click moles to score points and avoid piranha plants. The game tracks score, lives, a countdown timer, and saves the high score to `localStorage`.

---

## Demo

Open `index.html` in your browser or serve the repository with a local static server.

```bash
git clone https://github.com/bahruzmammad/html-css-js-mole-game.git
cd html-css-js-mole-game
npx http-server .
```

Then open:

```text
http://localhost:8080
```

---

## Features

- HTML, CSS and JavaScript
- No external dependencies
- 3×3 clickable board with 9 tiles
- Moles spawn every second
- Piranha plants spawn every two seconds
- Clicking a mole adds 10 points
- Clicking a piranha plant removes 1 life
- Starts with 3 lives
- 30-second countdown timer
- Game ends when lives reach `0` or time runs out
- High score saved to `localStorage`
- Restart button to play again
- Custom game-over modal
- Displays final score and high score
- Responsive design for desktop, tablet and mobile
- Reduced-motion support
- Basic keyboard focus support

---

## Controls / How to Play

Click a tile to interact with the game.

```text
Mole            +10 points
Piranha Plant   -1 life
```

The game starts with:

```text
Score: 0
Lives: 3
Time: 30
```

The game ends when:

```text
Lives = 0
Time = 0
```

When the game ends, a custom modal displays:

```text
Final Score
High Score
```

Click **Play Again** or **Restart Game** to start a new game.

---

## Game Configuration

The main gameplay values are defined in `js/script.js`.

```javascript
let score = 0;
let lives = 3;
let time = 30;

moleInterval = setInterval(setMole, 1000);
plantInterval = setInterval(setPlant, 2000);
timerInterval = setInterval(updateTimer, 1000);
```

You can change these values to adjust the difficulty.

For example:

```javascript
let lives = 5;
let time = 60;

moleInterval = setInterval(setMole, 700);
plantInterval = setInterval(setPlant, 1500);
```

---

## High Score

The high score is stored in the browser using `localStorage`.

```javascript
localStorage.setItem("highScore", highScore);
```

The storage key is:

```text
highScore
```

The high score remains available after refreshing the page.

---

## Project Structure

```text
whack-a-mole/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── mario-bg.jpg
    ├── monty-mole.png
    ├── piranha-plant.png
    ├── pipe.png
    └── soil.png
```

### Files

```text
index.html      Game structure and game-over modal
css/style.css   Game styling and responsive layout
js/script.js    Game logic, score, lives, timer and modal
assets/         Images and backgrounds used by the game
```

---

## Development Notes

The game uses vanilla JavaScript and DOM manipulation without external libraries.

The main systems include:

```text
Dynamic 3×3 board creation
Random mole spawning
Random piranha plant spawning
Click event handling
Score management
Lives management
Countdown timer
Game state management
High score persistence
Custom game-over modal
Game restart functionality
Responsive layout
```

The game uses a custom modal instead of the browser `alert()` dialog when the game ends.

Game state is reset when the player starts a new game.

---

## Responsive Design

The layout adapts to different screen sizes.

```text
Desktop
Tablet
Mobile
Small mobile screens
```

The game board keeps a square aspect ratio and scales based on the available screen width.

The layout also prevents horizontal overflow on smaller devices.

---

## Accessibility

The project includes basic accessibility improvements:

```text
Descriptive alt text
Semantic buttons
Modal dialog attributes
Visible focus states
Touch-friendly controls
Reduced-motion support
```

---

## Technologies

```text
HTML5
CSS3
JavaScript
Browser localStorage
DOM API
```

---

## License

This project is open for learning and personal use.
