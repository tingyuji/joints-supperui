/* browserify task
   ---------------
   Bundle javascripty things with browserify!
   This task is set up to generate multiple separate bundles, from
   different sources, and to use Watchify when run from the default task.
   See browserify.bundleConfigs in gulp/config.js
*/

var gulp         = require('gulp');
var browserify   = require('browserify');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var babelify     = require('babelify');
var config = require('../config');

var buffer = require('vinyl-buffer');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

function browserifyTask(tl, config){
  gulp.task('browserify-' + tl, function(callback) {
    var bundleQueue = config.bundleConfigs.length;

    var browserifyThis = function(bundleConfig) {

      var bundler = browserify({
        // Required watchify args
        cache: {}, packageCache: {}, fullPaths: false,
        // Specify the entry point of your tl
        entries: bundleConfig.entries,
        // Add file extentions to make optional in your requires
        extensions: config.extensions,
        // Enable source maps!
        debug: config.debug
      });

      var bundle = function() {
        // Log when bundling starts
        bundleLogger.start(bundleConfig.outputName);

        var bundled = bundler
          .bundle()
          // Report compile errors
          .on('error', handleErrors)
          // Use vinyl-source-stream to make the
          // stream gulp compatible. Specifiy the
          // desired output filename here.
          .pipe(source(bundleConfig.outputName))
          // Specify the output destination
          .pipe(gulp.dest(bundleConfig.dest));

        if(bundleConfig.compress === true){
          bundled = bundled.pipe(buffer())
            .pipe(stripDebug())
            .pipe(uglify())
            .pipe(rename(bundleConfig.compressedOutputName))
            .pipe(gulp.dest(bundleConfig.dest))
        }
        
        bundled.on('end', reportFinished);
      };

      bundler.transform(babelify.configure());

      if (global.isWatching) {
        // Wrap with watchify and rebundle on changes
        bundler = watchify(bundler);
        // Rebundle on update
        bundler.on('update', bundle);
      }

      var reportFinished = function() {
        // Log when bundling completes
        bundleLogger.end(bundleConfig.outputName);

        if (bundleQueue) {
          bundleQueue--;
          if (bundleQueue === 0) {
            // If queue is empty, tell gulp the task is complete.
            // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
            callback();
          }
        }
      };

      return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    config.bundleConfigs.forEach(browserifyThis);
  });
}

Object.keys(config.tasklines).forEach(function(tl){
  var tlConfig = config.tasklines[tl].browserify;

  if(tlConfig){
    browserifyTask(tl, tlConfig);
  }
});
