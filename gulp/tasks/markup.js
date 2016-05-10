var gulp = require('gulp');
var config = require('../config');

Object.keys(config.tasklines).forEach(function(tl){
  var tlConfig = config.tasklines[tl].markup;

  gulp.task('markup-' + tl, function() {
    return gulp.src(tlConfig.src)
      .pipe(gulp.dest(tlConfig.dest));
  });
});