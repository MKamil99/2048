//                        2048
//      Limanówka Dominika, Matula Kamil, Różycki Iwo
// Projekt zaliczeniowy z przedmiotu Mobilne Aplikacje Webowe

// References to HTML elements:
var canvas = document.getElementById('canvas');
var score = document.getElementById('score-value');
var sizeValue = document.getElementById('size-value');
var context = canvas.getContext('2d');
var size = parseInt(sizeValue.textContent);
var sideLength = (canvas.width / size);
var fontSize;
canvas.height = canvas.width;

// Setting onclick attributes to HTML elements:
document.getElementById("setupPlusButton").setAttribute("onclick",  "javascript: moreCells()");
document.getElementById("setupMinusButton").setAttribute("onclick", "javascript: lessCells()");
document.getElementById("setupSaveButton").setAttribute("onclick",  "javascript: setNick()");
document.getElementById("settingsButton").setAttribute("onclick",   "javascript: returnToSettings()");
document.getElementById("surrenderButton").setAttribute("onclick",  "javascript: finishGame()");
document.getElementById("retryButton").setAttribute("onclick",      "javascript: playAgain()");

// Game attributes:
var oneSquarePadding = 1;
var cells = [];
var nick = "Nieznany";
var points = 0;
var gameover = false;
var nick;
startGame();




// New Game:
function startGame() 
{
    // Resetting attributes:
    canvasClean();
    resetScore();
    gameover = false;	
    sideLength = (canvas.width / size);
    cells = [];
    createCells();

    // Two tiles at the beginning:
    pasteNewCell();
    pasteNewCell();
}

// Finish Game:
function finishGame()
{
    document.getElementById("play").style.filter = "blur(0.5em)";
    document.getElementById("gameover").style.display = "flex";
    gameover = true;
    buildAndSendJSON();
}

// Play Again:
function playAgain()
{
    document.getElementById("play").style.filter = "none";
    document.getElementById("gameover").style.display = "none";
    startGame();
}

// Resetting score:
function resetScore()
{
	points = 0;
	document.getElementById('score-value').innerHTML = "WYNIK: " + points;
}

// Clearing board:
function canvasClean() { context.clearRect(0, 0, canvas.height, canvas.height); }




// Drawing board: 
function createCells() 
{
    var i, j;
    for (i = 0; i < size; i++) {
        cells[i] = [];
        for (j = 0; j < size; j++) 
            cells[i][j] = {"value": 0, "x": j * sideLength, "y": i * sideLength};
    }
}

function drawCell(cell) 
{
    context.beginPath();
    context.rect(cell.x + oneSquarePadding, cell.y + oneSquarePadding, 
        sideLength - 2 * oneSquarePadding, sideLength - 2 * oneSquarePadding);
    switch (cell.value) {
        case 0:
            context.fillStyle = '#A9A9A9';
            break;
        case 2:
            context.fillStyle = '#DEB887';  //BurlyWood
            break;
        case 4:
            context.fillStyle = '#EEC743';  // (BurlyWood+Gold)/2
            break;
        case 8:
            context.fillStyle = '#FFD800';  //Gold
            break;
        case 16:
            context.fillStyle = '#FFA500';  //Orange
            break;
        case 32:
            context.fillStyle = '#FF4500';  //OrangeRed
            break;
        case 64:
            context.fillStyle = '#B22222';  //FireBrick
            break;
        case 128:
            context.fillStyle = '#32CD32';  //LimeGreen
            break;
        case 256:
            context.fillStyle = '#008000';  //Green
            break;
        case 512:
            context.fillStyle = '#1E90FF';  //DodgerBlue
            break;
        case 1024:
            context.fillStyle = '#191970';  //MidnightBlue
            break;
        default:  // 2048 and more
            context.fillStyle = '#4B0082';  //Indigo
            break;
    }
    context.fill();
    if (cell.value) {
        // Font size:
        numberWidth = cell.value.toString().length;
        if (numberWidth <= 3) context.font = (sideLength / 2.5) + 'px Arial';
        else context.font = (sideLength / (numberWidth - 1)) + 'px Arial';
        // Font color:
        if (cell.value >= 2048) context.fillStyle = 'gold';
        else context.fillStyle = 'white';
        // Centering horizontally and vertically:
        context.textAlign = "center";
        context.textBaseline = "middle";
        // Drawing number in square:
        context.fillText(cell.value, cell.x + sideLength / 2, cell.y + sideLength / 2);
    }
}

function drawAllCells() 
{
    // Background:
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#110D0D";
    context.fill();

    // Tiles:
    var i, j;
    for (i = 0; i < size; i++)
        for (j = 0; j < size; j++)
            drawCell(cells[i][j]);
}




// Touching screen (https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android):
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
var xDown = null;
var yDown = null;

function getTouches(evt) { return evt.touches || evt.originalEvent.touches; }

function handleTouchStart(evt) 
{
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) 
{
    if (gameover) return;
    if (!xDown || !yDown) return;
    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) swipeLeft();
        else swipeRight();
    } else {
        if (yDiff > 0) swipeUp()
        else swipeDown();
    }
    xDown = null;
    yDown = null;
	
    document.getElementById('score-value').innerHTML = "WYNIK: " + points;
}




// Moving tiles:
function swipeRight() 
{
    var i, j, coll, moved = false;
    for (i = 0; i < size; i++) {
        var arr = [];
        for (j = size - 2; j >= 0; j--) {
            if (cells[i][j].value != 0) {
                coll = j;
                while (coll + 1 < size) {
                    if (cells[i][coll + 1].value == 0) {                                                   // go right
                        cells[i][coll + 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll++;
                        moved = true;
                    } else if (cells[i][coll].value == cells[i][coll + 1].value && !arr.includes(coll)) {  // merge
                        cells[i][coll + 1].value += cells[i][coll].value;
                        points += cells[i][coll + 1].value;
                        cells[i][coll].value = 0;
                        arr.push(coll);
                        moved = true;
                        break;
                    } else break;                                                                          // do nothing
                }
            }
        }
    }	
    if (moved) pasteNewCell();
}

function swipeLeft() 
{
    var i, j, coll, moved = false;
    for (i = 0; i < size; i++) {
        var arr = [];
        for (j = 1; j < size; j++) {
            if (cells[i][j].value != 0) {
                coll = j;
                while (coll - 1 >= 0) {
                    if (cells[i][coll - 1].value == 0) {                                                    // go left
                        cells[i][coll - 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll--;
                        moved = true;
                    } else if (cells[i][coll].value == cells[i][coll - 1].value && !arr.includes(coll)) {   // merge
                        cells[i][coll - 1].value += cells[i][coll].value;
                        points += cells[i][coll - 1].value;
                        cells[i][coll].value = 0;
                        arr.push(coll);
                        moved = true;
                        break;
                    } else break;                                                                           // do nothing
                }
            }
        }
    } 	
    if (moved) pasteNewCell();
}

function swipeUp() 
{
    var i, j, row, moved = false;
    for (j = 0; j < size; j++) {
        var arr = [];
        for (i = 1; i < size; i++) {
            if (cells[i][j].value != 0) {
                row = i;
                while (row > 0) {
                    if (cells[row - 1][j].value == 0) {                                                // go up
                        cells[row - 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row--;
                        moved=true;
                    } else if (cells[row][j].value == cells[row - 1][j].value && !arr.includes(row)) { // merge
                        cells[row - 1][j].value += cells[row][j].value;
                        points += cells[row - 1][j].value;
                        cells[row][j].value = 0;
                        arr.push(row);
                        moved = true; 		
                        break;
                    } else break;                                                                      // do nothing
                }
            }
        }
    }
    if (moved) pasteNewCell();
}

function swipeDown() 
{
    var i, j, row, moved = false;
    for (j = 0; j < size; j++) {
        var arr = [];
        for (i = size - 2; i >= 0; i--) {
            if (cells[i][j].value) {
                row = i;
                while (row + 1 < size) {
                    if (!cells[row + 1][j].value) {                                                     // go down
                        cells[row + 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row++;
                        moved = true;
                    } else if (cells[row][j].value === cells[row + 1][j].value && !arr.includes(row)) {	 // merge
                        cells[row + 1][j].value += cells[row][j].value;
                        points += cells[row + 1][j].value;
                        cells[row][j].value = 0;
                        arr.push(row);
                        moved = true;
                        break;
                    } 
                    else break;                                                                          // do nothing
                }
            }
        }
    }
    if (moved) pasteNewCell();
}




// Adding new tiles:
function pasteNewCell() 
{
    while (true) {
        var row = Math.floor(Math.random() * size);
        var coll = Math.floor(Math.random() * size);
		var r = Math.random();
        if (cells[row][coll].value == 0) {
            cells[row][coll].value = r > 0.15 ? 2 : 4;
            drawAllCells();
            break;
        }
    }
    if (isGameOver()) finishGame();
}




// Game conditions:
function isGameOver() 
{	
	var i, j;
	for(i = 0; i < size; i++)
		for(j = 0; j < size; j++)
            if (i < (size - 1) && cells[i][j].value === cells[i + 1][j].value 
             || j < (size - 1) && cells[i][j].value === cells[i][j + 1].value 
             || cells[i][j].value === 0) return false;
	return true;
}




// Check which place did player get:
function buildAndSendJSON()
{
    // Building JSON:
    let data = {};
    data["nick"] = nick;
    data["score"] = points;
    data["size"] = "size" + size;

    // Sending JSON to PHP and receiving info about the place player get:
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "ranking_update.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () { 
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            // responseObject is a number; if it is greater than 10, it means that you are out of the ranking
            const responseObject = this.responseText;
            if (responseObject > 10) return;
            document.getElementById("result").innerHTML = `Zajmujesz ${parseInt(responseObject)}. miejsce w rankingu!`;
        }
    }; 
    xhr.send(JSON.stringify(data));
}




// Reaction for buttons - changing size of the board:
function lessCells() 
{
    if (size > 4) 
    {
        document.getElementById('size-value').textContent = size - 1;
        size = parseInt(document.getElementById('size-value').textContent);
        startGame();
    }
}
function moreCells() 
{
    if (size < 6) 
    {
        document.getElementById('size-value').textContent = size + 1;
        size = parseInt(document.getElementById('size-value').textContent);
        startGame();
    }
}

// Go from SETTINGS to PLAY MODE and set player's nick:
function setNick()
{
    let input = document.getElementById("nick-value");
    document.getElementById("setup").style.display = "none";
    document.getElementById("play").style.display = "flex";
    if (input.value !== null && input.value !== "") nick = input.value;
}

// Go from PLAY MODE to SETTINGS if player wants to change nick or board size:
function returnToSettings()
{
    document.getElementById("setup").style.display = "flex";
    document.getElementById("play").style.display = "none";
}