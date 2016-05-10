'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Checkbox = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Form = require('../Form');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Checkbox = exports.Checkbox = function (_Component) {
  _inherits(Checkbox, _Component);

  function Checkbox(props) {
    _classCallCheck(this, Checkbox);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Checkbox).call(this, props));

    _this.state = {
      checked: !!props.checked || props.value === props.checkValue
    };
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(Checkbox, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.checked !== this.props.checked && nextProps.checked !== this.state.checked) {
        this.handleChange(null, nextProps.checked);
      }
      if (nextProps.value !== this.props.value || nextProps.checkValue !== this.props.checkValue) {
        this.setValue(nextProps.value, nextProps.checkValue);
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event, checked) {
      var _this2 = this;

      if (this.props.readOnly) {
        return;
      }

      if (event) {
        checked = event.target.checked;
      }
      this.setState({ checked: checked });
      setTimeout(function () {
        if (_this2.props.onChange) {
          var value = checked ? _this2.props.checkValue : undefined;
          _this2.props.onChange(value, checked, _this2.props.index);
        }
      }, 0);
    }

    /*
    getValue () {
      return this._input.checked ? (this.props.value || true) : false;
    }
    */

  }, {
    key: 'setValue',
    value: function setValue(value) {
      var checkValue = arguments.length <= 1 || arguments[1] === undefined ? this.props.checkValue : arguments[1];

      this.setState({ checked: value === checkValue });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'label',
        { style: this.props.style, className: (0, _classnames2.default)(this.props.className, 'cmpt-checkbox') },
        _react2.default.createElement('input', { ref: function ref(c) {
            return _this3._input = c;
          },
          type: 'checkbox',
          disabled: this.props.readOnly,
          onChange: this.handleChange,
          checked: this.state.checked,
          value: this.props.value
        }),
        this.props.text,
        this.props.children
      );
    }
  }]);

  return Checkbox;
}(_react.Component);

Checkbox.propTypes = {
  checkValue: _react.PropTypes.any,
  checked: _react.PropTypes.bool,
  children: _react.PropTypes.any,
  className: _react.PropTypes.string,
  index: _react.PropTypes.number,
  onChange: _react.PropTypes.func,
  position: _react.PropTypes.number,
  readOnly: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  text: _react.PropTypes.any,
  value: _react.PropTypes.any
};

Checkbox.defaultProps = {
  checkValue: true
};

module.exports = (0, _Form.register)(Checkbox, 'checkbox');

// export for CheckboxGroup
module.exports.Checkbox = Checkbox;