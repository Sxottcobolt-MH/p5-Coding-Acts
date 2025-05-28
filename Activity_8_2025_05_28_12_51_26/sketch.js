// Declare global variables
let sound;               // The audio track
let fft;                 // For waveform analysis
let amp;                 // For amplitude (volume) analysis
let lightningBolts = []; // Array to store lightning bolt objects

function preload() {
  // Load the sound file before setup
  sound = loadSound('Rey Dau.mp3');
}

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 255); // Use HSB for colorful lightning

  fft = new p5.FFT();       // Initialize FFT for waveform
  amp = new p5.Amplitude(); // Initialize amplitude detection

  sound.loop();             // Start the sond in a loop
}

function draw() {
  // Get current volume level (range ~0.0 to 1.0)
  let vol = amp.getLevel();

  // Use volume to pulse background brightness
  let pulse = map(vol, 0, 0.3, 0, 80);
  background(20 + pulse, 50); // Slightly pulsing dark background

  // Higher volume = higher chance of lightning
  let boltChance = map(vol, 0, 0.3, 0.001, 0.2);
  if (random(1) < boltChance) {
    lightningBolts.push(generateLightningBolt()); // Add new bolt
  }

  // Draw lightning with additive blend for glow effect
  blendMode(ADD);
  for (let i = lightningBolts.length - 1; i >= 0; i--) {
    drawLightningBolt(lightningBolts[i]);
    lightningBolts[i].life--;
    if (lightningBolts[i].life <= 0) {
      lightningBolts.splice(i, 1); // Remove faded bolts
    }
  }

  // Draw a pulsing circle in the center based on volume
  let radius = map(vol, 0, 0.3, 20, 200);
  noStroke();
  fill(200, 100);
  ellipse(width / 2, height / 2, radius);

  // Draw waveform across screen
  let waveform = fft.waveform();
  strokeWeight(1.5);
  stroke(200, 100, 100);
  noFill();
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = height / 2 + map(waveform[i], -1, 1, -150, 150);
    vertex(x, y);
  }
  endShape();

  blendMode(BLEND); // Reset blend mode
}

// Toggle audio on mouse click
function mouseClicked() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

// Create a new lightning bolt with randomized path
function generateLightningBolt() {
  let bolt = {
    points: [],
    life: int(random(5, 10)),       // Duration the bolt will be visible
    hue: random(360)                // Random color hue
  };

  // Start near the top with a slight random offset
  let x = random(width);
  let y = 0;
  bolt.points.push(createVector(x, y));

  // Add random segments to simulate jagged lightning
  for (let i = 0; i < 10; i++) {
    x += random(-20, 20);
    y += random(20, 40);
    bolt.points.push(createVector(x, y));
    if (y > height) break;
  }

  return bolt;
}

// Draw a lightning bolt with layered strokes for glow
function drawLightningBolt(bolt) {
  for (let i = 3; i >= 1; i--) {
    stroke(bolt.hue, 80, 100, 60 / i); // Fainter on outer layers
    strokeWeight(i * 2);               // Thicker outer strokes
    noFill();
    beginShape();
    for (let pt of bolt.points) {
      vertex(pt.x, pt.y);
    }
    endShape();
  }
}
