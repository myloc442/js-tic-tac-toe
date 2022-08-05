import { CELL_VALUE, GAME_STATUS, TURN } from './constants.js';
import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
  getUlElement,
} from './selectors.js';
import { checkGameStatus } from './utils.js';

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill('');

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
function setValueTurn(turn) {
  const turnElement = getCurrentTurnElement();
  if (!turnElement) return;

  turnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  turnElement.classList.add(turn);
}

function toggleTurn() {
  // toggle turn
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

  setValueTurn(currentTurn);
}

function updateContentStatus(status) {
  gameStatus = status;

  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = status;
}

function showReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) replayButtonElement.classList.add('show');
}

function hideReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) replayButtonElement.classList.remove('show');
}

function highLightCellWin(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error('Invalid win position!');
  }

  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    if (cell) cell.classList.add('win');
  }
}

function handleCellClick(cell, index) {
  const isClicked = cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  if (isClicked || isEndGame) return;

  cell.classList.add(currentTurn);
  cellValues[index] = currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

  // toggle current turn
  toggleTurn();

  // check status game
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      updateContentStatus(game.status);
      showReplayButton();
      break;
    }
    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN: {
      updateContentStatus(game.status);
      showReplayButton();
      highLightCellWin(game.winPositions);
      break;
    }
    default:
      break;
  }
}

function initCellElementList() {
  const cellElementList = getCellElementList();

  // XXX Event delegation
  // Thay vì dùng vòng lặp gắn sự kiện cho các li
  cellElementList.forEach((cell, index) => {
    cell.dataset.index = index;
  });

  const cellListElement = getUlElement();
  if (!cellListElement) return;

  cellListElement.addEventListener('click', (event) => {
    const cellElement = event.target;
    if (cellElement.tagName !== 'LI') return;

    const index = Number.parseInt(cellElement.dataset.index);
    handleCellClick(cellElement, index);
  });
}

function resetGame() {
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => '');

  updateContentStatus(gameStatus);
  setValueTurn(TURN.CROSS);

  const cellElementList = getCellElementList();
  for (const cell of cellElementList) {
    cell.className = '';
  }

  hideReplayButton();
}

function initReplayButton() {
  const replayButtonElement = getReplayButtonElement();

  if (!replayButtonElement) {
    throw new Error('can not find replay button !');
  }

  replayButtonElement.addEventListener('click', resetGame);
}

(() => {
  initCellElementList();
  initReplayButton();
})();
