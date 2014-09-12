var width, height, center;
// var points = document.getElementById("source").value;
var points = 6;
var path = new Path();
var mousePos = view.center / 2;
var pathHeight = mousePos.y;
path.fillColor = "white";
initializePath();

function initializePath() {
  center = view.center;
  width = view.size.width;
  height = view.size.height / 2;
  path.segments = [];
  path.add(view.bounds.topLeft);
  path.add(view.bounds.leftCenter);
  for (var i = 1; i < points; i++) {
    var point = new Point(width / points * i, center.y);
    path.add(point);
  }
  path.add(view.bounds.rightCenter);
  path.add(view.bounds.topRight);
}

function onFrame(event) {
  pathHeight += (center.y - mousePos.y - pathHeight) / 10;
  for (var i = 1; i < points; i++) {
    var sinSeed = event.count + (i + i % 10) * 100;
    var sinHeight = Math.sin(sinSeed / 50) * pathHeight;
    var yPos = Math.sin(sinSeed / 500) * sinHeight + height;
    path.segments[i].point.y = yPos;
  }
  path.smooth();
}

function onResize(event) {
  initializePath();
}

// this.changeCanvas = function() {
//   points = document.getElementById("source").value;
//   view.update();
// }

// paper.install(window.paperscript);