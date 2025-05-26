function setup() {
  createCanvas(400, 400);
  background(20, 30, 40);
}

function draw() {
  drawAlien(width / 2, height / 2);
  noLoop(); // Only draw once
}

function drawAlien(x, y) {
  // Body
  fill(100, 255, 100);
  ellipse(x, y, 85, 120);
  
  // Head
  ellipse(x, y - 80, 60, 60);
  
  // Eyes
  fill(0);
  ellipse(x - 15, y - 85, 10, 20);
  ellipse(x + 15, y - 85, 10, 20);
  
  // Antennas
  stroke(100, 255, 100);
  strokeWeight(4);
  line(x - 15, y - 110, x - 25, y - 140);
  line(x + 15, y - 110, x + 25, y - 140);
  
  // Antenna tips
  noStroke();
  fill(255, 0, 100);
  ellipse(x - 25, y - 140, 8, 8);
  ellipse(x + 25, y - 140, 8, 8);
  
   // Arms
  stroke(100, 255, 100);
  strokeWeight(6);
  line(x - 40, y - 20, x - 70, y + 10); // Left arm
  line(x + 40, y - 20, x + 70, y + 10); // Right arm

  // Legs
  line(x - 20, y + 60, x - 20, y + 100); // Left leg
  line(x + 20, y + 60, x + 20, y + 100); // Right leg
}
