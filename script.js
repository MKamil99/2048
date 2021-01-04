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

// Game attributes:
var cells = [];
var nick = "[Nieznany]";
var gameOver = false;
var points = 0;
startGame();



// Main function:
function startGame() 
{
    canvasClean();
    sideLength = (canvas.width / size);
    cells = [];

    createCells();
    drawAllCells();

    pasteNewCell();
    pasteNewCell();
}

function finishGame()
{
    // game over sign or something here?


    buildAndSendJSON();
}



//ODPOWIEDZIALNE ZA RYSOWANIE PLANSZY: 
function createCell(row, coll) {
    this.value = 0;
    this.x = coll * (sideLength) + 1 + coll;
    this.y = row * (sideLength) + 1 + row;
}

function createCells() {
    var i, j;
    for (i = 0; i < size; i++) {
        cells[i] = [];
        for (j = 0; j < size; j++) {
            cells[i][j] = new createCell(i, j);
        }
    }
}

function drawCell(cell) {
    context.beginPath();
    context.rect(cell.x, cell.y, sideLength, sideLength);
    switch (cell.value) {
        case 0:
            context.fillStyle = '#A9A9A9';
            break;
        case 2:
            context.fillStyle = '#FFD97D';
            break;
        case 4:
            context.fillStyle = '#FFB812';
            break;
        case 8:
            context.fillStyle = '#EA662A';
            break;
        case 16:
            context.fillStyle = '#EA362A';
            break;
        case 32:
            context.fillStyle = '#B31C12';
            break;
        case 64:
            context.fillStyle = '#74120C';
            break;
        case 128:
            context.fillStyle = '#57181B';
            break;
        case 256:
            context.fillStyle = '#391012';
            break;
        case 512:
            context.fillStyle = '#280B0D';
            break;
        case 1024:
            context.fillStyle = '#0B0303';
            break;
        case 2048:
            context.fillStyle = '#0B0303';
            break;
        default:
            context.fillStyle = '#A9A9A9';
    }
    context.fill();
    if (cell.value) {
        fontSize = sideLength / 2;
        context.font = fontSize + 'px Arial';
        context.fillStyle = 'white';
        if (cell.value == 2048) {
            context.fillStyle = 'gold';
        }
        context.textAlign = 'center';
        context.fillText(cell.value, cell.x + sideLength / 2, cell.y + sideLength / 2 + sideLength / 7);
    }
}

function drawAllCells() {
    var i, j;
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            drawCell(cells[i][j]);
        }
    }
}
//CZYSZCZENIE PLANSZY (do sprawdzenia przy size=7)
function canvasClean() {
    context.clearRect(0, 0, canvas.height, canvas.height);
}
//KONIEC KODU ODPOWIEDZIALNEGO ZA RYSOWANIE PLANSZY

//OBSŁUGA PRZECIĄGNIĘĆ PALCEM: 
//https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
var xDown = null;
var yDown = null;

function getTouches(evt) {
    return evt.touches ||
        evt.originalEvent.touches;
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }
    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            swipeLeft();
        } else {
            swipeRight();
        }
    } else {
        if (yDiff > 0) {
            swipeUp()
        } else {
            swipeDown();
        }
    }
    xDown = null;
    yDown = null;
    score.innerHTML = "WYNIK: " + points;
};
//KONIEC KODU ODPOWIEDZIALNEGO ZA OBSŁUGĘ PRZECIĄGNIĘĆ PALCEM

//PRZESUWANIE KAFELKÓW ??? (do uproszczenia?)
function swipeRight() {
    var i, j;
    var coll;
    for (i = 0; i < size; i++) {
        for (j = size - 2; j >= 0; j--) {
            if (cells[i][j].value) {
                coll = j;
                while (coll + 1 < size) {
                    if (!cells[i][coll + 1].value) {
                        cells[i][coll + 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll++;
                    } else if (cells[i][coll].value == cells[i][coll + 1].value) {
                        cells[i][coll + 1].value *= 2;
                        points += cells[i][coll + 1].value;
                        cells[i][coll].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function swipeLeft() {
    var i, j;
    var coll;
    for (i = 0; i < size; i++) {
        for (j = 1; j < size; j++) {
            if (cells[i][j].value) {
                coll = j;
                while (coll - 1 >= 0) {
                    if (!cells[i][coll - 1].value) {
                        cells[i][coll - 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll--;
                    } else if (cells[i][coll].value == cells[i][coll - 1].value) {
                        cells[i][coll - 1].value *= 2;
                        points += cells[i][coll - 1].value;
                        cells[i][coll].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function swipeUp() {
    var i, j, row;
    for (j = 0; j < size; j++) {
        for (i = 1; i < size; i++) {
            if (cells[i][j].value) {
                row = i;
                while (row > 0) {
                    if (!cells[row - 1][j].value) {
                        cells[row - 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row--;
                    } else if (cells[row][j].value == cells[row - 1][j].value) {
                        cells[row - 1][j].value *= 2;
                        points += cells[row - 1][j].value;
                        cells[row][j].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function swipeDown() {
    var i, j, row;
    for (j = 0; j < size; j++) {
        for (i = size - 2; i >= 0; i--) {
            if (cells[i][j].value) {
                row = i;
                while (row + 1 < size) {
                    if (!cells[row + 1][j].value) {
                        cells[row + 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row++;
                    } else if (cells[row][j].value == cells[row + 1][j].value) {
                        cells[row + 1][j].value *= 2;
                        points += cells[row + 1][j].value;
                        cells[row][j].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}
//KONIEC KODU DO PRZESUWANIA KAFELKÓW

//DODAWANIE NOWYCH, LOSOWYCH KAFELKÓW ???
function pasteNewCell() {
    var countFree = 0;
    var i, j;
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            if (!cells[i][j].value) {
                countFree++;
            }
        }
    }
    if (!countFree) {
        finishGame();
        return;
    }
    while (true) {
        var row = Math.floor(Math.random() * size);
        var coll = Math.floor(Math.random() * size);
        if (!cells[row][coll].value) {
            cells[row][coll].value = 2 * Math.ceil(Math.random() * 2);
            drawAllCells();
            return;
        }
    }
}
//KONIEC LOSOWANIA NOWYCH KAFELKÓW

// Reaction for buttons: changing size of the board:
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
    if (size < 7) 
    {
        document.getElementById('size-value').textContent = size + 1;
        size = parseInt(document.getElementById('size-value').textContent);
        startGame();
    }
}


// Go from SETUP/SETTINGS to PLAY MODE and set player's nick:
function setNick()
{
    let input = document.getElementById("nick-value");
    //if (input.value == null || input.value == "") return; // uncomment if player can't be no-named...
    
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
            const responseObject = this.responseText;
            // responseObject is a number; 
            // if it is greater than 11, it means that you are out of the ranking.
            // Later it should display something like "Good job! You're at {responseObject}. 
            // place in ranking!" or nothing if it is greater than 11
        }
    }; 
    xhr.send(JSON.stringify(data));
}