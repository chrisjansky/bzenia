var width, height, center;
var points = 6;
var path = new Path();
var mousePos = view.center / 2;
var pathHeight = mousePos.y;
path.fillColor = 'white';
initializePath();

function initializePath() {
  center = view.center;
  width = view.size.width;
  height = view.size.height * 0.625;
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

// function onFrame(event) {
//   pathHeight += (center.y - mousePos.y / 5 - pathHeight) / 10;
//   for (var i = 2; i < points; i++) {
//     var sinSeed = event.count + (i + i % 10) * 100;
//     var sinHeight = Math.sin(sinSeed / 200) * pathHeight;
//     var yPos = Math.sin(sinSeed / 100) * sinHeight + height;
//     path.segments[i].point.y = yPos;
//   }
//   path.smooth();
// }

function onMouseMove(event) {
  mousePos = event.point;
}

function onResize(event) {
  initializePath();
}