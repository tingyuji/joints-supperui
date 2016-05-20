'use strict';

var _components = require('./components');

var _components2 = _interopRequireDefault(_components);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;(function () {
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

  g.React = _react2.default;
  g.ReactDOM = _reactDom2.default;
  g.SupperUI = _components2.default;
})();