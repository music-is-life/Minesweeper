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
        if(gBoard[location.i][location.j].isShown) return;
        // update MODEL cell is marked:
        gBoard[location.i][location.j].isMarked = true;
        // update DOM, flag on cell:
        console.log('marked')
        var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
        elCell.classList.remove('cell-cover');
        elCell.classList.add('cell-flag');
    }
}
// removes the flag background image.
function removeFlag(location){
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.classList.remove('cell-flag');
}

function dissRightClickMenu(){
    document.addEventListener("contextmenu", function(e){
        e.preventDefault();
    }, false);
}