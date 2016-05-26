'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFullMonth = getFullMonth;
exports.getShortMonth = getShortMonth;
exports.getDayOfWeek = getDayOfWeek;
exports.getDatetime = getDatetime;
exports.getDate = getDate;
exports.getFullYear = getFullYear;
exports.getTime = getTime;
exports.convert = convert;

var _supperutils = require('supperutils');

var _locals = require('../locals');

function getFullMonth(d) {
  var month = d.getMonth();
  return (0, _locals.getLang)('datetime.fullMonth')[month];
}

function getShortMonth(d) {
  var month = d.getMonth();
  return (0, _locals.getLang)('datetime.shortMonth')[month];
}

function getDayOfWeek(d) {
  var weekday = d.getDay();
  return (0, _locals.getLang)('datetime.weekday')[weekday];
}

function getDatetime(d) {
  return _supperutils.Dt.format(d, (0, _locals.getLang)('datetime.format.datetime'));
}

function getDate(d) {
  return _supperutils.Dt.format(d, (0, _locals.getLang)('datetime.format.date'));
}

function getFullYear(d) {
  return _supperutils.Dt.format(d, (0, _locals.getLang)('datetime.format.year'));
}

function getTime(d) {
  return _supperutils.Dt.format(d, (0, _locals.getLang)('datetime.format.time'));
}

// string, unixtimestamp convert to Date
function convert(obj, def) {
  if (def === undefined) {
    def = new Date();
  }

  if (!obj) {
    return def;
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (/^[-+]?[0-9]+$/.test(obj)) {
    obj = parseInt(obj);
  } else {
    obj = obj.replace(/-/g, '/');
  }

  if (/^\d?\d:\d?\d/.test(obj)) {
    obj = getDate(new Date()) + ' ' + obj;
  }

  obj = new Date(obj);
  // Invalid Date
  if (isNaN(obj.getTime())) {
    obj = def;
  }

  return obj;
}