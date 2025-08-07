document.addEventListener('DOMContentLoaded', () => {
  const controls = document.querySelector('.controls');
  const chooseXBtn = document.getElementById('choose-x');
  const chooseOBtn = document.getElementById('choose-o');
  const boardEl = document.getElementById('board');
  const messageEl = document.getElementById('message');
  const restartBtn = document.getElementById('restart');

  let player = null;
  let ai = null;
  let board = Array(9).fill(null);
  let isGameOver = false;

  function startGame(symbol) {
    player = symbol;
    ai = player === 'X' ? 'O' : 'X';
    controls.style.display = 'none';
    messageEl.textContent = `You are ${player}. Your move.`;
    renderBoard();
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    board.forEach((cell, idx) => {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell');
      if (cell) {
        cellEl.textContent = cell;
        cellEl.classList.add('disabled');
      }
      cellEl.addEventListener('click', () => handleCellClick(idx));
      boardEl.appendChild(cellEl);
    });
  }

  function handleCellClick(idx) {
    if (board[idx] || isGameOver || !player) return;
    board[idx] = player;
    renderBoard();
    checkResult();
    if (!isGameOver) {
      messageEl.textContent = 'AI is thinking...';
      setTimeout(() => {
        aiMove();
        renderBoard();
        checkResult();
      }, 500);
    }
  }

  function aiMove() {
    const available = board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter(idx => idx !== null);
    const choice = available[Math.floor(Math.random() * available.length)];
    if (choice != null) {
      board[choice] = ai;
    }
  }

  function checkResult() {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (const [a,b,c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        endGame(board[a] === player ? 'You win!' : 'AI wins!');
        return;
      }
    }
    if (board.every(cell => cell)) {
      endGame('Draw!');
    }
  }

  function endGame(text) {
    isGameOver = true;
    messageEl.textContent = text;
    document.querySelectorAll('.cell').forEach(c => c.classList.add('disabled'));
  }

  chooseXBtn.addEventListener('click', () => startGame('X'));
  chooseOBtn.addEventListener('click', () => startGame('O'));
  restartBtn.addEventListener('click', () => window.location.reload());
});