let trail = [];
let r, g, b;
let lastColorChangeFrame = 0;
const colorChangeInterval = 120; // 2 seconds at 60 FPS

function setup() {
  createCanvas(800, 800);
  background(0);
  noFill();
  frameRate(60);
  setRandomColor();
}

function draw() {
  background(20); // Semi-transparent background for fading

  // Change color every 2 seconds
  if (frameCount - lastColorChangeFrame >= colorChangeInterval) {
    setRandomColor();
    lastColorChangeFrame = frameCount;
  }

  // Add current mouse position with noise offset
  let offsetX = map(noise(frameCount * 0.05), 0, 1, -10, 10);
  let offsetY = map(noise((frameCount + 1000) * 0.05), 0, 1, -10, 10);

  trail.push({
    x: mouseX + offsetX,
    y: mouseY + offsetY,
    alpha: 255
  });

  // Limit trail length
  if (trail.length > 60) {
    trail.shift();
  }

  // Draw fading trail using current RGB color
  strokeWeight(2);
  for (let i = 0; i < trail.length - 1; i++) {
    let t1 = trail[i];
    let t2 = trail[i + 1];

    stroke(r, g, b, t1.alpha);
    line(t1.x, t1.y, t2.x, t2.y);

    // Fade out
    t1.alpha = max(0, t1.alpha - 3);
  }

  // Optional: glow at the head of the trail
  let head = trail[trail.length - 1];
  if (head) {
    noStroke();
    fill(r, g, b, 80);
    ellipse(head.x, head.y, 16);
  }
}

// Set random RGB color
function setRandomColor() {
  r = random(20, 255);
  g = random(20, 255);
  b = random(20, 255);
}
