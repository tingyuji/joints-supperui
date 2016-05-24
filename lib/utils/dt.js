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