const BOARD_SIZE = 5;
const FIXED_SETUP = {
  0: ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-H3'],
  4: ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-H3']
};

let board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
let currentPlayer = 'A';
let selectedCharacter = null;
let winner = null;
const moveHistory = [];

const gameBoard = document.getElementById('game-board');
const currentPlayerDisplay = document.getElementById('current-player');
const moveHistoryList = document.querySelector('#move-history ul');
const restartBtn = document.getElementById('restart-btn');
const moveButtonsContainer = document.getElementById('move-buttons');

const startGame = () => {
  board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  Object.entries(FIXED_SETUP).forEach(([rowIndex, characters]) => {
    characters.forEach((char, colIndex) => {
      board[rowIndex][colIndex] = char;
    });
  });
  renderBoard();
  currentPlayer = 'A';
  winner = null;
  selectedCharacter = null;
  moveHistory.length = 0;
  moveHistoryList.innerHTML = '';
  moveButtonsContainer.innerHTML = '';
  currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
};

const renderBoard = () => {
  gameBoard.innerHTML = '';
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'cell';
      cellDiv.textContent = cell;
      cellDiv.addEventListener('click', () => handleClick(rowIndex, colIndex));
      gameBoard.appendChild(cellDiv);
    });
  });
};

const getMoveOptions = (character) => ['L', 'R', 'B', 'F'];
const getHero2MoveOptions = (character) => ['FL', 'FR', 'BL', 'BR'];

const handleClick = (row, col) => {
  const cell = board[row][col];
  if (cell && !winner) {
    if (!cell.startsWith(currentPlayer)) {
      alert(`It's ${currentPlayer}'s turn!`);
      return;
    }

    const moveOptions = cell.startsWith('A-H') || cell.startsWith('B-H')
      ? getHero2MoveOptions(cell)
      : getMoveOptions(cell);

    selectedCharacter = { cell, row, col };
    showMoveOptions(moveOptions);
  }
};

const showMoveOptions = (moveOptions) => {
  moveButtonsContainer.innerHTML = '';  // Clear previous buttons
  moveOptions.forEach(direction => {
    const moveBtn = document.createElement('button');
    moveBtn.textContent = `Move ${direction}`;
    moveBtn.addEventListener('click', () => handleMove(direction));
    moveButtonsContainer.appendChild(moveBtn);
  });
};

const handleMove = (direction) => {
  if (selectedCharacter && !winner) {
    const { cell, row, col } = selectedCharacter;
    let newRow = row, newCol = col;

    switch (direction) {
      case 'L': newCol = currentPlayer === 'A' ? col + 1 : col - 1; break;
      case 'R': newCol = currentPlayer === 'A' ? col - 1 : col + 1; break;
      case 'B': newRow = currentPlayer === 'A' ? row - 1 : row + 1; break;
      case 'F': newRow = currentPlayer === 'A' ? row + 1 : row - 1; break;
      case 'FL': newRow = currentPlayer === 'A' ? row + 1 : row - 1; newCol = currentPlayer === 'A' ? col + 1 : col - 1; break;
      case 'FR': newRow = currentPlayer === 'A' ? row + 1 : row - 1; newCol = currentPlayer === 'A' ? col - 1 : col + 1; break;
      case 'BL': newRow = currentPlayer === 'A' ? row - 1 : row + 1; newCol = currentPlayer === 'A' ? col + 1 : col - 1; break;
      case 'BR': newRow = currentPlayer === 'A' ? row - 1 : row + 1; newCol = currentPlayer === 'A' ? col - 1 : col + 1; break;
    }

    if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
      const targetCell = board[newRow][newCol];
      if (targetCell && targetCell.startsWith(currentPlayer)) {
        alert('Cell occupied by your character.');
        return;
      }

      if (targetCell && !targetCell.startsWith(currentPlayer)) {
        alert(`${currentPlayer} wins!`);
        winner = currentPlayer;
        return;
      }

      board[newRow][newCol] = cell;
      board[row][col] = null;
      renderBoard();

      moveHistory.push(`${cell} moved to (${newRow}, ${newCol})`);
      updateMoveHistory();

      moveButtonsContainer.innerHTML = '';  // Clear move buttons after a move is made
      selectedCharacter = null;
      currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
      currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
    }
  }
};

const updateMoveHistory = () => {
  moveHistoryList.innerHTML = '';
  moveHistory.forEach(move => {
    const li = document.createElement('li');
    li.textContent = move;
    moveHistoryList.appendChild(li);
  });
};

restartBtn.addEventListener('click', startGame);

startGame();
