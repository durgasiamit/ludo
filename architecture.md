# Architecture.md — Simple Ludo Game

## 1. Tech Stack
- **HTML** — structure/board markup
- **CSS** — board and token styling, simple transitions
- **Vanilla JavaScript** — game logic and state management
- No frameworks, no build step, no backend, no database

Rationale: matches the "keep it simple" goal. A single static HTML file can
run directly in any browser or be hosted anywhere with zero configuration.

## 2. File Structure

```
ludo-game/
├── index.html      # Markup: board, dice button, turn indicator, win modal
├── style.css        # Board layout, token styles, colors, animations
└── script.js         # Game state, dice logic, movement, win detection
```

(Alternatively, all three can be combined into a single .html file with
inline <style> and <script> tags for maximum portability.)

## 3. Game State

A single JS object holds all game state:

```js
const gameState = {
  players: [
    { id: 0, name: "Player 1", position: 0, color: "red" },
    { id: 1, name: "Player 2", position: 0, color: "blue" }
  ],
  currentPlayerIndex: 0,
  boardLength: 30,      // total number of cells in the path
  lastRoll: null,
  gameOver: false,
  winner: null
};
```

Keeping state in one flat object makes it easy to reason about, serialize
(for debugging), and reset.

## 4. Core Modules / Functions

- `rollDice()` — returns a random integer 1–6, updates `lastRoll`.
- `moveCurrentPlayer(steps)` — updates the active player's `position`,
  clamped/checked against `boardLength`.
- `checkWinCondition()` — returns true if active player's position >=
  `boardLength`.
- `nextTurn()` — flips `currentPlayerIndex` between 0 and 1.
- `renderBoard()` — draws the board cells and token positions based on
  current state.
- `renderStatus()` — updates the turn indicator and dice result display.
- `resetGame()` — reinitializes `gameState` to defaults and re-renders.

## 5. Game Loop (Event-Driven, not a traditional loop)

Since this is a turn-based game, there's no continuous game loop — instead,
everything is driven by the "Roll Dice" button click:

```
[User clicks "Roll Dice"]
        │
        ▼
   rollDice() ──► moveCurrentPlayer(roll)
        │
        ▼
  checkWinCondition()
     │         │
   true       false
     │           │
     ▼           ▼
 show winner   nextTurn()
   screen         │
                  ▼
             renderBoard()
             renderStatus()
```

## 6. Board Representation

- The board is modeled as a simple **1D array of cell indices** (0 to
  `boardLength - 1`), even if visually displayed as a loop/cross shape via
  CSS positioning.
- Each cell's on-screen (x, y) position can be precomputed in a lookup
  table/array (`cellCoordinates[index] = {x, y}`), decoupling logical
  position from visual layout. This keeps movement logic simple regardless
  of how fancy the board visuals get later.

## 7. Rendering Strategy

- Simple DOM manipulation (no virtual DOM needed at this scale).
- Tokens are absolutely positioned `<div>` elements whose `left`/`top` (or
  `transform`) are updated based on `cellCoordinates[player.position]`.
- CSS `transition` on token position gives smooth movement for free, no
  animation library required.

## 8. Extensibility Notes (for future, non-v1 features)

- **Multiple tokens per player**: change `position` from a single number to
  an array of token positions; movement/rendering logic would iterate.
- **Capturing**: after `moveCurrentPlayer`, check if any opponent token
  shares the same cell and reset it if so.
- **Bonus squares**: maintain a `bonusCells` set; check membership after
  move and apply effect.
- **Online multiplayer**: would require introducing a backend/websocket
  layer and syncing `gameState` — explicitly deferred, not part of this
  architecture.

## 9. Testing Approach
- Manual browser testing is sufficient given project scope.
- Optionally, pure logic functions (`rollDice`, `moveCurrentPlayer`,
  `checkWinCondition`) can be unit-tested since they're decoupled from DOM
  rendering.

## 10. Deployment
- No build step required.
- Can be opened directly as a local file, or hosted on any static hosting
  (GitHub Pages, Netlify, etc.) by uploading the 2–3 files as-is.
