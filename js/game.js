'use strict';

var gBoard;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lifeLeft: 3
};
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var isFirstClick;

var gTimeIntervalIdx;

// init of the game.
function gameInit() {
    resetValues();
    // switch emoji face to normal.
    switchEmoji();
    gBoard = createBoard(gLevel.SIZE);
    renderBoard(gBoard);
}

function resetValues() {
    // reseting mines array, and it is going to be first click.
    isFirstClick = true;
    gGame.isOn = true;
    gMines = [];
    // reseting flags count.
    gGame.markedCount = 0;
    // restarting health points.
    gGame.lifeLeft = 3;
    resetHP();
    // starts counting seconds, and init clock.
    resetTime();
    // init the shown cells count.
    gGame.shownCount = 0;
    // init clues initCellsValues
    resetClue();
    // set the best score of the current level.
    setBestScore();
}

// init cells valus.
function initCellsValues(location) {
    createMines(location);
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
}

// going to create matrix sizeXsize;
function createBoard(size) {
    var board = [];

    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var cellVal = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount;
            var location = `{i:${i},j:${j}}`;
            var className = ` cell cell${i}-${j} `;
            strHTML += `<td title="{${i}, ${j}}"
            class="${className} cell-cover" 
            onclick="cellClicked(${location})"
            onmousedown="markCell({event:event,location:${location}})">
            <span>
            ${cellVal}
            </span></td>`;
        }
        strHTML += '</tr>'
    }
    var elTable = document.querySelector('table');
    elTable.innerHTML = strHTML;
}


function cellClicked(location) {
    var currCell = gBoard[location.i][location.j];

    if (!gGame.isOn) return;
    // only in the first time FirstClick will be true.
    if (isFirstClick) {
        setTime();
        initCellsValues(location);
        isFirstClick = false;
    }
    // case isClueOn and next click needs to reveal neg cells.
    if (gIsClueOn) {
        showNegs(location);
        // setTimeout(coverNegs, 1000);
        return;
    }
    // if already shown.
    if (currCell.isShown) return;
    // if there is a flag on cell cannot reveal.
    if (currCell.isMarked) return;
    var mineCount = currCell.minesAroundCount;
    switch (true) {
        // first case: pressed a number.
        case (mineCount > 0):
            // update shownCount to check win.
            gGame.shownCount++;
            // update MODEL:
            currCell.isShown = true;
            // update DOM:
            removeCellCover(location);
            showCellVal(location);
            // checking if win.
            isVictory();
            break;

        // second case: pressed empty cell.
        case (mineCount === 0):
            clickedNoMines(gBoard, location);
            // checking if win.
            isVictory();
            break;
        // third case: pressed bomb.
        case (mineCount === -1):
            // one hp down, checking if game over.
            gGame.lifeLeft--;
            losingHP();
            // remove flag from flag count to a possible win.
            gGame.markedCount++;
            removeCellCover(location);
            showCellVal(location);
            //game is own condition
            isVictory();
            // game is over condition.
            if (gGame.lifeLeft <= 0) {
                // show all bombs.
                showAllBombs();
                // end game.
                gameOver();
            }
            break;
    }
}


function setLevel(elButton) {
    var buttonTxt = elButton.innerHTML;
    switch (true) {
        case (buttonTxt === 'Easy'):
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break;
        case (buttonTxt === 'Medium'):
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            break;
        case (buttonTxt === 'Hard'):
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            break;
    }
    gameInit();
}


function gameOver() {
    // stops clicking on cells from reacting.
    gGame.isOn = false;
    // change emoji face.
    var elEmojiButton = document.querySelector('.face-button');
    elEmojiButton.innerHTML = '😭';
    // stops time.
    clearInterval(gTimeIntervalIdx);
}

function isVictory() {
    var minlessCellsCount = gLevel.SIZE * gLevel.SIZE - gLevel.MINES;
    if (gGame.shownCount === minlessCellsCount &&
        gGame.markedCount === gLevel.MINES) victory();
}

function victory() {
    gGame.isOn = false;
    var elEmojiButton = document.querySelector('.face-button');
    elEmojiButton.innerHTML = '🥳';
    showAllBombs();
    // stops time.
    clearInterval(gTimeIntervalIdx);
    updateBestScore();
}

function setTime() {
    var elTimer = document.querySelector('h1');
    elTimer.innerHTML = gGame.secsPassed;
    if (isFirstClick) {
        gTimeIntervalIdx = setInterval(function () {
            gGame.secsPassed++;
            var elTimer = document.querySelector('h1');
            elTimer.innerHTML = gGame.secsPassed;
        }, 1000)
    }
}
function resetTime() {
    var elTimer = document.querySelector('h1');
    gGame.secsPassed = 0;
    elTimer.innerHTML = gGame.secsPassed;
    clearInterval(gTimeIntervalIdx);
}