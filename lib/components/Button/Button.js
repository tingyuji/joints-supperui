'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('../Grid/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_Component) {
  _inherits(Button, _Component);

  function Button(props) {
    _classCallCheck(this, Button);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Button).call(this, props));

    _this.state = {
      disabled: props.disabled,
      show: null
    };
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(Button, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.disabled !== this.props.disabled) {
        this.setState({ disabled: nextProps.disabled });
      }
    }
  }, {
    key: 'disable',
    value: function disable(elem) {
      this.setState({ disabled: true, show: elem });
    }
  }, {
    key: 'enable',
    value: function enable(elem) {
      this.setState({ disabled: false, show: elem });
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      if (this.props.onClick) {
        this.props.onClick();
      }
      if (this.props.once) {
        this.disable();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var status = this.props.status;
      if (status) {
        status = 'cmpt-button-' + status;
      }

      var className = (0, _classnames2.default)(this.props.className, (0, _util.getGrid)(this.props.grid), 'cmpt-button', status);

      return _react2.default.createElement(
        'button',
        { onClick: this.handleClick,
          style: this.props.style,
          disabled: this.state.disabled,
          className: className,
          type: this.props.type || 'button' },
        this.state.show || this.props.children
      );
    }
  }]);

  return Button;
}(_react.Component);

Button.propTypes = {
  children: _react.PropTypes.any,
  className: _react.PropTypes.string,
  disabled: _react.PropTypes.bool,
  grid: _react.PropTypes.object,
  onClick: _react.PropTypes.func,
  once: _react.PropTypes.bool,
  status: _react.PropTypes.string,
  style: _react.PropTypes.object,
  type: _react.PropTypes.oneOf(['submit', 'button'])
};

module.exports = Button;