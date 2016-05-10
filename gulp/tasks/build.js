var gulp = require('gulp');
var config = require('../config');

Object.keys(config.tasklines).forEach(function(tl){
  gulp.task('build-' + tl, ['compass-' + tl, 'markup-' + tl]);
});