'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setOptions = setOptions;
exports.getGrid = getGrid;
var GRIDS = {};
var OFFSETS = {};
var RESPONSIVE = {
  'xs': '320',
  'sm': '568',
  'md': '768',
  'lg': '992',
  'xl': '1200'
};
var gridPre = 'cmpt-grid';
var offsetPre = 'cmpt-offset';
var defaultResponsive = 'xs';

function setOptions(options) {
  if (!options) {
    return;
  }
  if (options.gridPre) {
    gridPre = options.gridPre;
  }
  if (options.offsetPre) {
    offsetPre = options.offsetPre;
  }
  if (options.responsive) {
    defaultResponsive = options.responsive;
  }
}

function getGrid(options) {
  if (!options) {
    return '';
  }
  if (typeof options === 'number') {
    options = { width: options };
  }

  var _options = options;
  var width = _options.width;
  var offset = _options.offset;
  var responsive = _options.responsive;

  var gridClass = generate(width, 'grid', responsive);
  var offsetClass = generate(offset, 'offset', responsive);

  return gridPre + ' ' + gridPre + '-1 ' + gridClass + ' ' + offsetClass;
}

function generate(width, type, responsive) {
  if (!width || width <= 0) {
    return '';
  }

  if (width > 1) {
    width = 1;
  }
  width = (width * 100).toFixed(4);
  width = width.substr(0, width.length - 1);

  responsive = responsive || defaultResponsive;
  var key = responsive + '-' + width.replace('.', '-');
  if (type === 'grid') {
    if (!GRIDS[key]) {
      generateGrid(width, key, responsive);
    }
    return gridPre + '-' + key;
  } else {
    if (!OFFSETS[key]) {
      generateOffset(width, key, responsive);
    }
    return offsetPre + '-' + key;
  }
}

function generateGrid(width, key, responsive) {
  GRIDS[key] = true;
  var minWidth = RESPONSIVE[responsive];
  var text = '@media screen and (min-width: ' + minWidth + 'px) { .' + gridPre + '-' + key + '{width: ' + width + '%} }';

  createStyle(text);
}

function generateOffset(width, key, responsive) {
  OFFSETS[key] = true;
  var minWidth = RESPONSIVE[responsive];
  var text = '@media screen and (min-width: ' + minWidth + 'px) { .' + offsetPre + '-' + key + '{margin-left: ' + width + '%} }';

  createStyle(text);
}

function createStyle(text) {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = text;
  document.head.appendChild(style);
}

(function () {
  var text = [];

  text.push('\n.' + gridPre + ' {\n  display: inline-block;\n  zoom: 1;\n  letter-spacing: normal;\n  word-spacing: normal;\n  vertical-align: top;\n  text-rendering: auto;\n  box-sizing: border-box;\n}');

  text.push('.' + gridPre + '-1{width:100%}');
  createStyle(text.join(''));
})();

exports.default = {
  setOptions: setOptions,
  getGrid: getGrid
};