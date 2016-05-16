'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormSubmit = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _button = require('../button');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormSubmit = exports.FormSubmit = function (_Component) {
  _inherits(FormSubmit, _Component);

  function FormSubmit() {
    _classCallCheck(this, FormSubmit);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(FormSubmit).apply(this, arguments));
  }

  _createClass(FormSubmit, [{
    key: 'render',
    value: function render() {
      var props = this.props;

      var children = props.children;
      var content = void 0;
      if (Array.isArray(children)) {
        content = props.disabled ? children[1] : children[0];
      } else {
        content = children;
      }

      return _react2.default.createElement(
        'div',
        { style: props.style, className: 'cmpt-control-group' },
        _react2.default.createElement(
          _button.Button,
          { type: 'submit',
            status: 'primary',
            onClick: props.onClick,
            disabled: props.disabled },
          content
        )
      );
    }
  }]);

  return FormSubmit;
}(_react.Component);

FormSubmit.propTypes = {
  children: _react.PropTypes.any,
  disabled: _react.PropTypes.bool,
  onClick: _react.PropTypes.func,
  style: _react.PropTypes.object
};

module.exports = FormSubmit;