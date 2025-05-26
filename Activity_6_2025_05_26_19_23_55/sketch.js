let fonts = [];
let quote = "Today be so fine";
let bounceWord = "What can go wrong...";
let angle = 0;
let bounceY = 500;
let bounceSpeed = 2;
let bounceDir = 1;
let wordX, wordY;
let wordColor;

function preload() {
  fonts.push(loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf'));
  fonts.push(loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf'));
}

function setup() {
  createCanvas(1000, 1000);
  textAlign(CENTER, CENTER);
  wordX = width / 2;
  wordY = bounceY;
  wordColor = color(240, 50, 80);
}

function draw() {
  drawWavyBackground();

  // Spinning quote in the center
  push();
  translate(width / 2, height / 2);
  rotate(radians(angle));
  fill(255);
  textSize(28);
  textFont(fonts[1]);
  text(quote, 0, 0);
  pop();
  
  angle += 0.2;

  // Bouncing word
  fill(wordColor);
  textSize(64);
  textFont(fonts[0]);
  text(bounceWord, wordX, wordY);

  // Animate bouncing
  bounceY += bounceSpeed * bounceDir;
  if (bounceY > 700 || bounceY < 300) bounceDir *= -1;
  wordY = bounceY;
}

function drawWavyBackground() {
  background(25);
  noStroke();
  fill(45, 65, 85, 55);

  let yoff = 0;
  for (let y = 0; y < height; y += 20) {
    let xoff = 0;
    beginShape();
    for (let x = 0; x <= width; x += 20) {
      let noiseVal = noise(xoff, yoff, frameCount * 0.01);
      let wave = map(noiseVal, 0, 1, -20, 20);
      vertex(x, y + wave);
      xoff += 0.1;
    }
    endShape();
    yoff += 0.1;
  }
}

function mousePressed() {
  let d = dist(mouseX, mouseY, wordX, wordY);
  if (d < 150) {
    wordX = random(200, 800);
    wordY = random(300, 700);
    wordColor = color(random(255), random(255), random(255));
  }
}
