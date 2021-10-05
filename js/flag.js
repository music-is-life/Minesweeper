// disable menu when right click with the mouse.
// dissRightClickMenu();

function markCell(evAndLocation){
    // case game is over.
    if(!gGame.isOn) return;
    // waiting for first click on cells.
    if(isFirstClick) return;

    // making sure its right click event.
    if(evAndLocation.event.which === 3){
        var location = evAndLocation.location;
        var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
        currCell = gBoard[location.i][location.j];

        // if cell already pressed.
        if(currCell.isShown) return;
        // case its already flaged.
        if(currCell.isMarked){
            currCell.isMarked = false;
            // update DOM, flag on cell:
            elCell.classList.remove('cell-flag');
            elCell.classList.add('cell-cover');
            gGame.markedCount--;
        }
        // not flagged yet.
        else{
            // update MODEL cell is marked:
            currCell.isMarked = true;
            // update DOM, flag on cell:
            elCell.classList.remove('cell-cover');
            elCell.classList.add('cell-flag');
            gGame.markedCount++;
            isVictory();
        }
    }
}
// removes the flag background image.
function removeFlag(location){
    if(!gBoard[location.i][location.j].isMarked) return;
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.classList.remove('cell-flag');
    gGame.markedCount--;    
}

function dissRightClickMenu(){
    document.addEventListener("contextmenu", function(e){
        e.preventDefault();
    }, false);
}

// switching emoji face to normal.
function switchEmoji(){
    var elEmojiButton = document.querySelector('.face-button');
    elEmojiButton.innerHTML = '😎';
}

