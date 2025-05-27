let sound;
let fft;
let amp;
let playButton;
let lightningBolts = [];

function preload() {
  sound = loadSound('Rey Dau.mp3');
}

function setup() {
  createCanvas(800, 800);
  fft = new p5.FFT();
  amp = new p5.Amplitude();

  playButton = createButton('Pause');
  playButton.position(10, 10);
  playButton.mousePressed(toggleSound);

  sound.loop();
}

function draw() {
  background(20);

  // Get current volume level (0.0 to ~1.0)
  let vol = amp.getLevel();

  // Generate more bolts when volume is high
  let boltChance = map(vol, 0, 0.3, 0.001, 0.2); // Adjust sensitivity here
  if (random(1) < boltChance) {
    lightningBolts.push(generateLightningBolt());
  }

  // Draw lightning bolts
  stroke(255);
  strokeWeight(1);
  for (let i = lightningBolts.length - 1; i >= 0; i--) {
    drawLightningBolt(lightningBolts[i]);
    lightningBolts[i].life--;
    if (lightningBolts[i].life <= 0) {
      lightningBolts.splice(i, 1);
    }
  }

  // Draw waveform
  let waveform = fft.waveform();
  noFill();
  stroke(240,230,140);
  strokeWeight(2);

  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();
}

function toggleSound() {
  if (sound.isPlaying()) {
    sound.pause();
    playButton.html('Play');
  } else {
    sound.loop();
    playButton.html('Pause');
  }
}

// Generate a lightning bolt as a jagged path
function generateLightningBolt() {
  let bolt = {
    points: [],
    life: int(random(5, 10))
  };

  let x = random(width);
  let y = 0;
  bolt.points.push(createVector(x, y));

  for (let i = 0; i < 10; i++) {
    x += random(-20, 20);
    y += random(20, 40);
    bolt.points.push(createVector(x, y));
    if (y > height) break;
  }

  return bolt;
}

// Draw a single lightning bolt
function drawLightningBolt(bolt) {
  beginShape();
  for (let pt of bolt.points) {
    vertex(pt.x, pt.y);
  }
  endShape();
}
