/**
 * 应用框架页面
 * 
 * Created by Ray on 2016-03-30
 */

"use strict"

import ReactDom from 'react-dom';

global.uiRequire = function (src) {
  if (src) {
    return require('../../../lib/components/' + src)
  } else {
    return require('../../../lib/components')
  }
}

const AppRoutes = require('./appRoutes.jsx');

ReactDom.render(
  AppRoutes, document.getElementById('app')
);




