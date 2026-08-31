# Features.md — Simple Ludo Game

## Core Features (v1 — must have)

1. **2-Player Local Play**
   - Two players take turns on the same device.
   - Turn indicator clearly shows whose turn it is.

2. **Single Token Per Player**
   - Each player controls exactly one token (no piece-selection logic needed).

3. **Dice Roll**
   - Player clicks a "Roll Dice" button.
   - Random number 1–6 is generated and displayed.
   - Token automatically moves forward that many cells.

4. **Simple Linear/Loop Board**
   - A fixed path of cells (e.g. 30–40 cells) laid out in a loop or track.
   - No branching paths, no separate home columns per color.

5. **Turn Management**
   - After a move, turn automatically passes to the other player.
   - No "roll a 6 to go again" rule (keeps flow simple) — optional stretch
     feature if desired later.

6. **Win Condition**
   - First player whose token reaches (or passes) the final cell wins.
   - Simple win screen/message with a "Play Again" option.

7. **Reset / New Game**
   - Button to reset board state and start a new game.

## Nice-to-Have Features (Optional, low complexity)

- **Bonus Square**: one or two special cells that grant an extra roll or move
  forward a few extra cells. Purely optional flavor, not required.
- **Sound effects**: dice roll sound, win sound.
- **Token animation**: smooth CSS transition when moving between cells
  instead of an instant jump.
- **Player name input**: let players type their names instead of "Player 1 /
  Player 2".

## Explicitly Out of Scope (v1)

- Multiple tokens per player
- Capturing / sending opponent tokens back to start
- Safe zones
- 4-player support
- Online/networked multiplayer
- Persistent scoreboards or accounts
- Mobile native app

## Feature Priority Summary

| Feature                     | Priority | Complexity |
|------------------------------|----------|------------|
| 2-player turn system          | Must     | Low        |
| Single token per player       | Must     | Low        |
| Dice roll + auto move         | Must     | Low        |
| Simple board/path             | Must     | Low        |
| Win condition + reset         | Must     | Low        |
| Bonus square                  | Nice     | Low        |
| Animations/sounds             | Nice     | Low-Med    |
| Player names                  | Nice     | Low        |
