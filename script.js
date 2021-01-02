var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var points = 0;
var score = document.getElementById('score');
var size = document.getElementById('size').textContent;
var sideLength = (canvas.width / size);
var cells = [];
var fontSize;
var gameOver = false;
canvas.height = canvas.width;
startGame();

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
            context.fillStyle = '#ea662a';
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
    score.innerHTML = points;
};
//KONIEC KODU ODPOWIEDZIALNEGO ZA OBSŁUGĘ PRZECIĄGNIĘĆ PALCEM

//PRZESUWANIE KAFELKÓW ??? (do uproszczenia?)
function swipeRight() {
    var i, j;
    var coll;
	var moved=false;
    for (i = 0; i < size; i++) {
        for (j = size - 2; j >= 0; j--) {
            if (cells[i][j].value !=0) {
                coll = j;
                while (coll + 1 < size) {
                    if (cells[i][coll + 1].value == 0) {
                        cells[i][coll + 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll++;
						moved=true;
                    } else if (cells[i][coll].value == cells[i][coll + 1].value) {
                        cells[i][coll + 1].value *= 2;
                        points += cells[i][coll + 1].value;
                        cells[i][coll].value = 0;
						moved=true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
	if(moved){
		pasteNewCell();
	}
}

function swipeLeft() {
    var i, j;
    var coll;
	var moved=false;
    for (i = 0; i < size; i++) {
        for (j = 1; j < size; j++) {
            if (cells[i][j].value != 0) {
                coll = j;
                while (coll - 1 >= 0) {
                    if (cells[i][coll - 1].value == 0) {
                        cells[i][coll - 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll--;
						moved=true;
                    } else if (cells[i][coll].value == cells[i][coll - 1].value) {
                        cells[i][coll - 1].value *= 2;
                        points += cells[i][coll - 1].value;
                        cells[i][coll].value = 0;
						moved=true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
	if(moved){
		pasteNewCell();
	}
}

function swipeUp() {
    var i, j, row;
	var moved=false;
    for (j = 0; j < size; j++) {
        for (i = 1; i < size; i++) {
            if (cells[i][j].value != 0) {
                row = i;
                while (row > 0) {
                    if (cells[row - 1][j].value == 0) {
                        cells[row - 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row--;
						moved=true;
                    } else if (cells[row][j].value == cells[row - 1][j].value) {
                        cells[row - 1][j].value *= 2;
                        points += cells[row - 1][j].value;
                        cells[row][j].value = 0;
						moved=true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
	if(moved){
		pasteNewCell();
	}
}

function swipeDown() {
    var i, j, row;
	var moved=false;
    for (j = 0; j < size; j++) {
        for (i = size - 2; i >= 0; i--) {
            if (cells[i][j].value) {
                row = i;
                while (row + 1 < size) {
                    if (!cells[row + 1][j].value) {
                        cells[row + 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row++;
						moved=true;
                    } else if (cells[row][j].value == cells[row + 1][j].value) {
                        cells[row + 1][j].value *= 2;
                        points += cells[row + 1][j].value;
                        cells[row][j].value = 0;
						moved=true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
	if(moved){
		pasteNewCell();
	}
}
//KONIEC KODU DO PRZESUWANIA KAFELKÓW

//DODAWANIE NOWYCH, LOSOWYCH KAFELKÓW ???
function pasteNewCell() {
    var countFree = 0;
    var i, j;
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            if (cells[i][j].value == 0) {
                countFree++;
            }
        }
    }
    if (countFree == 0) {
        finishGame();
        return;
    }
    while (true) {
        var row = Math.floor(Math.random() * size);
        var coll = Math.floor(Math.random() * size);
        if (cells[row][coll].value ==0) {
            cells[row][coll].value = 2 * Math.ceil(Math.random() * 2);
            drawAllCells();
            return;
        }
    }
}
//KONIEC LOSOWANIA NOWYCH KAFELKÓW

//KOD ODPOWIEDZIALNY ZA ZMIANĘ WIELKOŚCI PLANSZY - OBSŁUGA PRZYCISKÓW
function lessCells() {
    if (parseInt(document.getElementById('size').textContent) > 4) {
        document.getElementById('size').textContent = parseInt(document.getElementById('size').textContent) - 1
        size = parseInt(document.getElementById('size').textContent)
        startGame();
    }
}

function moreCells() {
    if (parseInt(document.getElementById('size').textContent) < 7) {
        document.getElementById('size').textContent = parseInt(document.getElementById('size').textContent) + 1
        size = parseInt(document.getElementById('size').textContent)
        startGame();
    }
}
//KONIEC KODU ODPOWIEDZIALNEGO ZA ZMIANĘ WIELKOŚCI PLANSZY - OBSŁUGA PRZYCISKÓW

function startGame() {
    canvasClean()
    sideLength = (canvas.width / size);
    cells = []
    createCells();
    drawAllCells();
    pasteNewCell();
    pasteNewCell();
}

function finishGame() {
  canvas.style.opacity = '0.5';
  gameOver=true;
}