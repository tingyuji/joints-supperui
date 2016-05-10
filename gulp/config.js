'use strict';

var extend = require('extend');

var dest     = './dest',
    src      = './src',
    docs     = './docs',
    examples = './examples',
    themes   = './src/themes';

var config = {
  tasklines: {
    "default": {
      markup: {
        src: themes + "/default/www/**",
        dest: dest
      },

      compass: {
        src: themes + "/default/sass/**/*.scss",
        rbConfig: {
          sass: themes + "/default/sass",
          css: dest + "/css",
          image: dest + "/images"
        }
      }
    }
  }
}

module.exports = config;
