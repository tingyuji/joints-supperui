'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _supperutils = require('supperutils');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var shallowEqual = _supperutils.Obj.shallowEqual;

var Pair = function (_React$Component) {
  _inherits(Pair, _React$Component);

  function Pair(props) {
    _classCallCheck(this, Pair);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pair).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Pair, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !shallowEqual(nextProps, this.props) || !shallowEqual(this.state, nextState);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var names = _props.names;
      var min = _props.min;
      var max = _props.max;
      var con = _props.con;

      var other = _objectWithoutProperties(_props, ['names', 'min', 'max', 'con']);

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_index2.default, _extends({ min: min, name: names[0] }, other, {
          max: this.state.second,
          onChange: function onChange(first) {
            return _this2.setState({ first: first });
          }
        })),
        con,
        _react2.default.createElement(_index2.default, _extends({ max: max, name: names[1] }, other, {
          min: this.state.first,
          onChange: function onChange(second) {
            return _this2.setState({ second: second });
          }
        }))
      );
    }
  }]);

  return Pair;
}(_react2.default.Component);

;

Pair.isFormItem = true;

Pair.propTypes = {
  con: _react.PropTypes.any,
  max: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.object]),
  min: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.object]),
  names: _react.PropTypes.array
};

Pair.defaultProps = {
  con: '-',
  names: []
};

module.exports = Pair;