'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOCATION = undefined;
exports.getLang = getLang;
exports.setLocation = setLocation;

var _obj = require('../utils/obj');

var langDataMap = {
  'zh-cn': require('./zh-cn')
};

var langData = null;

var LOCATION = exports.LOCATION = 'zh-cn';

function getLang(path, def) {
  if (!langData) {
    setLocation(LOCATION);
  }

  var result = langData || {};

  if (path === undefined) {
    return result;
  }

  if (!path || typeof path !== 'string') {
    return undefined;
  }

  var paths = path.split('.');

  for (var i = 0, count = paths.length; i < count; i++) {
    result = result[paths[i]];
    if (result === undefined) {
      if (def !== undefined) {
        return def;
      } else {
        return undefined;
      }
    }
  }

  return result;
}

function setLocation(location) {
  exports.LOCATION = LOCATION = location;

  if (langDataMap[location] && langDataMap[location]["default"]) {
    langData = langDataMap[location]["default"];
  }
}