'use strict';

var gulp = require('gulp');

var config = require('../config');

Object.keys(config.tasklines).forEach(function(tl){
  var tlConfig = config.tasklines[tl];

  var tasks = ["build-" + tl];

  if(tlConfig.nodemon){
    tasks.push("nodemon-" + tl);
  }

  gulp.task(tl, tasks);
});