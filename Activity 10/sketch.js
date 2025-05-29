//=============== Global Values
let textToDisplay = "Welcome to Bathspa";

//=============== Switch colors every 140 BPM 
let bpmColors = [
  "#ff7f7f", "#ffbf7f", "#ffff7f", "#bfff7f", "#7fff7f",
  "#7fffbf", "#7fffff", "#7fbfff", "#7f7fff", "#bf7fff",
  "#ff7fff", "#ff7fbf"
]; //rainbow colors
let bpmColorIndex = 0;
let bpmTimerActive = false;
let bpmInterval = (60/140)*1000; // milliseconds for 140 BPM
let lastBpmChangeTime = 0;


//=============== For use in Text Glow
let glowColor;
let glowLayers = 100;
let glowOpacityFactor = 0.01;

//=============== Mouse trail
let trail = [];
let r, g, b;
let lastColorChangeFrame = 0;
const colorChangeInterval = 120; // 2 seconds at 60 FPS

//=============== Wave bg var
let waveFill;
let nextWaveFill = null;
let waveChangeTime = 0;
let delayDuration = 2000; // 2 seconds (in milliseconds)

//=============== Sounds var
let myFont;
let textColor;
let s1,s2,s3,s4,s5,s6,s7, s8, s9, s10, s11, s12, s13;


//=============================================
// ================ PRELOAD
//=============================================
function preload() {
  myFont = loadFont('Tourney_Expanded-Italic.ttf');
  
  s1 = loadSound("Sounds/cncl01.mp3");
  s2 = loadSound("Sounds/cncl02.mp3");
  s3 = loadSound("Sounds/cncl03.mp3");
  s4 = loadSound("Sounds/cncl04.mp3");
  s5 = loadSound("Sounds/cncl05.mp3");
  s6 = loadSound("Sounds/cncl06.mp3");
  s7 = loadSound("Sounds/cncl07.mp3");
  s8 = loadSound("Sounds/btn01.mp3");
  s9 = loadSound("Sounds/btn02.mp3");
  s10 = loadSound("Sounds/btn03.mp3");
  s11 = loadSound("Sounds/btn04.mp3");
  s12 = loadSound("Sounds/btn05.mp3");
  s13 = loadSound("Sounds/btn06.mp3");
}

//=============================================
// ================ SETUP
//=============================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(60);
  textFont(myFont);
  textColor = color(0); // Default text color (black)
  glowColor = color(255); // default white glow
  
  waveFill = color(40, 60, 80, 120); // initial semi-transparent wave fill
  
  noFill();
  frameRate(60);
  setRandomColor();
  
  //====== Initiate FFT and Amplitude Analyzers
  fft = new p5.FFT(0.8, 32);
  amp = new p5.Amplitude();
}

//=============================================
// ================ DRAW
//=============================================
function draw() {
  //=========================== Wavy Bg
  drawWavyBackground();

  if (nextWaveFill && millis() >= waveChangeTime) {
    waveFill = nextWaveFill;
    nextWaveFill = null;
  }
  
  //=========================== Text
  
  // Reactive Text Glow
  let level = amp.getLevel(); // Get amplitude level
  let centerX = width / 2;
  let centerY = height / 2;
  let spacing = 42;
  let startX = centerX - (textToDisplay.length / 2) * spacing + spacing / 2;
  let y = centerY; 
  
  // Draw Glow Aura
  for (let i = 0; i < textToDisplay.length; i++) {
    let char = textToDisplay[i];
    let x = startX + i * spacing;
    drawReactiveCharAura(char, x, y, level, glowColor, glowLayers, glowOpacityFactor);
  }

  //=========================== Mouse trail
  noFill();
  frameRate(60);
  setRandomColor();

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
  
  
  //Change Color every 140 BPM
  if (bpmTimerActive && millis() - lastBpmChangeTime >= bpmInterval) {
    // Update textColor and glowColor from bpmColors
    let hex = bpmColors[bpmColorIndex];
    textColor = color(hex);
    glowColor = color(hex);

    // Cycle through the array
    bpmColorIndex = (bpmColorIndex + 1) % bpmColors.length;
    lastBpmChangeTime = millis();
  }
}


//=============================================
// ================ WAVY BACKGROUND
//=============================================
function drawWavyBackground() {
  background(30, 50); // fixed dark background with slight transparency

  noStroke();
  fill(waveFill);

  let yoff = 0;
  for (let y = 0; y < height; y += 20) {
    let xoff = 0;

    beginShape();
    for (let x = 0; x <= width; x += 20) {
      // Offset noise by mouseX and mouseY for both directions
      let noiseVal = noise(
        xoff + mouseX * 0.01,     // horizontal offset influenced by mouseX
        yoff + mouseY * 0.01,     // vertical offset influenced by mouseY
        frameCount * 0.01
      );
      let wave = map(noiseVal, 0, 1, -20, 20);

      vertex(x, y + wave);
      xoff += 0.1;
    }
    endShape();

    yoff += 0.1;
  }
}


//=============================================
// ================ MOUSE PRESSED
//=============================================
function mousePressed() {
  let r = floor(random(256));
  let g = floor(random(256));
  let b = floor(random(256));
  nextWaveFill = color(r, g, b, 50);

  waveChangeTime = millis() + delayDuration;
}


//=============================================
// ================ KEY PRESSED
//=============================================
function keyPressed() {
  stopAllSounds(); //call to stop sounds
  
  bpmTimerActive = false; //disable BPM ticking
  
  switch (key.toUpperCase()) {
    case 'W': textColor = color(255, 255, 255); glowColor = textColor; s1.play(); break; // White
    case 'E': textColor = color(80, 200, 120); glowColor = textColor;  s2.play(); break; // Emerald
    case 'L': textColor = color(255, 183, 197); glowColor = textColor;  s3.play(); break; // Lavender Pink
    case 'C': textColor = color(54, 69, 79); glowColor = textColor;  s4.play(); break; // Charcoal
    case 'O': textColor = color(154, 185, 115); glowColor = textColor;  s5.play(); break; // Olivine
    case 'M': textColor = color(226, 223, 229); glowColor = textColor;  s6.play(); break; // Moonstone (light gray-blue)
    case 'T': textColor = color(204, 78, 92); glowColor = textColor;  s7.play(); break; // Turkey Red
    case 'B': s8.play(); bpmColorIndex = 0; bpmTimerActive = true; lastBpmChangeTime = millis(); break;
    case 'A': textColor = color(255, 153, 102); glowColor = textColor;  s9.play(); break; // Atomic Tangerine
    case 'H': textColor = color(218, 145, 0); glowColor = textColor;  s10.play(); break; // Harvest Gold
    case 'S': textColor = color(106, 90, 205); glowColor = textColor;  s11.play(); break; // Slate Blue
    case 'P': textColor = color(229, 228, 226); glowColor = textColor;  s12.play(); break; // Platinum
    case 'I': textColor = color(0,0,0); glowColor = textColor;  s13.play(); break; //default Black
  }
}

//=============================================
// ================ SET RANDOM RGB COLOR
//=============================================
function setRandomColor() {
  r = random(20, 255);
  g = random(20, 255);
  b = random(20, 255);
}


//=============================================
// ================ DRAW TEXT GLOW
//=============================================
function drawReactiveCharAura(char, x, y, ampLevel, auraColor, layers, opacityFactor) {
  let brightness = map(ampLevel, 0, 1, 50, 255);
  let col = color(auraColor);
  col.setAlpha(brightness);

  // Draw glowing text
  fill(col);
  stroke(col);
  strokeWeight(2);
  text(char, x, y);

  // Aura glow (opaque center → transparent edge)
  let maxRadius = brightness / 2 + 30;
  for (let j = 0; j < layers; j++) {
    let t = j / layers;
    let radius = maxRadius * (1 - t);
    let alpha = brightness * (1 - t) * opacityFactor;
    let fadedColor = color(red(col), green(col), blue(col), alpha);
    noStroke();
    fill(fadedColor);
    ellipse(x, y, radius);
  }
}

//Stop every sound
function stopAllSounds() {
  [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13].forEach(sound => {
    if (sound && sound.isPlaying()) {
      sound.stop();
    }
  });
}
