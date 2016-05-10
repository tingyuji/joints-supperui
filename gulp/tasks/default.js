'use strict';

var gulp = require('gulp');

var config = require('../config');

Object.keys(config.tasklines).forEach(function(tl){
  gulp.task(tl, function(){
    console.log();
    console.log(new Date());
    console.log("starting task line " + tl + " ...");
    console.log();

    gulp.task(tl, ['watch-' +  tl]);
  });
});