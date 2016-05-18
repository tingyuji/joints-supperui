import SupperUI from './components';
import React    from 'react';
import ReactDOM from 'react-dom';

;(function() {
  var g;
  if (typeof window !== "undefined") {
    g = window;
  } else if (typeof global !== "undefined") {
    g = global;
  } else if (typeof self !== "undefined") {
    g = self;
  } else {
    // works providing we're not in "use strict";
    // needed for Java 8 Nashorn
    // see https://github.com/facebook/react/issues/3037
    g = this;
  }

  g.React    = React;
  g.ReactDOM = ReactDOM;
  g.SupperUI = SupperUI;
})();
