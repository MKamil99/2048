var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var scoreLabel = document.getElementById('score');
var score = 0;
var size =  document.getElementById('size').textContent;
var width = (canvas.width / size);
var cells = [];
var fontSize;
canvas.height = canvas.width;
startGame();


  
  function createCell(row, coll) {
    this.value = 0;
    this.x = coll * (width ) +1+ coll;
    this.y = row * (width ) +1+row;
  }
  
  function createCells() {
    var i, j;
    for(i = 0; i < size; i++) {
      cells[i] = [];
      for(j = 0; j < size; j++) {
        cells[i][j] = new createCell(i, j);
      }
    }
  }

  function drawCell(cell) {
    context.beginPath();
    context.rect(cell.x, cell.y, width, width);
    switch (cell.value){
      case 0 : context.fillStyle = '#A9A9A9'; break;
      case 2 : context.fillStyle = '#D2691E'; break;
      case 4 : context.fillStyle = '#FF7F50'; break;
      case 8 : context.fillStyle = '#ffbf00'; break;
      case 16 : context.fillStyle = '#bfff00'; break;
      case 32 : context.fillStyle = '#40ff00'; break;
      case 64 : context.fillStyle = '#00bfff'; break;
      case 128 : context.fillStyle = '#FF7F50'; break;
      case 256 : context.fillStyle = '#0040ff'; break;
      case 512 : context.fillStyle = '#ff0080'; break;
      case 1024 : context.fillStyle = '#D2691E'; break;
      case 2048 : context.fillStyle = '#FF7F50'; break;
      case 4096 : context.fillStyle = '#ffbf00'; break;
      default : context.fillStyle = '#ff0080';
    }
    context.fill();
    fontSize = width / 2;
    context.font = fontSize + 'px Arial';
    context.textAlign = 'center';
    context.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
    
  }
  function drawAllCells() {
    var i, j;
    for(i = 0; i < size; i++) {
      for(j = 0; j < size; j++) {
        drawCell(cells[i][j]);
      }
    }
  }
  function canvasClean() {
    context.clearRect(0, 0, canvas.height, canvas.height);
  }
  function startGame() {
    canvasClean()
    width = (canvas.width / size);
    cells = []
    createCells();
    drawAllCells();}

  function lessCells(){
      if(parseInt(document.getElementById('size').textContent) > 4){
      document.getElementById('size').textContent =  parseInt(document.getElementById('size').textContent) - 1
      size = parseInt(document.getElementById('size').textContent)
      startGame();}
      
  }
  function moreCells(){
    if(parseInt(document.getElementById('size').textContent) < 7){
    document.getElementById('size').textContent =  parseInt(document.getElementById('size').textContent) + 1
      size = parseInt(document.getElementById('size').textContent)
      startGame();}
}