'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.addDays = addDays;
exports.addMonths = addMonths;
exports.getFirstDayOfMonth = getFirstDayOfMonth;
exports.getDaysInMonth = getDaysInMonth;
exports.getFullMonth = getFullMonth;
exports.getShortMonth = getShortMonth;
exports.getDayOfWeek = getDayOfWeek;
exports.getWeekArray = getWeekArray;
exports.isEqualDate = isEqualDate;
exports.isEqual = isEqual;
exports.monthDiff = monthDiff;
exports.format = format;
exports.getDatetime = getDatetime;
exports.getDate = getDate;
exports.getFullYear = getFullYear;
exports.getTime = getTime;
exports.convert = convert;

var _locals = require('../locals');

function clone(d) {
  return new Date(d.getTime());
}

function addDays(d, days) {
  var newDate = clone(d);
  newDate.setDate(d.getDate() + days);
  return newDate;
}

function addMonths(d, months) {
  var newDate = clone(d);
  newDate.setMonth(d.getMonth() + months);
  return newDate;
}

function getFirstDayOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function getDaysInMonth(d) {
  var resultDate = getFirstDayOfMonth(d);

  resultDate.setMonth(resultDate.getMonth() + 1);
  resultDate.setDate(resultDate.getDate() - 1);

  return resultDate.getDate();
}

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

function getWeekArray(d) {
  var dayArray = [];
  var daysInMonth = getDaysInMonth(d);
  var daysInWeek = void 0;
  var emptyDays = void 0;
  var firstDayOfWeek = void 0;
  var week = void 0;
  var weekArray = [];

  for (var i = 1; i <= daysInMonth; i++) {
    dayArray.push(new Date(d.getFullYear(), d.getMonth(), i));
  }

  while (dayArray.length) {
    firstDayOfWeek = dayArray[0].getDay();
    daysInWeek = 7 - firstDayOfWeek;
    emptyDays = 7 - daysInWeek;
    week = dayArray.splice(0, daysInWeek);

    for (var j = 0; j < emptyDays; j++) {
      week.unshift(null);
    }

    weekArray.push(week);
  }

  return weekArray;
}

function isEqualDate(d1, d2) {
  if (!d1 || !d2 || !(d1 instanceof Date) || !(d2 instanceof Date)) {
    return false;
  }

  return d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function isEqual(d1, d2) {
  if (!d1 || !d2 || !(d1 instanceof Date) || !(d2 instanceof Date)) {
    return false;
  }

  return d1.getTime() === d2.getTime();
}

function monthDiff(d1, d2) {
  var m = void 0;
  m = (d1.getFullYear() - d2.getFullYear()) * 12;
  m += d1.getMonth();
  m -= d2.getMonth();
  return m;
}

function format(date, fmt) {
  if (!date) {
    return '';
  }
  if (!(date instanceof Date)) {
    date = convert(date);
  }

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

function getDatetime(d) {
  return format(d, (0, _locals.getLang)('datetime.format.datetime'));
}

function getDate(d) {
  return format(d, (0, _locals.getLang)('datetime.format.date'));
}

function getFullYear(d) {
  return format(d, (0, _locals.getLang)('datetime.format.year'));
}

function getTime(d) {
  return format(d, (0, _locals.getLang)('datetime.format.time'));
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