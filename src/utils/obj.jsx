/**
 * 对象相关方法
 * 
 * Created by Ray on 2015-09-05
 *
 * 描述：用于定义自定义错误
 */

import { substitute } from './str';

export const deepEqual = function compare(x, y) {
  let p;

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
  if ((typeof x === 'function' && typeof y === 'function') ||
    (x instanceof RegExp && y instanceof RegExp) ||
    (x instanceof String || y instanceof String) ||
    (x instanceof Number || y instanceof Number)) {
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

    if (typeof y[p] !== typeof x[p]) {
      return false;
    }

    if (!compare(x[p], y[p])) {
      return false;
    }

  }

  return true;
}

export function isEmpty (obj) {
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

  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  }

  return false;
}

export function forEach (obj, fn, context) {
  Object.keys(obj).forEach((key) => fn.call(context, obj[key], key));
}

export function toTextValue (arr, textTpl='{text}', valueTpl='{id}') {
  if (!arr) {
    return [];
  }
  if (!Array.isArray(arr)) {
    arr = Object.keys(arr).map((key) => {
      return {
        id: key,
        text: arr[key]
      };
    });
  }
  arr = arr.map(function (s) {
    if (typeof s !== 'object') {
      s = s.toString();
      return { $text: s, $value: s, $key: hashcode(s) };
    } else {
      s.$text = substitute(textTpl, s);
      s.$value = substitute(valueTpl, s);
      s.$key = s.id ? s.id : hashcode(`${s.$text}-${s.$value}`);
      return s;
    }
  });
  return arr;
}

export function hashcode(obj) {
  let hash = 0, i, chr, len, str;

  let type = typeof obj;
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
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36);
}

export function sortByKey (obj) {
  if (!obj) {
    return {};
  }

  let newObj = {};
  Object.keys(obj).sort().forEach((key) => {
    newObj[key] = obj[key];
  });

  return newObj;
}

export function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);

  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }

  for (let i = 0, key; i < keysA.length; i++) {
    key = keysA[i];
    if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
}

export function type (val) {
  switch (toString.call(val)) {
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object Error]': return 'error';
  }

  if (val === null) { return 'null'; }
  if (val === undefined) { return 'undefined'; }
  if (val !== val) { return 'nan'; }
  if (val && val.nodeType === 1) { return 'element'; }

  val = val.valueOf
    ? val.valueOf()
    : Object.prototype.valueOf.apply(val);

  return typeof val;
}

export function merge(target) {
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

export function clone(obj) {
  switch (type(obj)) {
    case 'object':
      let copy = {};
      Object.keys(obj).forEach((key) => {
        copy[key] = clone(obj[key]);
      });
      return copy;

    case 'element':
      return obj.cloneNode(true);

    case 'array':
      let arr = new Array(obj.length);
      for (let i = 0, l = obj.length; i < l; i++) {
        arr[i] = clone(obj[i]);
      }
      return arr;

    case 'regexp':
      // from millermedeiros/amd-utils - MIT
      let flags = '';
      flags += obj.multiline ? 'm' : '';
      flags += obj.global ? 'g' : '';
      flags += obj.ignoreCase ? 'i' : '';
      return new RegExp(obj.source, flags);

    case 'date':
      return new Date(obj.getTime());

    default: // string, number, boolean, …
      return obj;
  }
}

