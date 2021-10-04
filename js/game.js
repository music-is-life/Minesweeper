'use strict';

var gBoard;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
var gLevel = {
    SIZE:4,
    MINES: 2
};
var isFirstClick = true;

// init of the game.
function gameInit(){
    gGame.isOn = true;
    gBoard = createBoard(gLevel.SIZE);
    console.table(gBoard);
    renderBoard(gBoard);
}

// init cells valus.
function initCellsValues(location){
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

function renderBoard(board){
    var strHTML = '';
    for(var i=0; i<board.length; i++){
        strHTML += '<tr>'
        for(var j=0; j<board.length; j++){
            var cellVal = (gBoard[i][j].isMine)? MINE: gBoard[i][j].minesAroundCount;
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


function cellClicked(location){
    if(!gGame.isOn) return;
    // only in the first time FirstClick will be true.
    if(isFirstClick) {
        initCellsValues(location);
        isFirstClick = false;
    }
    
    var mineCount = gBoard[location.i][location.j].minesAroundCount;
    switch(true){
        // first case: pressed a number.
        case (mineCount>0):
            // update MODEL:
            gBoard[location.i][location.j].isShown=true;
            // update DOM:
            removeCellCover(location);
            showCellVal(location);
            break;
            
        // second case: pressed empty cell.
        case (mineCount === 0):
            clickedNoMines(gBoard,location);
            break;
        // third case: pressed bomb.
        case (mineCount === -1):
            // show all bombs.
            showAllBombs();
            // end game.
            gameOver();
            break;
        }
}
            
            
function gameOver(){
    // stops clicking on cells from reacting.
    gGame.isOn = false;
                
}