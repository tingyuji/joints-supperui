'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioGroup = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _obj = require('../../utils/obj');

var _radio = require('./radio');

var _radio2 = _interopRequireDefault(_radio);

var _Form = require('../Form');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function transformValue(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== 'string') {
    value = value.toString();
  }

  return value;
}

var RadioGroup = exports.RadioGroup = function (_Component) {
  _inherits(RadioGroup, _Component);

  function RadioGroup(props) {
    _classCallCheck(this, RadioGroup);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RadioGroup).call(this, props));

    _this.state = {
      value: transformValue(props.value),
      data: _this.formatData(props.data)
    };
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(RadioGroup, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        this.setValue(nextProps.value);
      }
      if (!(0, _obj.deepEqual)(nextProps.data, this.props.data)) {
        this.setState({ data: this.formatData(nextProps.data) });
      }
    }
  }, {
    key: 'formatData',
    value: function formatData(data) {
      data = (0, _obj.toTextValue)(data, this.props.textTpl, this.props.valueTpl);
      _react.Children.map(this.props.children, function (child) {
        if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object') {
          var position = child.props.position;
          if (position === undefined) {
            position = data.length;
          }
          data = [].concat(_toConsumableArray(data.slice(0, position)), [{
            $value: child.props.value,
            $text: child.props.children || child.props.text,
            $key: (0, _obj.hashcode)(child.props.value + '-' + child.props.text)
          }], _toConsumableArray(data.slice(position)));
        }
      });
      return data;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      value = transformValue(value);
      this.setState({ value: value });
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.state.value;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(value) {
      if (this.props.readOnly) {
        return;
      }

      this.setState({ value: value });
      var change = this.props.onChange;
      if (change) {
        change(value);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var fetchStatus = _props.fetchStatus;
      var inline = _props.inline;
      var readOnly = _props.readOnly;


      className = (0, _classnames2.default)(className, 'cmpt-radio-group', { 'cmpt-inline': inline });
      var items = this.state.data.map(function (item) {
        return _react2.default.createElement(_radio2.default, { key: item.$key,
          onClick: this.handleChange,
          readOnly: readOnly,
          checked: this.state.value === item.$value,
          text: item.$text,
          value: item.$value
        });
      }, this);

      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: className },
        items
      );
    }
  }]);

  return RadioGroup;
}(_react.Component);

RadioGroup.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.array]),
  className: _react.PropTypes.string,
  data: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]),
  fetchStatus: _react.PropTypes.string,
  inline: _react.PropTypes.bool,
  onChange: _react.PropTypes.func,
  readOnly: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  textTpl: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  value: _react.PropTypes.any,
  valueTpl: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func])
};

RadioGroup.defaultProps = {
  textTpl: '{text}',
  valueTpl: '{id}',
  inline: true
};

module.exports = (0, _Form.register)(RadioGroup, 'radio-group');