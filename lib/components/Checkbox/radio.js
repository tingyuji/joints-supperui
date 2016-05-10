'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Radio = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Radio = exports.Radio = function (_Component) {
  _inherits(Radio, _Component);

  function Radio(props) {
    _classCallCheck(this, Radio);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Radio).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(Radio, [{
    key: 'handleClick',
    value: function handleClick() {
      if (this.props.onClick) {
        this.props.onClick(this.props.value, this.props.index);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'label',
        { style: this.props.style, className: 'cmpt-radio' },
        _react2.default.createElement('input', { ref: 'input',
          type: 'radio',
          disabled: this.props.readOnly,
          onChange: function onChange() {},
          onClick: this.handleClick,
          checked: this.props.checked,
          value: this.props.value
        }),
        _react2.default.createElement(
          'span',
          null,
          this.props.text
        )
      );
    }
  }]);

  return Radio;
}(_react.Component);

Radio.propTypes = {
  checked: _react.PropTypes.bool,
  index: _react.PropTypes.number,
  onClick: _react.PropTypes.func,
  readOnly: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  text: _react.PropTypes.any,
  value: _react.PropTypes.any
};

exports.default = Radio;