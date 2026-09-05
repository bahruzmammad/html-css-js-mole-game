# Whack a Mole

A simple Whack-a-Mole style browser game built with HTML, CSS, and JavaScript.

Players click on tiles to whack moles while avoiding piranha plants. The game tracks score, remaining lives, a countdown timer, and persists the high score in localStorage.

## Features

- Vanilla HTML/CSS/JS — no build tools required
- 3x3 game board with clickable tiles
- Moles appear every second, plants appear every two seconds
- Score increases by 10 for each mole whacked
- Clicking a plant costs a life; game ends when lives reach 0 or time runs out
- High score saved to localStorage
- Restart button to start a new game

## Demo

Open `index.html` in your browser (double-click or serve with a static file server) to play.

## How to run locally

1. Clone the repository:

   git clone https://github.com/bahruzmammad/html-css-js-mole-game.git

2. Open the project folder and open `index.html` in your browser:

   - Double-click `index.html` or
   - Serve the folder with a static server (recommended to avoid some browser asset restrictions):

     npx http-server .

## Controls

- Click a tile to interact.
  - Clicking a mole: +10 points
  - Clicking a plant: -1 life
- Click the "Restart Game" button to reset score, lives, and timer

## Game rules / values

- Starting lives: 3
- Starting time: 30 seconds
- Mole spawn interval: 1 second
- Plant spawn interval: 2 seconds
- Points per mole: 10

These values are defined in `js/script.js` and can be adjusted there.

## Project structure

- index.html — game HTML
- css/style.css — game styles
- js/script.js — game logic
- assets/ — images used by the game (mole, plant, background, pipes, soil)

Important asset filenames used by the project (place them in `assets/`):

- monty-mole.png
- piranha-plant.png
- mario-bg.jpg
- soil.png
- pipe.png

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests to add features, fix bugs, or improve the UI.

Ideas:

- Add levels or difficulty scaling
- Improve accessibility (keyboard controls, ARIA attributes)
- Add sound effects and animations

## Notes

- High score is stored in the browser's `localStorage` under the `highScore` key.
- The game is intentionally small and dependency-free — it's great for learning DOM manipulation and timers.

## License

This repository does not include a license file. If you want to add one, consider adding an MIT or other permissive license.

## Author

bahruzmammad
