'use strict';

import {Dt}        from 'supperutils';

import { getLang } from '../locals';

export function getFullMonth (d) {
  let month = d.getMonth();
  return getLang('datetime.fullMonth')[month];
}

export function getShortMonth (d) {
  let month = d.getMonth();
  return getLang('datetime.shortMonth')[month];
}

export function getDayOfWeek (d) {
  let weekday = d.getDay();
  return getLang('datetime.weekday')[weekday];
}

export function getDatetime (d) {
  return Dt.format(d, getLang('datetime.format.datetime'));
}

export function getDate (d) {
  return Dt.format(d, getLang('datetime.format.date'));
}

export function getFullYear (d) {
  return Dt.format(d, getLang('datetime.format.year'));
}

export function getTime (d) {
  return Dt.format(d, getLang('datetime.format.time'));
}

// string, unixtimestamp convert to Date
export function convert (obj, def) {
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
