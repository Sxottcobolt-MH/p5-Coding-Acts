let songs = [];
let currentSongIndex = 0;
let fft, amplitude;
let canPlay = true;
let isPlaying = false;
let bolts = [];
let fade = 255; // Controls fade-out of visuals when music stops

// Load all audio files before the sketch starts
function preload() {
  songs[0] = loadSound('Arkveld Roar.mp3');
  songs[1] = loadSound('Arkveld Roar_2 mp3.mp3');
  songs[2] = loadSound('arkveld-roar-made-with-Voicemod.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  colorMode(HSB, 360, 100, 255, 255); // Use Hue-Saturation-Brightness color mode

  fft = new p5.FFT();         // Analyze waveform/spectrum
  amplitude = new p5.Amplitude(); // Detect volume level

  // Add an 'onended' listener for each song
  songs.forEach(song => {
    song.onended(() => {
      isPlaying = false;
      canPlay = false;    // Prevent immediate replay
      fade = 255;         // Reset fade for visuals
      setTimeout(() => {
        canPlay = true;   // Allow replay after 6 seconds
      }, 6000);
    });
  });
}

function draw() {
  // Slightly transparent background for trail effect
  background(20, 20, 20, 100);

  let level = amplitude.getLevel(); // Current volume level
  drawVeinBackground(frameCount, level); // Animate flowing background

  // If not playing, show controls or waiting message
  if (!isPlaying) {
    fade = max(0, fade - 5); // Fade visuals out gradually
    fill(300, 10, 255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(min(width, height) * 0.03); // Responsive text size

    if (canPlay) {
      text('Press "A" to play/pause | 1–3 to switch tracks', width / 2, height / 2);
    } else {
      text('Wait 6 seconds before playing again', width / 2, height / 2);
    }

    // Tint any residual visuals if needed
    tint(255, fade);
    return;
  }

  // Get waveform data
  let waveform = fft.waveform();
  let bands = waveform.length;
  let angleStep = TWO_PI / bands;

  translate(width / 2, height / 2); // Draw from center

  // Glowing outer waveforms (deep red glow)
  strokeWeight(3);
  for (let i = 0; i < 2; i++) {
    stroke(350, 100, 80, 100 - i * 40); // HSB color with alpha
    beginShape();
    for (let j = 0; j < bands; j++) {
      let amp = waveform[j];
      let r = 150 + amp * (100 + i * 15);
      let x = r * cos(j * angleStep);
      let y = r * sin(j * angleStep);
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  // Central red waveform ring
  stroke(0, 100, 200); // Strong red
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < bands; i++) {
    let amp = waveform[i];
    let r = 150 + amp * 100;
    let x = r * cos(i * angleStep);
    let y = r * sin(i * angleStep);
    vertex(x, y);
  }
  endShape(CLOSE);

  // Add lightning based on amplitude
  updateBolts(level);
  drawBolts();
}

// Draws flowing sine-wave background based on amplitude and time
function drawVeinBackground(time, ampLevel) {
  noFill();
  strokeWeight(1.5);

  let brightnessBoost = map(ampLevel, 0, 0.5, 30, 100);
  let warp = map(ampLevel, 0, 0.5, 10, 50); // Stronger wave motion with volume

  for (let i = 0; i < height; i += 15) {
    beginShape();
    for (let x = 0; x < width; x += 10) {
      let yOffset = sin((x + time * 0.5 + i * 0.2) * 0.02) * warp;
      let y = i + yOffset;

      let hueShift = sin((x + time * 0.3) * 0.01) * 30;
      let lavenderHue = 270 + hueShift; // Purple-lavender base
      let c = color(lavenderHue, 40, brightnessBoost, 155);
      stroke(c);
      vertex(x, y);
    }
    endShape();
  }
}

// Lightning bolt object with short lifetime
class LightningBolt {
  constructor(angle, length, lifetime) {
    this.angle = angle;
    this.length = length;
    this.lifetime = lifetime;
    this.maxLifetime = lifetime;
  }

  update() {
    this.lifetime--;
  }

  isDead() {
    return this.lifetime <= 0;
  }

  draw() {
    push();
    rotate(this.angle);
    let alpha = map(this.lifetime, 0, this.maxLifetime, 0, 255);
    stroke(350, 100, 80, alpha); // Glowing pink-red
    strokeWeight(2);
    noFill();

    // Bolt shape with some randomness
    beginShape();
    vertex(170, 0);
    vertex(170 + random(-10, 10), random(-10, 10));
    vertex(170 + random(-20, 20), random(-30, 30));
    vertex(170 + random(-15, 15), random(-10, 10));
    vertex(170 + random(-5, 5), 0);
    endShape();
    pop();
  }
}

// Add/remove/update lightning bolts, based on audio level
function updateBolts(level) {
  bolts = bolts.filter(b => !b.isDead()); // Remove expired bolts

  // Use amplitude to control how often new bolts appear
  if (random() < map(level, 0, 0.5, 0.05, 0.3)) {
    bolts.push(new LightningBolt(random(TWO_PI), random(30, 60), floor(random(15, 30))));
  }

  for (let bolt of bolts) {
    bolt.update();
  }
}

// Draw all active bolts
function drawBolts() {
  for (let bolt of bolts) {
    bolt.draw();
  }
}

// Handle key presses for controls
function keyPressed(event) {
  // Play/pause toggle
  if ((key === 'a' || key === 'A') && canPlay) {
    if (!isPlaying) {
      if (!songs[currentSongIndex].isPlaying()) {
        songs[currentSongIndex].play();
        fft.setInput(songs[currentSongIndex]); // Set input once when playback begins
        isPlaying = true;
        fade = 255;
      }
    } else {
      songs[currentSongIndex].pause();
      isPlaying = false;
    }
  }

  // Switch tracks (only if not playing)
  if (!isPlaying && ['1', '2', '3'].includes(key)) {
    currentSongIndex = parseInt(key) - 1;
  }
}

// Add mobile/touchscreen support for toggling play
function mousePressed() {
  if (canPlay && !isPlaying) {
    keyPressed({ key: 'a' }); // Simulate pressing A
  }
}