'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDescendant = isDescendant;
exports.offset = offset;
exports.forceRedraw = forceRedraw;
exports.withoutTransition = withoutTransition;
exports.getOuterHeight = getOuterHeight;
exports.getScrollTop = getScrollTop;
exports.overView = overView;
exports.computedStyle = computedStyle;
exports.getLineHeight = getLineHeight;
exports.onEvent = onEvent;
exports.offEvent = offEvent;
exports.onceEvent = onceEvent;
function tryParseInt(p) {
  if (!p) {
    return 0;
  }
  var pi = parseInt(p);
  return pi || 0;
}

function isDescendant(parent, child) {
  var node = child.parentNode;

  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
}

function offset(el) {
  var rect = el.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
}

function forceRedraw(el) {
  var originalDisplay = el.style.display;

  el.style.display = 'none';
  var oh = el.offsetHeight;
  el.style.display = originalDisplay;
  return oh;
}

function withoutTransition(el, callback) {
  //turn off transition
  el.style.transition = 'none';

  callback();

  //force a redraw
  forceRedraw(el);

  //put the transition back
  el.style.transition = '';
}

function getOuterHeight(el) {
  var height = el.clientHeight + tryParseInt(el.style.borderTopWidth) + tryParseInt(el.style.borderBottomWidth) + tryParseInt(el.style.marginTop) + tryParseInt(el.style.marginBottom);
  return height;
}

function getScrollTop() {
  var dd = document.documentElement;
  var scrollTop = 0;
  if (dd && dd.scrollTop) {
    scrollTop = dd.scrollTop;
  } else if (document.body) {
    scrollTop = document.body.scrollTop;
  }
  return scrollTop;
}

function overView(el) {
  var pad = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  var height = window.innerHeight || document.documentElement.clientHeight;

  var bottom = el.getBoundingClientRect().bottom + pad;
  return bottom > height;
}

function computedStyle(el, attr) {
  var lineHeight;
  if (el.currentStyle) {
    lineHeight = el.currentStyle[attr];
  } else if (window.getComputedStyle) {
    lineHeight = window.getComputedStyle(el, null)[attr];
  }
  return lineHeight;
}

function getLineHeight(origin) {
  var el = origin.cloneNode(true);
  var lineHeight = void 0;
  el.style.padding = 0;
  el.rows = 1;
  el.innerHTML = '&nbsp;';
  el.style.minHeight = 'inherit';
  origin.parentNode.appendChild(el);
  lineHeight = el.clientHeight;
  origin.parentNode.removeChild(el);

  return lineHeight;
}

// dom事件绑定
function onEvent(el, type, callback) {
  if (el.addEventListener) {
    el.addEventListener(type, callback);
  } else {
    el.attachEvent('on' + type, function () {
      callback.call(el);
    });
  }

  return callback;
}

// dom事件去除
function offEvent(el, type, callback) {
  if (el.removeEventListener) {
    el.removeEventListener(type, callback);
  } else {
    el.detachEvent('on' + type, callback);
  }

  return callback;
}

// 单次dom事件绑定
function onceEvent(el, type, callback) {
  var typeArray = type.split(' ');
  var recursiveFunction = function recursiveFunction(e) {
    e.target.removeEventListener(e.type, recursiveFunction);
    return callback(e);
  };

  for (var i = typeArray.length - 1; i >= 0; i--) {
    on(el, typeArray[i], recursiveFunction);
  }
}

exports.default = {
  onEvent: onEvent, offEvent: offEvent, onceEvent: onceEvent
};