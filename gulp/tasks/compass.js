var gulp        = require('gulp');
var compass     = require('gulp-compass');
var handleErrors = require('../util/handleErrors');
var config = require('../config');

Object.keys(config.tasklines).forEach(function(tl){
  gulp.task('compass-' + tl, function() {
    var tlConfig = config.tasklines[tl].compass;

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
          compass(cfg.rbConfig)
          .on('error', handleErrors)
        );
    });
  });
});
