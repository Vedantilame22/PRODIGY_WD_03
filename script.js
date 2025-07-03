const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const winLine = document.getElementById('win-line');
const game = document.getElementById('game');

let currentPlayer = 'X';
let board = Array(9).fill('');
let gameActive = true;

const winPatterns = [
  [0, 1, 2], 
  [3, 4, 5],
  [6, 7, 8], 
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8], 
  [0, 4, 8],
  [2, 4, 6], 
];

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== '') return;

  board[index] = currentPlayer;
  e.target.classList.add(currentPlayer.toLowerCase());
  e.target.textContent = currentPlayer;

  const win = checkWinner();
  if (win) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    drawWinLine(win.pattern, currentPlayer);
  } else if (board.every(cell => cell !== '')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { pattern, winner: board[a] };
    }
  }
  return null;
}

function drawWinLine(pattern, player) {
  const [startIdx, , endIdx] = pattern;
  const startCell = cells[startIdx].getBoundingClientRect();
  const endCell = cells[endIdx].getBoundingClientRect();
  const gameRect = game.getBoundingClientRect();

  const x1 = startCell.left + startCell.width / 2 - gameRect.left;
  const y1 = startCell.top + startCell.height / 2 - gameRect.top;
  const x2 = endCell.left + endCell.width / 2 - gameRect.left;
  const y2 = endCell.top + endCell.height / 2 - gameRect.top;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  winLine.style.width = `${length}px`;
  winLine.style.top = `${y1}px`;
  winLine.style.left = `${x1}px`;
  winLine.style.transform = `rotate(${angle}deg)`;
  winLine.style.backgroundColor = player === 'X' ? '#0ff' : '#f0f';
  winLine.style.boxShadow = `0 0 15px ${player === 'X' ? '#0ff' : '#f0f'}`;
  winLine.style.display = 'block';
}

function resetGame() {
  board = Array(9).fill('');
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player X's turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });
  winLine.style.display = 'none';
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
