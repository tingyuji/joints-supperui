'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LazyRenderBox = _react2.default.createClass({
  displayName: 'LazyRenderBox',

  propTypes: {
    children: _react.PropTypes.any,
    className: _react.PropTypes.string,
    visible: _react.PropTypes.bool,
    hiddenClassName: _react.PropTypes.string
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return nextProps.hiddenClassName || nextProps.visible;
  },
  render: function render() {
    if (this.props.hiddenClassName) {
      var className = this.props.className;
      if (!this.props.visible) {
        className += ' ' + this.props.hiddenClassName;
      }
      return _react2.default.createElement('div', _extends({}, this.props, { className: className }));
    }
    if (_react2.default.Children.count(this.props.children) > 1) {
      return _react2.default.createElement('div', this.props);
    }
    return _react2.default.Children.only(this.props.children);
  }
});

exports.default = LazyRenderBox;