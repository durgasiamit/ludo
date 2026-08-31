# PRD.md — Simple Ludo Game

## 1. Overview
A simplified, browser-based Ludo-style dice race game for 2 local players.
Built to be clean, minimal, and easy to understand — both for players and for
anyone reading the code.

## 2. Problem Statement
Classic Ludo is fun but has enough rules (4 tokens, capturing, home stretches,
roll-a-6-to-start) that a from-scratch implementation becomes unnecessarily
complex for a simple project. Players who just want a quick, casual dice race
don't need all of that. There's no dead-simple, clean version readily
available to point to as a lightweight game/reference project.

## 3. Goals
- Deliver a playable, working 2-player Ludo-lite game in the browser.
- Keep the implementation simple: minimal state, minimal rules.
- Make the game genuinely fun to play in short (2–5 minute) sessions.
- Serve as a clean example of simple front-end game-state management.

## 4. Non-Goals
- Not building full classic Ludo rules.
- Not building multiplayer over network.
- Not building for mobile app stores.
- Not persisting game history/accounts.

## 5. User Stories

- As a player, I want to click "Roll Dice" so I can move my token forward.
- As a player, I want to clearly see whose turn it is so there's no
  confusion.
- As a player, I want to see my token move on the board so I can track
  progress.
- As a player, I want the game to announce a winner when someone finishes.
- As a player, I want to start a new game easily without refreshing the page.

## 6. Functional Requirements

| ID   | Requirement                                                        |
|------|---------------------------------------------------------------------|
| FR1  | The game must support exactly 2 players, alternating turns.         |
| FR2  | Each player has exactly one token with a position (0 to N).         |
| FR3  | Rolling the dice generates a random integer between 1 and 6.        |
| FR4  | The active player's token moves forward by the rolled value.        |
| FR5  | Turn passes to the other player after each move.                    |
| FR6  | When a token's position reaches or exceeds the final cell, that     |
|      | player wins and the game stops accepting moves.                     |
| FR7  | A "New Game" / reset action resets all state to initial values.     |
| FR8  | UI must indicate current turn and dice result at all times.         |

## 7. Non-Functional Requirements

- **Simplicity**: total game logic should be understandable in a single
  read-through; avoid over-engineering (no state management libraries,
  no build tooling needed).
- **Performance**: must run smoothly in any modern browser, no lag.
- **Portability**: single HTML file (or small set of files) that runs
  without a server, or with a trivial static server.
- **No dependencies required** beyond optional lightweight CSS/JS, if any.

## 8. Success Metrics (informal, since this is a small project)
- Game is playable start-to-finish without bugs.
- Full game (roll → move → win) can be completed in under 5 minutes.
- Codebase stays small (~1 file, a few hundred lines) and easy to extend.

## 9. Milestones

1. **M1 — Board & State**: Render board, set up player state, no dice yet.
2. **M2 — Dice & Movement**: Add dice roll, move token, pass turns.
3. **M3 — Win Condition & Reset**: Detect winner, show message, reset flow.
4. **M4 (optional) — Polish**: animations, bonus squares, sounds, names.

## 10. Open Questions
- Do we want the "bonus square" feature in v1 or defer to v2?
- Should turn order be random at game start, or always Player 1 first?
- Do we want basic keyboard accessibility (e.g. spacebar to roll)?
