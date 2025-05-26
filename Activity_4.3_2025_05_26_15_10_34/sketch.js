let img;

function preload() {
  // Load your image here
  img = loadImage('White Cliffs.jpg'); // Make sure to have an image in the project folder
}

function setup() {
  createCanvas(img.width, img.height);
  noLoop(); // Disable automatic looping
}

function draw() {
  background(0);
  
  // Calculate number of posterization levels based on mouseX
  let levels = int(map(mouseX, 0, width, 2, 20));
  levels = constrain(levels, 2, 20); // Keep it within a usable range
  
  // Create a copy of the image to apply the filter
  let posterizedImg = img.get();
  posterizedImg.filter(POSTERIZE, levels);
  
  image(posterizedImg, 0, 0);
  
  // Optional: show level on screen
  fill(255);
  textSize(16);
  text(`Posterize Levels: ${levels}`, 10, height - 10);
}

function mouseMoved() {
  redraw(); // Update the canvas whenever the mouse moves
}
