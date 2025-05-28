let marketData = [
  { year: 2025, value: 1.95 },
  { year: 2030, value: 2.42 }
];

let hoveredIndex = -1;

function setup() {
  createCanvas(550, 550);
  noLoop();
}

function draw() {
  background(255);
  drawBarChart();
}

function drawBarChart() {
  let topMargin = 40;
  let bottomMargin = 60;
  let sideMargin = 40;
  let chartWidth = width - sideMargin * 2;
  let chartHeight = height - topMargin - bottomMargin;

  // Axes
  stroke(0);
  line(sideMargin, topMargin, sideMargin, height - bottomMargin); // Y axis
  line(sideMargin, height - bottomMargin, width - sideMargin, height - bottomMargin); // X axis

  // Y-axis scale
  let minValue = 1.8;
  let maxValue = 2.6;
  let steps = 4;

  for (let i = 0; i <= steps; i++) {
    let y = map(i, 0, steps, height - bottomMargin, topMargin);
    let val = nf(map(i, 0, steps, minValue, maxValue), 1, 2);
    stroke(230);
    line(sideMargin, y, width - sideMargin, y);
    noStroke();
    fill(0);
    textAlign(RIGHT, CENTER);
    text(val, sideMargin - 10, y);
  }

  // Bars
  let barWidth = 80;
  let spacing = 40;
  let totalBarAreaWidth = marketData.length * barWidth + (marketData.length - 1) * spacing;
  let baseX = (width - totalBarAreaWidth) / 2;

  for (let i = 0; i < marketData.length; i++) {
    let data = marketData[i];
    let x = baseX + i * (barWidth + spacing);
    let y = map(data.value, minValue, maxValue, height - bottomMargin, topMargin);
    let h = height - bottomMargin - y;

    // Interactivity: highlight bar on hover
    if (
      mouseX >= x && mouseX <= x + barWidth &&
      mouseY >= y && mouseY <= y + h
    ) {
      fill(255, 100, 100);
      hoveredIndex = i;
    } else {
      fill(0, 120, 255);
    }

    rect(x, y, barWidth, h);

    // Labels
    fill(0);
    textAlign(CENTER);
    text(data.year, x + barWidth / 2, height - bottomMargin + 20);
    text(`${data.value}B`, x + barWidth / 2, y - 10);
  }

  // Axis Labels
  fill(0);
  textAlign(CENTER);
  text("Year", width / 2, height - 20);
  textAlign(RIGHT);
  text("USD in Bn", sideMargin + 19, topMargin - 10);
}

function mouseMoved() {
  redraw(); // Trigger re-render for interactivity
}
