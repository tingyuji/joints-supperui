'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeSet = function (_Component) {
  _inherits(TimeSet, _Component);

  function TimeSet(props) {
    _classCallCheck(this, TimeSet);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimeSet).call(this, props));

    _this.state = {
      value: props.value || 0,
      type: props.type
    };
    _this.changeStage = _this.changeStage.bind(_this);
    _this.add = _this.add.bind(_this);
    _this.sub = _this.sub.bind(_this);
    return _this;
  }

  _createClass(TimeSet, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        this.setState({ value: nextProps.value });
      }
    }
  }, {
    key: 'add',
    value: function add() {
      var value = this.state.value,
          max = this.props.type === 'hour' ? 24 : 60;
      value += 1;
      if (value >= max) {
        value = 0;
      }
      this.changeTime(value);
    }
  }, {
    key: 'sub',
    value: function sub() {
      var value = this.state.value,
          max = this.props.type === 'hour' ? 23 : 59;
      value -= 1;
      if (value < 0) {
        value = max;
      }
      this.changeTime(value);
    }
  }, {
    key: 'changeTime',
    value: function changeTime(value) {
      var d = {};
      d[this.props.type] = value;
      var success = this.props.onTimeChange(d);
      if (!success) {
        return;
      }
      this.setState({ value: value });
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.setState({ value: value });
    }
  }, {
    key: 'changeStage',
    value: function changeStage() {
      this.props.onStageChange(this.props.type);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { onClick: this.changeStage, className: 'time-set' },
        _react2.default.createElement(
          'div',
          { className: 'text' },
          _react2.default.createElement(
            'span',
            null,
            this.state.value
          ),
          _react2.default.createElement(
            'a',
            { onClick: this.add, className: 'add' },
            _react2.default.createElement('i', { className: 'icon angle-up' })
          ),
          _react2.default.createElement(
            'a',
            { onClick: this.sub, className: 'sub' },
            _react2.default.createElement('i', { className: 'icon angle-down' })
          )
        )
      );
    }
  }]);

  return TimeSet;
}(_react.Component);

TimeSet.propTypes = {
  onStageChange: _react.PropTypes.func,
  onTimeChange: _react.PropTypes.func,
  type: _react.PropTypes.string,
  value: _react.PropTypes.number
};

exports.default = TimeSet;