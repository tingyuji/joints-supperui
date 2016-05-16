'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextUid = nextUid;
exports.format = format;
exports.substitute = substitute;
exports.toArray = toArray;
exports.toStyleObject = toStyleObject;
var uid = Date.now();
function nextUid() {
  return (uid++).toString(36);
}

function format() {
  var args = [].slice.call(arguments),
      str = args.shift();
  return str.replace(/{(\d+)}/g, function (match, number) {
    return args[number] !== undefined ? args[number] : match;
  });
}

function substitute(str, obj) {
  if (typeof str === 'string') {
    return str.replace(/\\?\{([^{}]+)\}/g, function (match, name) {
      if (match.charAt(0) === '\\') {
        return match.slice(1);
      }
      return obj[name] === null || obj[name] === undefined ? '' : obj[name];
    });
  } else if (typeof str === 'function') {
    return str(obj);
  }
}

function toArray(value, sep) {
  if (value === null || value === undefined) {
    value = [];
  }
  if (typeof value === 'string' && sep) {
    value = value.split(sep);
  } else if (!(value instanceof Array)) {
    value = [value.toString()];
  } else if (sep) {
    // if use sep, convert every value to string
    value = value.map(function (v) {
      return v.toString();
    });
  }

  return value;
}

function toStyleObject(str) {
  if (!str) {
    return undefined;
  }

  var style = {};
  var kv = void 0;
  str.split(';').forEach(function (s) {
    s = s.trim();
    if (!s) {
      return;
    }

    kv = s.split(':');
    if (kv.length < 2) {
      console.warn('style is error');
      return;
    }
    var key = kv[0].replace(/-./g, function (r) {
      return r.replace('-', '').toUpperCase();
    }).trim();
    style[key] = kv[1].trim();
  });

  return style;
}