'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckboxGroup = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _checkbox = require('./checkbox');

var _str = require('../../utils/str');

var _obj = require('../../utils/obj');

var _Form = require('../Form');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckboxGroup = exports.CheckboxGroup = function (_Component) {
  _inherits(CheckboxGroup, _Component);

  function CheckboxGroup(props) {
    _classCallCheck(this, CheckboxGroup);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CheckboxGroup).call(this, props));

    var values = (0, _str.toArray)(props.value, props.sep);
    _this.state = {
      value: values,
      data: _this.formatData(props.data, values)
    };
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(CheckboxGroup, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _isValueChanged = !(0, _obj.deepEqual)(nextProps.value, this.props.value);
      var _isDataChanged = !(0, _obj.deepEqual)(nextProps.data, this.getRealData());

      if (_isDataChanged) {
        this.setState({ data: this.formatData(nextProps.data) }, function () {
          if (_isValueChanged) {
            this.setValue(nextProps.value);
          }
        });
      } else if (_isValueChanged) {
        this.setValue(nextProps.value);
      }
    }
  }, {
    key: 'getRealData',
    value: function getRealData() {
      var _data = (0, _obj.clone)(this.props.data);

      delete _data.$checked;
      delete _data.$value;
      delete _data.$text;
      delete _data.$key;

      return _data;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      value = (0, _str.toArray)(value, this.props.sep);
      if (this.state) {
        var data = this.state.data.map(function (d) {
          d.$checked = value.indexOf(d.$value) >= 0;
          return d;
        });
        this.setState({ value: value, data: data });
      } else {
        this.setState({ value: value });
      }
    }
  }, {
    key: 'formatData',
    value: function formatData(data) {
      var value = arguments.length <= 1 || arguments[1] === undefined ? this.state.value : arguments[1];

      data = (0, _obj.toTextValue)(data, this.props.textTpl, this.props.valueTpl).map(function (d) {
        d.$checked = value.indexOf(d.$value) >= 0;
        return d;
      });

      _react.Children.map(this.props.children, function (child) {
        if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object') {
          var position = child.props.position;
          if (position === undefined) {
            position = data.length;
          }
          data = [].concat(_toConsumableArray(data.slice(0, position)), [{
            $checked: value.indexOf(child.props.checkValue) >= 0,
            $value: child.props.checkValue,
            $text: child.props.children || child.props.text,
            $key: (0, _obj.hashcode)(child.props.checkValue + '-' + child.props.text)
          }], _toConsumableArray(data.slice(position)));
        }
      });
      return data;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      var sep = arguments.length <= 0 || arguments[0] === undefined ? this.props.sep : arguments[0];
      var data = arguments.length <= 1 || arguments[1] === undefined ? this.state.data : arguments[1];

      var value = [],
          raw = [];
      data.forEach(function (d) {
        if (d.$checked) {
          value.push(d.$value);
          raw.push(d);
        }
      });

      if (sep && typeof sep === 'string') {
        value = value.join(sep);
      } else if (typeof sep === 'function') {
        value = sep(raw);
      }

      return value;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(value, checked, index) {
      var data = this.state.data;
      data[index].$checked = checked;
      value = this.getValue(this.props.sep, data);

      this.setState({ value: value, data: data });

      if (this.props.onChange) {
        this.props.onChange(value, this, data[index]);
      }
    }
  }, {
    key: 'renderItems',
    value: function renderItems() {
      var _this2 = this;

      return this.state.data.map(function (item, i) {
        return _react2.default.createElement(_checkbox.Checkbox, { key: item.$key,
          index: i,
          readOnly: _this2.props.readOnly,
          checked: item.$checked,
          onChange: _this2.handleChange,
          text: item.$text,
          checkValue: item.$value
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var inline = _props.inline;


      className = (0, _classnames2.default)(className, 'cmpt-checkbox-group', {
        'cmpt-inline': inline,
        'cmpt-block': !inline
      });

      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: className },
        this.renderItems()
      );
    }
  }]);

  return CheckboxGroup;
}(_react.Component);

CheckboxGroup.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.array]),
  className: _react.PropTypes.string,
  data: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]),
  fetchStatus: _react.PropTypes.string,
  inline: _react.PropTypes.bool,
  onChange: _react.PropTypes.func,
  readOnly: _react.PropTypes.bool,
  sep: _react.PropTypes.string,
  style: _react.PropTypes.object,
  textTpl: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  value: _react.PropTypes.any,
  valueTpl: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func])
};

CheckboxGroup.defaultProps = {
  data: [],
  sep: ',',
  inline: true,
  textTpl: '{text}',
  valueTpl: '{id}'
};

module.exports = (0, _Form.register)(CheckboxGroup, 'checkbox-group', { valueType: 'array' });