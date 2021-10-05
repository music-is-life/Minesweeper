'use strict';

const MINE = '💣';

var gMines = [];


function checkMinesNegsCount(board, cellIdx) {
    var count = 0;
    for (var i = cellIdx.i - 1; i <= cellIdx.i + 1; i++) {
        for (var j = cellIdx.j - 1; j <= cellIdx.j + 1; j++) {
            // if the checked cell is a bomb.
            if (board[cellIdx.i][cellIdx.j].isMine) return -1;
            // if the idx of checking is the checked cell idx.
            if (cellIdx.i === i && cellIdx.j === j) continue;
            // idx is out of range.
            if (i < 0 || j < 0 || i > board.length - 1 || j > board.length - 1) {
                continue;
            }
            if (board[i][j].isMine) count++;

        }
    }
    return count;
}

// set up number of mines negs for each cell in gBoard.
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cellIdx = { i: i, j: j };
            board[i][j].minesAroundCount = checkMinesNegsCount(board, cellIdx);
        }
    }
}

function createMines(firstClickIdx) {
    for (var i = 0; i < gLevel.MINES; i++) {
        // random location.
        var rowIdx = getRandomIntInclusive(0, gBoard.length - 1);
        var colIdx = getRandomIntInclusive(0, gBoard.length - 1);
        var currCell = gBoard[rowIdx][colIdx];
        // checks if its the first click Idx OR its a mine.
        (currCell.isMine || firstClickIdx.i === rowIdx
            && firstClickIdx.j === colIdx) ? --i : currCell.isMine = true;
        // inserting idx of mines.
        gMines.push({ i: rowIdx, j: colIdx });
    }
}

// if user clicked on cell without mines around him show around.
function clickedNoMines(board, cellIdx) {
    board[cellIdx.i][cellIdx.j].isShown = true;
    removeCellCover(cellIdx);
    gGame.shownCount++;
    for (var i = cellIdx.i - 1; i <= cellIdx.i + 1; i++) {
        for (var j = cellIdx.j - 1; j <= cellIdx.j + 1; j++) {
            // if the checked cell is a bomb.
            if (board[cellIdx.i][cellIdx.j].isMine) return;
            // idx is out of range.
            if (i < 0 || j < 0 || i > board.length - 1 || j > board.length - 1) {
                continue;
            }
            // if the idx of checking is the checked cell idx.
            if (cellIdx.i === i && cellIdx.j === j) continue;
            // if the current cell is also 0 mines around.(recursive loop).
            if (board[i][j].minesAroundCount === 0 && !board[i][j].isShown) {
                clickedNoMines(board, { i: i, j: j })
            }
            if (!board[i][j].isShown) {
                gGame.shownCount++;
                // update MODEL:
                board[i][j].isShown = true;
                // update DOM:
                var location = { i: i, j: j };
                removeFlag(location);
                removeCellCover(location);
                showCellVal(location);
            }
        }
    }
}

// show all mines.
function showAllBombs() {
    for (var i = 0; i < gMines.length; i++) {
        // update MODEL:
        var currMineIdx = gMines[i];
        gBoard[currMineIdx.i][currMineIdx.j].isShown = true;
        // update DOM:
        removeFlag(currMineIdx);
        removeCellCover(currMineIdx);
        showCellVal(currMineIdx);
    }
}

// changing hearts when losing HP.
function losingHP() {
    var elHP = document.querySelector('h2');
    var hpTxt = elHP.innerHTML;

    switch (true) {
        case (hpTxt === '❤️❤️❤️'):
            elHP.innerHTML = '❤️❤️';
            break;
        case (hpTxt === '❤️❤️'):
            elHP.innerHTML = '❤️';
            break;
        case (hpTxt === '❤️'):
            elHP.innerHTML = '💀💀💀';
            break;
    }
}

function resetHP() {
    var elHP = document.querySelector('h2');
    elHP.innerHTML = '❤️❤️❤️';
}