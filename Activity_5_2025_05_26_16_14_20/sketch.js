function setup() {
  createCanvas(500, 500);
  colorMode(RGB, 100, 100, 100); // The color mode
  noStroke();
  frameRate(10);  // Slows down for a flickering pattern
}

function draw() {
  background(0);

  let gridSize = 10;
  for (let i = 0; i < width / gridSize; i++) {
    for (let j = 0; j < height / gridSize; j++) {
      if (random() < 0.1) continue; // 10% chance to skip cell

      let r = random(20, 255);
      let g = random(20, 255);
      let b = random(20, 255);

      fill(r, g, b);

      let x = i * gridSize + random(-1, 1);
      let y = j * gridSize + random(-1, 1);
      rect(x, y, gridSize - 1, gridSize - 1);
    }
  }
}
