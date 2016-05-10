'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPositions = getPositions;
function getAngle(r, angle, x0, y0) {
  var x1 = x0 + r * Math.cos(angle * Math.PI / 180);
  var y1 = y0 + r * Math.sin(angle * Math.PI / 180);
  return [x1.toFixed(2), y1.toFixed(2)];
}

/**
 * @param {count} point's count
 * @param {r} radius
 * @param {angle} init angle
 * @param {x0} center point x
 * @param {y0} center point y
 */
function getPositions(count) {
  var r = arguments.length <= 1 || arguments[1] === undefined ? 50 : arguments[1];
  var angle = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  var x0 = arguments.length <= 3 || arguments[3] === undefined ? r : arguments[3];
  var y0 = arguments.length <= 4 || arguments[4] === undefined ? r : arguments[4];

  var pos = [];
  var step = 360 / count;
  for (var i = 0; i < count; i++) {
    pos.push(getAngle(r, step * i + angle, x0, y0));
  }
  return pos;
}