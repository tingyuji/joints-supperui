'use strict';

import { Obj } from 'supperutils';

const {merge} = Obj;

let langDataMap = {
  'zh-cn': require('./zh-cn')
};

let langData = null;

export let LOCATION = 'zh-cn';

export function getLang (path, def) {
  if(!langData){
    setLocation(LOCATION);
  }

  let result = langData || {};

  if (path === undefined) {
    return result;
  }

  if (!path || typeof path !== 'string') {
    return undefined;
  }

  let paths = path.split('.');

  for (let i = 0, count = paths.length; i < count; i++) {
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

export function setLocation (location) {
  LOCATION = location;

  if(langDataMap[location] && langDataMap[location]["default"]){
    langData = langDataMap[location]["default"];
  }
}
