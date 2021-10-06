'use strict';

var gIsClueOn = false;
var gClueCount = 3;
var gSafeClickCount = 3;
// for undo click
var gTempBoardHTML;
var gTempBoard;
var gTempGgame;
var gTempLife;
var gTemp


function clickedClue(elButton) {
    // clues ran out.
    if (gClueCount <= 0) return;
    // case clue cell already pressed.
    if (elButton.style.backgroundColor === 'grey') return;
    elButton.style.backgroundColor = 'grey';

    gClueCount--;
    gIsClueOn = true;
}

function showNegs(location) {
    console.log('inside showNegs')
    var negsShowed = [];
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            // idx is out of range.
            if (i < 0 || j < 0 || i > gBoard.length - 1 || j > gBoard.length - 1) {
                continue;
            }
            var cellIdx = { i: i, j: j };
            if (!gBoard[i][j].isShown) {
                removeFlag(cellIdx);
                removeCellCover(cellIdx);
                showCellVal(cellIdx);
                negsShowed.push(cellIdx);
            }

        }
    }
    console.log('exit showNegs')
    gIsClueOn = false;

    // time out cells that i showed again.
    setTimeout(function () {
        for (var i = 0; i < negsShowed.length; i++) {
            hideCellVal(negsShowed[i]);
            addCellCover(negsShowed[i]);
        }
    }, 1000);
}



function coverNegs(negsShowed) {
    for (var i = 0; i < negsShowed.length; i++) {
        console.log('i', i, 'negsShowd[i]', negsShowed[i])
        hideCellVal(negsShowed[i]);
        addCellCover(negsShowed[i]);
    }
}

function resetClue() {
    gIsClueOn = false;
    gClueCount = 3;
    var elClueButtons = document.querySelectorAll('.clue-button');
    for (var i = 0; i < elClueButtons.length; i++) {
        elClueButtons[i].style.backgroundColor = 'yellow';
    }
}

// seconds bonus (highest score):

function updateBestScore() {
    var elBestScore = document.querySelector('h3');
    if (gLevel.SIZE === 4) {
        if (+localStorage.easyLevel > +gGame.secsPassed || !localStorage.easyLevel) {
            localStorage.easyLevel = gGame.secsPassed;
            elBestScore.innerHTML = `New Score: ${localStorage.easyLevel} S`;
        }
    }
    else if (gLevel.SIZE === 8) {
        if (+localStorage.mediumLevel > +gGame.secsPassed || !localStorage.mediumLevel) {
            localStorage.mediumLevel = gGame.secsPassed;
            elBestScore.innerHTML = `New Score: ${localStorage.mediumLevel} S`;
        }
    }
    else if (gLevel.SIZE === 12) {
        if (+localStorage.hardLevel > +gGame.secsPassed || !localStorage.hardLevel) {
            localStorage.hardLevel = gGame.secsPassed;
            elBestScore.innerHTML = `New Score: ${localStorage.hardLevel} S`;
        }
    }

}


function setBestScore() {
    var elBestScore = document.querySelector('h3');
    if (gLevel.SIZE === 4)
        elBestScore.innerHTML = `Best Score: ${localStorage.easyLevel} S`;
    else if (gLevel.SIZE === 8)
        elBestScore.innerHTML = `Best Score: ${localStorage.mediumLevel} S`;

    else if (gLevel.SIZE === 12)
        elBestScore.innerHTML = `Best Score: ${localStorage.hardLevel} S`;
}


// Safe press bonus.

function safeClick(elSafeClickButton) {
    // still no first click in the game.
    if (isFirstClick) return;
    // already used 3 clicks.
    if (gSafeClickCount <= 0) return;
    // case no empty locations left.
    var emptyCellLocation = ranEmptyCell(gBoard);
    if (!emptyCellLocation) return; 
    if(gSafeClickCount === 1){
        elSafeClickButton.style.backgroundColor = 'grey';
    }
    gSafeClickCount--;
    // showing cell.
    removeFlag(emptyCellLocation);
    removeCellCover(emptyCellLocation);
    showCellVal(emptyCellLocation);
    // after timeout covering cell.
    setTimeout(function () {
        hideCellVal(emptyCellLocation);
        addCellCover(emptyCellLocation);
    }, 2000);
}

function resetSafeClick(){
    gSafeClickCount = 3;
    var elButton = document.querySelector('.safe-click-button');
    elButton.style.backgroundColor = 'rgb(77, 180, 240)';
}

// undo Button bonus.

function undoClicked(){
    if(!gGame.isOn) return;
    
    // setting back health points.
    if(gGame.lifeLeft<gTempLife){
        gGame.lifeLeft = gTempLife;
        addingHP();
    }

    gGame = JSON.parse(JSON.stringify(gTempGgame));

    gBoard = JSON.parse(JSON.stringify(gTempBoard));
    var elTable = document.querySelector('table');
    elTable.innerHTML = gTempBoardHTML;
}
function storeTempGameVals(){
    var elTable = document.querySelector('table');

    gTempGgame = JSON.parse(JSON.stringify(gGame));
    gTempLife = gGame.lifeLeft;

    // storing the model board in temp.
    gTempBoard = JSON.parse(JSON.stringify(gBoard));
    // storing table dom in temp.
    gTempBoardHTML = elTable.innerHTML;
}

