var gulp        = require('gulp');
var compass     = require('gulp-compass');
var cleanCSS    = require('gulp-clean-css');
var rename      = require('gulp-rename');
var del         = require('del');
var vinylPaths  = require('vinyl-paths');

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
        ).pipe(vinylPaths(del)) // 清除临时文件
        .pipe(cleanCSS());

      if(cfg.name){
        pipeObj.pipe(rename(cfg.name + ".min.css"))
      }

      pipeObj.pipe(gulp.dest(cfg.rbConfig.css))
        .on('end', function(){
          console.log("完成构建 " + cfg.name + " 样式文件！");
        });
    });
  });
});
