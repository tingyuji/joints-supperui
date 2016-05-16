'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepEqual = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                   * 对象相关方法
                                                                                                                                                                                                                                                   * 
                                                                                                                                                                                                                                                   * Created by Ray on 2015-09-05
                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                   * 描述：用于定义自定义错误
                                                                                                                                                                                                                                                   */

exports.isEmpty = isEmpty;
exports.forEach = forEach;
exports.toTextValue = toTextValue;
exports.hashcode = hashcode;
exports.sortByKey = sortByKey;
exports.shallowEqual = shallowEqual;
exports.type = type;
exports.merge = merge;
exports.clone = clone;

var _str = require('./str');

var deepEqual = exports.deepEqual = function compare(x, y) {
  var p = void 0;

  // remember that NaN === NaN returns false
  // and isNaN(undefined) returns true
  if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
    return true;
  }

  // Compare primitives and functions.
  // Check if both arguments link to the same object.
  // Especially useful on step when comparing prototypes
  if (x === y) {
    return true;
  }

  // Works in case when functions are created in constructor.
  // Comparing dates is a common scenario. Another built-ins?
  // We can even handle functions passed across iframes
  if (typeof x === 'function' && typeof y === 'function' || x instanceof RegExp && y instanceof RegExp || x instanceof String || y instanceof String || x instanceof Number || y instanceof Number) {
    return x.toString() === y.toString();
  }

  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime();
  }

  // At last checking prototypes as good a we can
  if (!(x instanceof Object && y instanceof Object)) {
    return false;
  }

  if (x.prototype !== y.prototype) {
    return false;
  }

  if (x.constructor !== y.constructor) {
    return false;
  }

  for (p in y) {
    if (!x.hasOwnProperty(p)) {
      return false;
      //}
      //else if (typeof y[p] !== typeof x[p]) {
      //  return false;
    }
  }

  for (p in x) {
    if (!y.hasOwnProperty(p)) {
      return false;
    }

    if (_typeof(y[p]) !== _typeof(x[p])) {
      return false;
    }

    if (!compare(x[p], y[p])) {
      return false;
    }
  }

  return true;
};

function isEmpty(obj) {
  // null and undefined are "empty"
  if (obj === null || obj === undefined) {
    return true;
  }

  if (typeof obj === 'number' && isNaN(obj)) {
    return true;
  }

  if (obj.length !== undefined) {
    return obj.length === 0;
  }

  if (obj instanceof Date) {
    return false;
  }

  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    return Object.keys(obj).length === 0;
  }

  return false;
}

function forEach(obj, fn, context) {
  Object.keys(obj).forEach(function (key) {
    return fn.call(context, obj[key], key);
  });
}

function toTextValue(arr) {
  var textTpl = arguments.length <= 1 || arguments[1] === undefined ? '{text}' : arguments[1];
  var valueTpl = arguments.length <= 2 || arguments[2] === undefined ? '{id}' : arguments[2];

  if (!arr) {
    return [];
  }
  if (!Array.isArray(arr)) {
    arr = Object.keys(arr).map(function (key) {
      return {
        id: key,
        text: arr[key]
      };
    });
  }
  arr = arr.map(function (s) {
    if ((typeof s === 'undefined' ? 'undefined' : _typeof(s)) !== 'object') {
      s = s.toString();
      return { $text: s, $value: s, $key: hashcode(s) };
    } else {
      s.$text = (0, _str.substitute)(textTpl, s);
      s.$value = (0, _str.substitute)(valueTpl, s);
      s.$key = s.id ? s.id : hashcode(s.$text + '-' + s.$value);
      return s;
    }
  });
  return arr;
}

function hashcode(obj) {
  var hash = 0,
      i = void 0,
      chr = void 0,
      len = void 0,
      str = void 0;

  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  switch (type) {
    case 'object':
      //let newObj = {};
      //forEach(obj, (v, k) => v && (typeof v === 'object' || 'function') ? v.toString() : v);
      str = JSON.stringify(obj);
      break;
    case 'string':
      str = obj;
      break;
    default:
      str = obj.toString();
      break;
  }

  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36);
}

function sortByKey(obj) {
  if (!obj) {
    return {};
  }

  var newObj = {};
  Object.keys(obj).sort().forEach(function (key) {
    newObj[key] = obj[key];
  });

  return newObj;
}

function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);

  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }

  for (var i = 0, key; i < keysA.length; i++) {
    key = keysA[i];
    if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
}

function type(val) {
  switch (toString.call(val)) {
    case '[object Date]':
      return 'date';
    case '[object RegExp]':
      return 'regexp';
    case '[object Arguments]':
      return 'arguments';
    case '[object Array]':
      return 'array';
    case '[object Error]':
      return 'error';
  }

  if (val === null) {
    return 'null';
  }
  if (val === undefined) {
    return 'undefined';
  }
  if (val !== val) {
    return 'nan';
  }
  if (val && val.nodeType === 1) {
    return 'element';
  }

  val = val.valueOf ? val.valueOf() : Object.prototype.valueOf.apply(val);

  return typeof val === 'undefined' ? 'undefined' : _typeof(val);
}

function merge(target) {
  if (target === undefined || target === null) {
    return {};
  }

  var to = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource === undefined || nextSource === null) {
      continue;
    }
    nextSource = Object(nextSource);

    var keysArray = Object.keys(nextSource);
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];

      // Object.Keys can't get enumerable key
      //var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
      //if (desc !== undefined && desc.enumerable) {
      to[nextKey] = nextSource[nextKey];
      //}
    }
  }
  return to;
}

function clone(obj) {
  switch (type(obj)) {
    case 'object':
      var copy = {};
      Object.keys(obj).forEach(function (key) {
        copy[key] = clone(obj[key]);
      });
      return copy;

    case 'element':
      return obj.cloneNode(true);

    case 'array':
      var arr = new Array(obj.length);
      for (var i = 0, l = obj.length; i < l; i++) {
        arr[i] = clone(obj[i]);
      }
      return arr;

    case 'regexp':
      // from millermedeiros/amd-utils - MIT
      var flags = '';
      flags += obj.multiline ? 'm' : '';
      flags += obj.global ? 'g' : '';
      flags += obj.ignoreCase ? 'i' : '';
      return new RegExp(obj.source, flags);

    case 'date':
      return new Date(obj.getTime());

    default:
      // string, number, boolean, …
      return obj;
  }
}