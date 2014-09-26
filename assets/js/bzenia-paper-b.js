var width, height, center;
var points = 4;
var mousePos = view.center / 2;
var pathHeight = mousePos.y;

var pathWave = new Path({
  fillColor: "#252526",
  opacity: 0.5
});

initializePath();

function initializePath() {
  center = view.center;
  width = view.size.width;
  height = view.size.height * 0.5;

  pathWave.segments = [];
  pathWave.add(view.bounds.topLeft);
  pathWave.add(0, view.size.height * 0.75);
  for (var i = 1; i < points; i++) {
    var point = new Point(width / points * i, center.y);
    pathWave.add(point);
  }
  pathWave.add(width, view.size.height * 0.125);
  pathWave.add(view.bounds.topRight);
}

function onFrame(event) {
  pathHeight += (center.y - mousePos.y - pathHeight) / 10;
  for (var i = 2; i < points; i++) {
    var sinSeed = event.count + (i + i % 10) * 150;
    var sinHeight = Math.sin(sinSeed / 50) * pathHeight;
    var yPos = Math.sin(sinSeed / 100) * sinHeight + height;
    pathWave.segments[i].point.y = yPos;
  }
  pathWave.smooth();
}

function onMouseMove(event) {
  mousePos = event.point;
}

function onResize(event) {
  initializePath();
}