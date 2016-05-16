var gulp        = require('gulp');
var less     = require('gulp-less');

var handleErrors = require('../util/handleErrors');
var config = require('../config');

Object.keys(config.tasklines).forEach(function(tl){
  gulp.task('less-' + tl, function() {
    var tlConfig = config.tasklines[tl].less;

    var tlConfigs = [];

    if(Array.isArray(tlConfig)){
      tlConfigs = tlConfig;
    } else {
      tlConfigs = [tlConfig];
    }

    var pipeObj = null;

    tlConfigs.forEach(function(cfg){
      pipeObj = gulp.src(cfg.src)
        .pipe(
          less(cfg.bundleConfig)
          .on('error', handleErrors)
        ).pipe(gulp.dest(cfg.dest));
    });
  });
});
