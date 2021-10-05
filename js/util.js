'use strict';

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function ranEmptyCell(board) {
  var emptyCells = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (board[i][j] === EMPTY) {
        emptyCells.push({ i: i, j: j });
      }
    }
  }
  if (emptyCells.length === 0) return;
  return emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)];
}

function renderCell(location, val) {
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  //update MODEL:
  gBoard[location.i][location.j] = val;
  //update DOM:
  elCell.children[0].innerHTML = val;
}

function showCellVal(location) {
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.children[0].style.display = 'inline';
}
function hideCellVal(location) {
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.children[0].style.display = 'none';
}

// removes the cover background image.
function removeCellCover(location) {
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.classList.remove('cell-cover');
  gBoard[location.i][location.j].isShown = true;
}

function addCellCover(location) {
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.classList.add('cell-cover');
  gBoard[location.i][location.j].isShown = false;
}