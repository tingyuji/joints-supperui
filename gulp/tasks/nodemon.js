var gulp     = require('gulp');
var nodemon  = require('gulp-nodemon');

var handleErrors = require('../util/handleErrors');
var config = require('../config');

Object.keys(config.tasklines).forEach(function(tl){
  var tlConfig = config.tasklines[tl].nodemon;

  gulp.task('nodemon-' + tl, function(cb) {
    return startDemon(tlConfig, function(){
      console.log("正在启动....");
    });
  });
});

// 启动demon
function startDemon(cfg, cb){
  var started = false;

  return nodemon(cfg).on('start', function onStart(){
    // ensure start only got called once
    if (!started) {
      cb();
      started = true; 
    } 
  }).on('restart', function onRestart() {
    console.log("正在重启...");
  });
}
