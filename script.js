// References to HTML elements:
var canvas = document.getElementById('canvas');
var score = document.getElementById('score-value');
var sizeValue = document.getElementById('size-value');
var context = canvas.getContext('2d');
canvas.height = canvas.width;

// Setting onclick attributes to HTML elements:
document.getElementById("setupPlusButton").setAttribute("onclick",  "javascript: moreCells()");
document.getElementById("setupMinusButton").setAttribute("onclick", "javascript: lessCells()");
document.getElementById("setupSaveButton").setAttribute("onclick",  "javascript: setNick()");
document.getElementById("settingsButton").setAttribute("onclick",   "javascript: returnToSettings()");
document.getElementById("surrenderButton").setAttribute("onclick",  "javascript: finishGame()");
document.getElementById("retryButton").setAttribute("onclick",      "javascript: playAgain()");

// Listening keypress by nick-input - hiding keyboard:
document.getElementById("nick-value").addEventListener("keypress", 
    function(e) { if (e.which == 13) { e.preventDefault(); document.activeElement.blur(); } });

// Reading data from cookie:
let username = "";
let cookieElements = document.cookie.split(';');
for (i = 0; i < cookieElements.length; i++) {
    if (cookieElements[i].includes("username")) {
        username = cookieElements[i].split("=")[1];
        break;
    }
}

// Setting username:
const defaultNick = "Nieznany";
var nick = defaultNick;
if (username.length !== 0) nick = username;

// Animation: 
var animFramesLeft = 0;
const animFramesTotal = 5;

// Game attributes:
var size = parseInt(sizeValue.textContent);
var sideLength = (canvas.width / size);      // size of one square (incl. padding)
var oneSquarePadding = 1;
var fontSize = null;
var cells = [];
var oldBoard = [];
var animation = [];
var points = 0;
var gameover = false;
startGame();


// New Game:
function startGame() {
    // Resetting attributes:
    canvasClean();
    resetScore();
    gameover = false;	
    sideLength = (canvas.width / size);
    cells = [];
    createCells();
    oldBoard = copyBoard();

    // Two tiles at the beginning:
    pasteNewCell();
    pasteNewCell();
}

// Finish Game:
function finishGame() {
    document.getElementById("play").style.filter = "blur(0.5em)";
    document.getElementById("gameover").style.display = "flex";
    gameover = true;
    buildAndSendJSON();
}

// Play Again:
function playAgain() {
    document.getElementById("play").style.filter = "none";
    document.getElementById("gameover").style.display = "none";
    startGame();
}

// Resetting score:
function resetScore() {
	points = 0;
	document.getElementById('score-value').innerHTML = "WYNIK: " + points;
}

// Clearing board:
function canvasClean() { context.clearRect(0, 0, canvas.height, canvas.height); }

// Building board:
function createCells() {
    for (let i = 0; i < size; i++) {
        cells[i] = [];
        for (let j = 0; j < size; j++) 
            cells[i][j] = {"value": 0, "x": j * sideLength, "y": i * sideLength};
    }
}


// Drawing and animating 
// (based on https://github.com/mendelsimon/Coding-Train/blob/master/2048/board.js):
function drawAllCells() {
    if (animFramesLeft > 0) {
        setTimeout(function() {
            // Background:
            context.beginPath();
            context.rect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "#110D0D";
            context.fill();

            // Old tiles:
            for (let i = 0; i < size; i++)
                for (let j = 0; j < size; j++)
                    drawCell(oldBoard[i][j]);

            // Animating tiles:
            for (let [tileValue, oldCol, newCol, oldRow, newRow] of animation) {
                let newX, newY;
                if (newCol <= oldCol) // left
                    newX = newCol + ((oldCol - newCol) / animFramesTotal * animFramesLeft);
                else                  // right
                    newX = newCol - ((newCol - oldCol) / animFramesTotal * animFramesLeft);
                if (newRow <= newRow) // up
                    newY = newRow + ((oldRow - newRow) / animFramesTotal * animFramesLeft); 
                else                  // down
                    newY = newRow - ((newRow - oldRow) / animFramesTotal * animFramesLeft);
                drawCell({value: 0, x: oldCol, y: oldRow});
                drawCell({value: tileValue, x: newX, y: newY});
            }
    
            // Re-draw:
            animFramesLeft -= 1;
            drawAllCells();
        }, 10);
    } else {
        // Background:
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#110D0D";
        context.fill();

        // Current tiles:
        for (let i = 0; i < size; i++)
            for (let j = 0; j < size; j++)
                drawCell(cells[i][j]);

        // Update oldBoard:
        oldBoard = copyBoard();
    }
}

function drawCell(cell) {
    context.beginPath();
    context.rect(cell.x + oneSquarePadding, cell.y + oneSquarePadding, 
        sideLength - 2 * oneSquarePadding, sideLength - 2 * oneSquarePadding);
    switch (cell.value) {
        case 0:    context.fillStyle = '#A9A9A9'; break;
        case 2:    context.fillStyle = '#DEB887'; break; // BurlyWood   
        case 4:    context.fillStyle = '#EEC743'; break; // (BurlyWood+Gold)/2    
        case 8:    context.fillStyle = '#FFD800'; break; // Gold   
        case 16:   context.fillStyle = '#FFA500'; break; // Orange      
        case 32:   context.fillStyle = '#FF4500'; break; // OrangeRed
        case 64:   context.fillStyle = '#B22222'; break; // FireBrick 
        case 128:  context.fillStyle = '#32CD32'; break; // LimeGreen    
        case 256:  context.fillStyle = '#008000'; break; // Green
        case 512:  context.fillStyle = '#1E90FF'; break; // DodgerBlue
        case 1024: context.fillStyle = '#191970'; break; // MidnightBlue
        default:   context.fillStyle = '#4B0082'; break; // Indigo   
    }
    context.fill();
    if (cell.value) {
        // Font size:
        numberWidth = cell.value.toString().length;
        if (numberWidth <= 3) context.font = (sideLength / 2.5) + 'px Montserrat';
        else context.font = (sideLength / (numberWidth - 1)) + 'px Montserrat';

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

function calculateAnimation(value, constant, oldOne, newOne, direction) {
    let col_1, col_2, row_1, row_2;
    switch (direction) {
        case "left":
            col_1 = oldOne;
            col_2 = newOne;
            row_1 = constant;
            row_2 = constant;
            break;
        case "right":
            col_1 = oldOne;
            col_2 = newOne;
            row_1 = constant;
            row_2 = constant;
            break;
        case "up":
            col_1 = constant;
            col_2 = constant;
            row_1 = oldOne;
            row_2 = newOne;
            break;
        case "down":
            col_1 = constant;
            col_2 = constant;
            row_1 = oldOne;
            row_2 = newOne;
            break;
    }
    let x1 = col_1 * sideLength;
    let x2 = col_2 * sideLength;
    let y1 = row_1 * sideLength;
    let y2 = row_2 * sideLength;
    return [value, x1, x2, y1, y2];
}

// Copying board for better displaying animations:
function copyBoard() {
    let newBoard = [];
    for (let row = 0; row < size; row++) {
        newBoard[row] = [];
        for (let column = 0; column < size; column++)
            newBoard[row][column] = { 
                "value": cells[row][column].value, 
                "x": cells[row][column].x, "y": cells[row][column].y }
    }
    return newBoard;
}


// Touching screen (https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android):
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
var xDown = null;
var yDown = null;

function getTouches(evt) { return evt.touches || evt.originalEvent.touches; }

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (gameover) return;
    if (!xDown || !yDown) return;

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    animation = [];
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
function swipeRight() {
    var i, j, newColumn, moved = false;
    for (i = 0; i < size; i++) {
        var arr = [];
        for (j = size - 1; j >= 0; j--) {
            if (cells[i][j].value != 0) {
                let tileValue = cells[i][j].value;
                newColumn = j;
                while (newColumn + 1 < size) {
                    if (cells[i][newColumn + 1].value == 0) {                                                             // go right
                        cells[i][newColumn + 1].value = cells[i][newColumn].value;
                        cells[i][newColumn].value = 0;
                        newColumn++;
                        moved = true;
                    } else if (cells[i][newColumn].value == cells[i][newColumn + 1].value && !arr.includes(newColumn)) {  // merge
                        cells[i][newColumn + 1].value += cells[i][newColumn].value;
                        points += cells[i][newColumn + 1].value;
                        cells[i][newColumn].value = 0;
                        arr.push(newColumn);
                        newColumn++;
                        moved = true;
                        break;
                    } else break;                                                                                         // do nothing
                }
                animation.push(calculateAnimation(tileValue, i, j, newColumn, "right"));
            }
        }
    }	
    if (moved) {
        animFramesLeft = animFramesTotal;
        pasteNewCell();
    }
}

function swipeLeft() {
    var i, j, newColumn, moved = false;
    for (i = 0; i < size; i++) {
        var arr = [];
        for (j = 0; j < size; j++) {
            if (cells[i][j].value != 0) {
                let tileValue = cells[i][j].value;
                newColumn = j;
                while (newColumn - 1 >= 0) {
                    if (cells[i][newColumn - 1].value == 0) {                                                             // go left
                        cells[i][newColumn - 1].value = cells[i][newColumn].value;
                        cells[i][newColumn].value = 0;
                        newColumn--;
                        moved = true;
                    } else if (cells[i][newColumn].value == cells[i][newColumn - 1].value && !arr.includes(newColumn)) {  // merge
                        cells[i][newColumn - 1].value += cells[i][newColumn].value;
                        points += cells[i][newColumn - 1].value;
                        cells[i][newColumn].value = 0;
                        arr.push(newColumn);
                        newColumn--;
                        moved = true;
                        break;
                    } else break;                                                                                         // do nothing
                }
                animation.push(calculateAnimation(tileValue, i, j, newColumn, "left"));
            }
        }
    } 	
    if (moved) {
        animFramesLeft = animFramesTotal;
        pasteNewCell();
    }
}

function swipeUp() {
    var i, j, newRow, moved = false;
    for (j = 0; j < size; j++) {
        var arr = [];
        for (i = 0; i < size; i++) {
            if (cells[i][j].value != 0) {
                let tileValue = cells[i][j].value;
                newRow = i;
                while (newRow > 0) {
                    if (cells[newRow - 1][j].value == 0) {                                                                // go up
                        cells[newRow - 1][j].value = cells[newRow][j].value;
                        cells[newRow][j].value = 0;
                        newRow--;
                        moved = true;
                    } else if (cells[newRow][j].value == cells[newRow - 1][j].value && !arr.includes(newRow)) {           // merge
                        cells[newRow - 1][j].value += cells[newRow][j].value;
                        points += cells[newRow - 1][j].value;
                        cells[newRow][j].value = 0;
                        arr.push(newRow);
                        newRow--;
                        moved = true; 		
                        break;
                    } else break;                                                                                         // do nothing
                }
                animation.push(calculateAnimation(tileValue, j, i, newRow, "up")); // col, oldRow, newRow
            }
        }
    }
    if (moved) {
        animFramesLeft = animFramesTotal;
        pasteNewCell();
    }
}

function swipeDown() {
    var i, j, newRow, moved = false;
    for (j = 0; j < size; j++) {
        var arr = [];
        for (i = size - 1; i >= 0; i--) {
            if (cells[i][j].value) {
                let tileValue = cells[i][j].value;
                newRow = i;
                while (newRow + 1 < size) {
                    if (!cells[newRow + 1][j].value) {                                                                    // go down
                        cells[newRow + 1][j].value = cells[newRow][j].value;
                        cells[newRow][j].value = 0;
                        newRow++;
                        moved = true;
                    } else if (cells[newRow][j].value === cells[newRow + 1][j].value && !arr.includes(newRow)) {	      // merge
                        cells[newRow + 1][j].value += cells[newRow][j].value;
                        points += cells[newRow + 1][j].value;
                        cells[newRow][j].value = 0;
                        arr.push(newRow);
                        newRow++;
                        moved = true;
                        break;
                    } 
                    else break;                                                                                           // do nothing
                }
                animation.push(calculateAnimation(tileValue, j, i, newRow, "down")); // col, oldRow, newRow
            }
        }
    }
    if (moved) {
        animFramesLeft = animFramesTotal;
        pasteNewCell();
    }
}


// Adding new tiles:
function pasteNewCell() {
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
function isGameOver() {	
	var i, j;
	for(i = 0; i < size; i++)
		for(j = 0; j < size; j++)
            if (i < (size - 1) && cells[i][j].value === cells[i + 1][j].value 
             || j < (size - 1) && cells[i][j].value === cells[i][j + 1].value 
             || cells[i][j].value === 0) return false;
	return true;
}


// Check which place did player get:
function buildAndSendJSON() {
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
            if (responseObject > 10 || typeof responseObject != "string" || responseObject.length > 3) return;
            document.getElementById("result").innerHTML = `Zajmujesz ${parseInt(responseObject)}. miejsce w rankingu!`;
        }
    }; 
    xhr.send(JSON.stringify(data));
}


// Reaction for buttons - changing size of the board:
function lessCells() {
    if (size > 4) {
        document.getElementById('size-value').textContent = size - 1;
        size = parseInt(document.getElementById('size-value').textContent);
        startGame();
    }
}
function moreCells() {
    if (size < 6) {
        document.getElementById('size-value').textContent = size + 1;
        size = parseInt(document.getElementById('size-value').textContent);
        startGame();
    }
}

// Go from SETTINGS to PLAY MODE and set player's nick:
function setNick() {
    let input = document.getElementById("nick-value");
    document.getElementById("setup").style.display = "none";
    document.getElementById("play").style.display = "flex";
    if (input.value !== null && input.value !== "") nick = input.value;

    // Save nickname for further sessions:
    if (nick != defaultNick) document.cookie = `username=${nick}`;
}

// Go from PLAY MODE to SETTINGS if player wants to change nick or board size:
function returnToSettings() {
    // Display remembered nickname (from cookie):
    if (nick != defaultNick) document.getElementById("nick-value").value = nick;

    // Display appropriate screen:
    document.getElementById("setup").style.display = "flex";
    document.getElementById("play").style.display = "none";
}
