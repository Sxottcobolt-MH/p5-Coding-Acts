function setup() {
  createCanvas(500, 500);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  frameRate(10); // slow down the update for a flickering pattern
}

function draw() {
  background(0);

  let gridSize = 10;
  for (let i = 0; i < width / gridSize; i++) {
    for (let j = 0; j < height / gridSize; j++) {
      if (random() < 0.1) continue; // 10% chance to skip cell

      let h = random(360);
      let s = random(80, 100);
      let b = random(60, 100);

      fill(h, s, b);

      let x = i * gridSize + random(-1, 1);
      let y = j * gridSize + random(-1, 1);
      rect(x, y, gridSize - 1, gridSize - 1);
    }
  }
}
