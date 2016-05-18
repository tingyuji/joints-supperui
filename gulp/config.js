'use strict';

var extend = require('extend');

var dest     = './dest',
    build    = './build',
    src      = './src',
    docs     = './docs',
    examples = './examples',
    themes   = './src/themes',
    test     = './test';

var config = {
  tasklines: {
    "default": {
      markup: {
        src: themes + "/default/www/**",
        dest: dest
      },

      browserify: {
        bundleConfigs: [{
          entries: src + '/index.jsx',
          dest: dest + "/js",
          externals: ['react', 'react-dom'],
          compress: true,
          outputName: 'supperui.js',
          compressedOutputName: 'supperui.min.js'
        }, {
          dest: dest + "/js",
          requires: ['react', 'react-dom'],
          compress: true,
          outputName: 'supperui-lib.js',
          compressedOutputName: 'supperui-lib.min.js'
        }],
        extensions: ['.jsx', '.js'],
      },

      compass: {
        src: themes + "/default/sass/**/*.scss",
        name: "joints-supperui",
        rbConfig: {
          sass: themes + "/default/sass",
          css: dest + "/css",
          image: dest + "/images"
        }
      }
    },

    "docs": {
      markup: {
        src: docs + "/src/www/**",
        dest: build + "/docs"
      },

      browserify: {
        // Enable source maps
        debug: true,
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [{
          entries: docs + '/src/client/app.jsx',
          dest: build + "/docs",
          outputName: 'app.js',
          // compress: true,
          // compressedOutputName: 'app.min.js'
        }],
        extensions: ['.jsx', '.js'],
      },

      // less: {
      //   src: docs + "/src/client/less/**/*.less",
      //   dest: build + "/docs/css",
      //   bundleConfig: {}
      // },

      nodemon: {
        execMap: {
          js: 'node-inspector & node --debug'
        },
        script: docs + '/src/server/bootstrap.js',
        ext: 'js jsx',
        env: { 'NODE_ENV': process.env.NODE_ENV || 'development', PORT: 16000 },
        ignore: [dest, build, src, examples, test],
        debug: true,
        verbose: true
      }
    }
  }
}

module.exports = config;
