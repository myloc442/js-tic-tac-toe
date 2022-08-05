import { TURN } from './constants.js';
import { getCellElementList, getCurrentTurnElement } from './selectors.js';
import { checkGameStatus } from './utils.js';

console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));
console.log(checkGameStatus(['X', 'O', 'X', 'X', '0', 'O', 'O', 'O', 'X']));
console.log(checkGameStatus(['X', 'O', 'O', '', '', '', '', '', 'X']));
/**
 * Global variables
 */
let currentTurn = 'cross';
let isGameEnded = false;
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
function toggleTurn() {
  // toggle turn
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

  const turnElement = getCurrentTurnElement();
  if (!turnElement) return;

  turnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  turnElement.classList.add(currentTurn);
}

function handleCellClick(cell, index) {
  const isClicked = cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);
  if (isClicked) return;

  cell.classList.add(currentTurn);

  // toggle current turn
  toggleTurn();

  console.log(cell, index);
}

function initCellElementList() {
  const cellElementList = getCellElementList();

  cellElementList.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
  });
}

(() => {
  initCellElementList();
})();
