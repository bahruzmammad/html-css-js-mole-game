# Whack-a-Mole

A small, dependency-free browser game built with HTML, CSS and JavaScript. Click moles to score points and avoid piranha plants — the game tracks score, lives, a countdown timer, and saves the high score to localStorage.

---

## Demo

Open `index.html` in your browser or serve the repository with a local static server. Example:

```bash
# clone
git clone https://github.com/bahruzmammad/html-css-js-mole-game.git
cd html-css-js-mole-game

# optional: serve with a simple static server
npx http-server .
# then open http://localhost:8080 in your browser
```

---

## Features

- Vanilla HTML, CSS and JavaScript — no build tools or dependencies
- 3×3 clickable board (9 tiles)
- Moles spawn every second; plants spawn every two seconds
- Score increments by 10 when a mole is whacked
- Clicking a plant reduces a life; game ends when lives reach 0 or time runs out
- High score persisted to `localStorage`
- Restart button to play again

---

## Controls / How to play

- Click a tile to interact:
  - Click a mole: +10 points
  - Click a piranha plant: -1 life
- Click the **Restart Game** button to reset the game

---

## Game configuration

The basic gameplay values are defined in `js/script.js`. You can change them to adjust difficulty.

Example of the main variables:

```javascript
let score = 0;
let lives = 3;      // starting lives
let time = 30;     // starting time in seconds

// spawn intervals (milliseconds)
let moleInterval = setInterval(setMole, 1000);   // mole every 1s
let plantInterval = setInterval(setPlant, 2000); // plant every 2s
```

Adjust `lives`, `time`, and the intervals to change the game's difficulty.

---

## Project structure

- index.html — game markup
- css/style.css — styles and layout
- js/script.js — game logic and timers
- assets/ — images used by the game (mole, plant, background, pipes, soil)

Important asset filenames referenced by the code (place these in `assets/`):

- `monty-mole.png`
- `piranha-plant.png`
- `mario-bg.jpg`
- `soil.png`
- `pipe.png`

---

## Development notes

- The game uses DOM manipulation and `setInterval` timers to show/hide moles and plants and to count down the game time.
- High score is stored under the `highScore` key in the browser `localStorage`.
- The `js/script.js` file contains comments in Azerbaijani describing each function — these comments do not affect runtime.

Tips:
- To debug visually, open DevTools and inspect the `#board` element — each tile is a child `div` with id `0`..`8`.
- If images do not appear, verify that the `assets/` folder is present and the filenames match exactly.

---

## Accessibility & improvements (ideas)

- Add keyboard controls so the game is playable without a mouse
- Add ARIA labels for screen readers
- Add sound effects and visual hit/feedback
- Add difficulty levels or progressively faster spawn rates
- Add unit tests and CI (GitHub Actions) for repository health checks

---

## Contributing

Contributions are welcome. Suggestions:

- Open issues for bugs or feature requests
- Submit pull requests for improvements (code, assets, README)

When submitting PRs, keep changes small and include screenshots or recordings for visual changes.
