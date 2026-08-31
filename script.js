/**
 * Ludo Lite — 2-Player Dice Race Game Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Config & State
  const TOTAL_CELLS = 30; // Cells 0 to 29
  const BONUS_CELLS = [10, 20];
  const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const gameState = {
    players: [
      { id: 0, name: "Player 1", position: 0, color: "red" },
      { id: 1, name: "Player 2", position: 0, color: "blue" }
    ],
    currentPlayerIndex: 0,
    lastRoll: null,
    gameOver: false,
    isRolling: false
  };

  // DOM Elements
  const boardGridEl = document.getElementById('board-grid');
  const token0El = document.getElementById('token-0');
  const token1El = document.getElementById('token-1');
  const rollBtn = document.getElementById('roll-btn');
  const resetBtn = document.getElementById('reset-btn');
  const modalResetBtn = document.getElementById('modal-reset-btn');
  const diceEl = document.getElementById('dice');
  const diceFaceEl = document.getElementById('dice-face');
  const diceStatusEl = document.getElementById('dice-status');
  const p0Card = document.getElementById('player-card-0');
  const p1Card = document.getElementById('player-card-1');
  const p0ProgressEl = document.getElementById('p0-progress');
  const p1ProgressEl = document.getElementById('p1-progress');
  const winnerModal = document.getElementById('winner-modal');
  const winnerTitle = document.getElementById('winner-title');
  const winnerMessage = document.getElementById('winner-message');

  // Web Audio Context for synthesized sound effects
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'roll') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'move') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'bonus') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.15);
        osc.frequency.setValueAtTime(783.99, now + 0.3);
        osc.frequency.setValueAtTime(1046.50, now + 0.45);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Generate 5x6 Serpentine Board Grid
  // Row 0: 0->5
  // Row 1: 11<-6
  // Row 2: 12->17
  // Row 3: 23<-18
  // Row 4: 24->29
  function buildBoard() {
    boardGridEl.innerHTML = '';
    const cellMap = new Array(TOTAL_CELLS);

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 6; c++) {
        let cellIndex;
        if (r % 2 === 0) {
          cellIndex = r * 6 + c;
        } else {
          cellIndex = r * 6 + (5 - c);
        }

        const cellEl = document.createElement('div');
        cellEl.className = 'cell';
        cellEl.dataset.cellIndex = cellIndex;

        // Determine special cell types
        if (cellIndex === 0) {
          cellEl.classList.add('cell-start');
          cellEl.innerHTML = `
            <span class="cell-num">0</span>
            <span class="cell-icon">🚩</span>
            <span class="cell-label">START</span>
          `;
        } else if (cellIndex === TOTAL_CELLS - 1) {
          cellEl.classList.add('cell-finish');
          cellEl.innerHTML = `
            <span class="cell-num">${cellIndex}</span>
            <span class="cell-icon">🏆</span>
            <span class="cell-label">GOAL</span>
          `;
        } else if (BONUS_CELLS.includes(cellIndex)) {
          cellEl.classList.add('cell-bonus');
          cellEl.innerHTML = `
            <span class="cell-num">${cellIndex}</span>
            <span class="cell-icon">⚡</span>
            <span class="cell-label">+2 BOOST</span>
          `;
        } else {
          cellEl.innerHTML = `
            <span class="cell-num">${cellIndex}</span>
            <span class="cell-icon"></span>
            <span class="cell-label"></span>
          `;
        }

        boardGridEl.appendChild(cellEl);
        cellMap[cellIndex] = cellEl;
      }
    }
  }

  // Update positions of floating tokens on the board
  function updateTokenPositions() {
    const boardRect = boardGridEl.getBoundingClientRect();
    const p0Pos = gameState.players[0].position;
    const p1Pos = gameState.players[1].position;

    const cell0El = boardGridEl.querySelector(`[data-cell-index="${p0Pos}"]`);
    const cell1El = boardGridEl.querySelector(`[data-cell-index="${p1Pos}"]`);

    if (cell0El) {
      const rect0 = cell0El.getBoundingClientRect();
      const left0 = rect0.left - boardRect.left + (rect0.width / 2) - 16;
      const top0 = rect0.top - boardRect.top + (rect0.height / 2) - 16;

      token0El.style.left = `${left0}px`;
      token0El.style.top = `${top0}px`;
    }

    if (cell1El) {
      const rect1 = cell1El.getBoundingClientRect();
      const left1 = rect1.left - boardRect.left + (rect1.width / 2) - 16;
      const top1 = rect1.top - boardRect.top + (rect1.height / 2) - 16;

      token1El.style.left = `${left1}px`;
      token1El.style.top = `${top1}px`;
    }

    // Offset tokens if sharing the exact same cell
    if (p0Pos === p1Pos) {
      token0El.classList.add('offset-p0');
      token1El.classList.add('offset-p1');
    } else {
      token0El.classList.remove('offset-p0');
      token1El.classList.remove('offset-p1');
    }
  }

  // Update UI Player Status Cards & Turn Indicators
  function updateUI() {
    p0ProgressEl.textContent = `Position: ${gameState.players[0].position} / 29`;
    p1ProgressEl.textContent = `Position: ${gameState.players[1].position} / 29`;

    if (gameState.currentPlayerIndex === 0) {
      p0Card.classList.add('active');
      p1Card.classList.remove('active');
    } else {
      p1Card.classList.add('active');
      p0Card.classList.remove('active');
    }

    const activePlayer = gameState.players[gameState.currentPlayerIndex];
    if (!gameState.gameOver && !gameState.isRolling) {
      diceStatusEl.innerHTML = `<strong>${activePlayer.name}</strong>'s turn to roll!`;
    }

    updateTokenPositions();
  }

  // Dice Roll Handler
  function handleRoll() {
    if (gameState.gameOver || gameState.isRolling) return;
    initAudio();

    gameState.isRolling = true;
    rollBtn.disabled = true;
    diceEl.classList.add('rolling');

    const activePlayer = gameState.players[gameState.currentPlayerIndex];
    diceStatusEl.textContent = `${activePlayer.name} is rolling...`;

    let rollCount = 0;
    const interval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * 6) + 1;
      diceFaceEl.textContent = DICE_FACES[tempRoll - 1];
      playSound('roll');
      rollCount++;

      if (rollCount >= 7) {
        clearInterval(interval);
        
        // Final Roll Result
        const rollResult = Math.floor(Math.random() * 6) + 1;
        gameState.lastRoll = rollResult;
        diceFaceEl.textContent = DICE_FACES[rollResult - 1];
        diceEl.classList.remove('rolling');

        diceStatusEl.innerHTML = `<strong>${activePlayer.name}</strong> rolled a <strong>${rollResult}</strong>!`;

        // Execute Move
        setTimeout(() => {
          executeMove(rollResult);
        }, 300);
      }
    }, 70);
  }

  // Move Active Player Step-by-Step
  function executeMove(steps) {
    const player = gameState.players[gameState.currentPlayerIndex];
    let remainingSteps = steps;

    const stepInterval = setInterval(() => {
      if (remainingSteps > 0 && player.position < TOTAL_CELLS - 1) {
        player.position += 1;
        playSound('move');
        updateUI();
        remainingSteps--;
      } else {
        clearInterval(stepInterval);
        
        // Check for Bonus Cell
        if (BONUS_CELLS.includes(player.position) && player.position < TOTAL_CELLS - 1) {
          setTimeout(() => {
            playSound('bonus');
            player.position = Math.min(TOTAL_CELLS - 1, player.position + 2);
            diceStatusEl.innerHTML = `⚡ <strong>BONUS!</strong> ${player.name} boosted +2 steps forward!`;
            updateUI();
            
            // Check win after bonus
            finalizeTurn(player);
          }, 400);
        } else {
          finalizeTurn(player);
        }
      }
    }, 220);
  }

  // Finalize Turn / Check Win Condition
  function finalizeTurn(player) {
    if (player.position >= TOTAL_CELLS - 1) {
      // WIN CONDITION REACHED
      gameState.gameOver = true;
      gameState.winner = player;
      playSound('win');

      winnerTitle.textContent = `${player.name.toUpperCase()} WINS! 🎉`;
      winnerTitle.style.color = player.id === 0 ? 'var(--p1-color)' : 'var(--p2-color)';
      winnerMessage.textContent = `Victory! ${player.name} reached the final cell first.`;
      winnerModal.classList.remove('hidden');

      diceStatusEl.innerHTML = `🏆 <strong>${player.name} WINS THE GAME!</strong>`;
      rollBtn.disabled = true;
      gameState.isRolling = false;
    } else {
      // Pass Turn to next player
      gameState.currentPlayerIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
      gameState.isRolling = false;
      rollBtn.disabled = false;
      updateUI();
    }
  }

  // Reset Game State
  function resetGame() {
    gameState.players[0].position = 0;
    gameState.players[1].position = 0;
    gameState.currentPlayerIndex = 0;
    gameState.lastRoll = null;
    gameState.gameOver = false;
    gameState.isRolling = false;

    diceFaceEl.textContent = '🎲';
    winnerModal.classList.add('hidden');
    rollBtn.disabled = false;

    updateUI();
  }

  // Event Listeners
  rollBtn.addEventListener('click', handleRoll);
  resetBtn.addEventListener('click', resetGame);
  modalResetBtn.addEventListener('click', resetGame);

  // Keyboard shortcut: Spacebar to roll
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameState.gameOver && !gameState.isRolling) {
      e.preventDefault();
      handleRoll();
    }
  });

  // Re-calculate token positioning on window resize
  window.addEventListener('resize', updateTokenPositions);

  // Initialization
  buildBoard();
  updateUI();
});
