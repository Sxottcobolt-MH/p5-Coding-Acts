let colors;

function setup() {
  createCanvas(400, 400); // smaller canvas
  angleMode(RADIANS);
  noFill();
  strokeWeight(25); // thinner for smaller size

  // Define colors
  colors = [
    color(163, 22, 33),   // Madder
    color(186, 24, 27),   // Engineering Orange
    color(186, 92, 18),   // Burnt Orange
    color(247, 181, 56),  // Xanthous
    color(112, 224, 0),   // SGBUS Green
    color(0, 128, 0),     // Office Green
    color(114, 239, 221), // Turquoise
    color(72, 191, 227),  // Aeros
    color(0, 180, 216),   // Pacific Cyan
    color(0, 119, 182),   // Honolulu Blue
    color(2, 62, 125),    // Yale Blue
    color(36, 0, 70),     // Russian Violet
    color(181, 23, 158),  // Fandango
    color(192, 82, 153),  // Mulberry
  ];
}

function draw() {
  background(20);
  translate(width / 2, height / 2);

  let diameter = 250;
  let ringWeight = 25;

  // White outline behind the ring
  stroke(255);
  strokeWeight(ringWeight + 4); // slightly thicker than the ring
  ellipse(0, 0, diameter, diameter);

  rotate(frameCount * 0.01); // rotation

  // Draw the colorful spinning ring
  let totalSteps = 950;
  let segments = colors.length;
  let stepsPerSegment = totalSteps / segments;
  let angleStep = TWO_PI / totalSteps;

  strokeWeight(ringWeight);

  for (let s = 0; s < segments; s++) {
    let c1 = colors[s];
    let c2 = colors[(s + 1) % segments];

    for (let i = 0; i < stepsPerSegment; i++) {
      let t = i / stepsPerSegment;
      let interColor = lerpColor(c1, c2, t);

      let startAngle = (s * stepsPerSegment + i) * angleStep;
      let endAngle = startAngle + angleStep;

      stroke(interColor);
      arc(0, 0, diameter, diameter, startAngle, endAngle);
    }
  }
}
