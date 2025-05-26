var img;
var pxCol;

function preload() {
  img = loadImage("White Cliffs.jpg");
}

function setup() {
  createCanvas(400, 400);
  background(100);

  noStroke();
}

function draw() {
  if (mouseIsPressed) {
    // display the loaded image at 0, 0
    image(img, 0, 0, 400, 400);
    img.resize(400, 400);
  } else {
    // display the loaded image at 0, 0
    image(img, 0, 0, 400, 400);
    img.resize(400, 400);
    
    //Pixelation Loop
      for( var recY = 0; recY < 401; recY += 10) {
        for (var recX = 0; recX < 401; recX += 10) {
          pxCol = img.get(recX, recY);
          fill(pxCol);
          rect(recX, recY, 10, 10);
        }  
      }
  // noprotect
  }
}
