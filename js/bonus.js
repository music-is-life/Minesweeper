var gIsClueOn = false;
var gClueCount = 3;


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
    elClueButtons = document.querySelectorAll('.clue-button');
    for (var i = 0; i < elClueButtons.length; i++) {
        elClueButtons[i].style.backgroundColor = 'yellow';
    }
}

// seconds bonus (highest score):

function updateBestScore() {
    var elBestScore = document.querySelector('h3');
    if(gLevel.SIZE === 4){
        if (+localStorage.easyLevel > +gGame.secsPassed || !localStorage.easyLevel) {
            localStorage.easyLevel = gGame.secsPassed;
            elBestScore.innerHTML = `New Score: ${localStorage.easyLevel} S`;
        }
    }
    else if(gLevel.SIZE === 8){
        if (+localStorage.mediumLevel > +gGame.secsPassed || !localStorage.mediumLevel) {
            localStorage.mediumLevel = gGame.secsPassed;
            elBestScore.innerHTML = `New Score: ${localStorage.mediumLevel} S`;
        }
    }
    else if(gLevel.SIZE === 12){
        if (+localStorage.hardLevel > +gGame.secsPassed || !localStorage.hardLevel) {
            localStorage.hardLevel = gGame.secsPassed;
            elBestScore.innerHTML = `New Score: ${localStorage.hardLevel} S`;
        }
    }

}


function setBestScore() {
    var elBestScore = document.querySelector('h3');
    if(gLevel.SIZE === 4)
        elBestScore.innerHTML = `Best Score: ${localStorage.easyLevel} S`;
    else if(gLevel.SIZE === 8) 
        elBestScore.innerHTML = `Best Score: ${localStorage.mediumLevel} S`;

    else if(gLevel.SIZE === 12)
        elBestScore.innerHTML = `Best Score: ${localStorage.hardLevel} S`;
}


