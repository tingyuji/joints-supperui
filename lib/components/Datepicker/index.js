'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Datetime = require('./Datetime');

var _Datetime2 = _interopRequireDefault(_Datetime);

var _supperutils = require('supperutils');

var _enhance = require('../Form/enhance');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var shallowEqual = _supperutils.Obj.shallowEqual;

var Datepicker = function (_React$Component) {
  _inherits(Datepicker, _React$Component);

  function Datepicker(props) {
    _classCallCheck(this, Datepicker);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Datepicker).call(this, props));
  }

  _createClass(Datepicker, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !shallowEqual(this.props, nextProps);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_Datetime2.default, this.props);
    }
  }]);

  return Datepicker;
}(_react2.default.Component);

module.exports = (0, _enhance.register)(Datepicker, ['datetime', 'time', 'date'], { valueType: 'datetime' });