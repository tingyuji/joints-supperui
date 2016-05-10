'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('../Grid/util');

var _enhance = require('../Form/enhance');

var _dom = require('../../utils/dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Textarea = function (_Component) {
  _inherits(Textarea, _Component);

  function Textarea(props) {
    _classCallCheck(this, Textarea);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Textarea).call(this, props));

    _this.state = {
      value: props.value,
      rows: props.rows
    };

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleTrigger = _this.handleTrigger.bind(_this);
    return _this;
  }

  _createClass(Textarea, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var el = this.element;

      if (this.props.autoHeight) {
        this.lineHeight = (0, _dom.getLineHeight)(el);
        this.paddingHeight = parseInt((0, _dom.computedStyle)(el, 'paddingTop')) + parseInt((0, _dom.computedStyle)(el, 'paddingBottom'));
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var value = nextProps.value;
      if (value !== this.props.value && value !== this.state.value) {
        this.setState({ value: value });
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.props.autoHeight && this.autoHeight();

      var value = event.target.value;
      this.setState({ value: value });

      if (this.props.trigger === 'change') {
        this.handleTrigger(event);
      }
    }
  }, {
    key: 'handleTrigger',
    value: function handleTrigger(event) {
      var value = event.target.value;
      this.props.onChange(value, event);
    }
  }, {
    key: 'autoHeight',
    value: function autoHeight() {
      var el = this.element;
      var scrH = void 0;
      var rows = void 0;

      el.style.height = '1px';
      scrH = el.scrollHeight - this.paddingHeight;
      rows = Math.floor(scrH / this.lineHeight);

      if (rows >= this.props.rows) {
        this.setState({
          rows: rows
        });
      }
      el.style.height = 'auto';
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var className = _props.className;
      var grid = _props.grid;
      var style = _props.style;
      var autoHeight = _props.autoHeight;
      var trigger = _props.trigger;

      var other = _objectWithoutProperties(_props, ['className', 'grid', 'style', 'autoHeight', 'trigger']);

      var _state = this.state;
      var rows = _state.rows;
      var value = _state.value;


      style.minHeight = 'auto';
      if (autoHeight) {
        style.resize = 'none';
      }

      var props = {
        className: (0, _classnames2.default)(className, (0, _util.getGrid)(grid), 'cmpt-form-control'),
        onChange: this.handleChange,
        style: style,
        rows: rows,
        value: value
      };

      if (trigger !== 'change') {
        var handle = 'on' + trigger.charAt(0).toUpperCase() + trigger.slice(1);
        props[handle] = this.handleTrigger;
      }

      return _react2.default.createElement('textarea', _extends({ ref: function ref(c) {
          return _this2.element = c;
        } }, other, props));
    }
  }]);

  return Textarea;
}(_react.Component);

Textarea.propTypes = {
  autoHeight: _react.PropTypes.bool,
  className: _react.PropTypes.string,
  grid: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object]),
  onChange: _react.PropTypes.func,
  placeholder: _react.PropTypes.string,
  rows: _react.PropTypes.number,
  style: _react.PropTypes.object,
  trigger: _react.PropTypes.string,
  value: _react.PropTypes.any
};

Textarea.defaultProps = {
  style: {},
  grid: 1,
  rows: 10,
  trigger: 'blur',
  value: ''
};

module.exports = (0, _enhance.register)(Textarea, ['textarea']);