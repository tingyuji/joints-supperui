'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var poslist = require('./util').getPositions(12, 50, -90);

var Clock = function (_Component) {
  _inherits(Clock, _Component);

  function Clock(props) {
    _classCallCheck(this, Clock);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Clock).call(this, props));

    _this.state = {
      current: props.current,
      stage: props.stage || 'clock',
      active: props.active,
      am: props.current.getHours() < 12
    };
    _this.close = _this.close.bind(_this);
    return _this;
  }

  _createClass(Clock, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.current !== this.props.current) {
        this.setState({ current: nextProps.current, am: nextProps.current.getHours() < 12 });
      }
    }
  }, {
    key: 'changeTimeStage',
    value: function changeTimeStage(stage) {
      this.setState({ stage: stage, active: true });
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      var d = {};
      d[this.state.stage] = value;
      this.props.onTimeChange(d);
    }
  }, {
    key: 'close',
    value: function close() {
      if (!this.props.timeOnly) {
        this.setState({ active: false });
      }
    }
  }, {
    key: 'getRotate',
    value: function getRotate(type) {
      var current = this.state.current,
          value = void 0,
          max = type === 'hour' ? 12 : 60;

      switch (type) {
        case 'hour':
          value = current.getHours() + current.getMinutes() / 60;
          break;
        case 'minute':
          value = current.getMinutes() + current.getSeconds() / 60;
          break;
        case 'second':
          value = current.getSeconds();
          break;
      }

      value = value * 360 / max - 90;
      return 'rotate(' + value + 'deg)';
    }
  }, {
    key: 'renderPointer',
    value: function renderPointer() {
      var stage = this.state.stage;

      var pointer = function pointer(type, context) {
        var rotate = context.getRotate(type);
        return _react2.default.createElement('div', { style: { transform: rotate, WebkitTransform: rotate }, className: (0, _classnames2.default)(type, { active: stage === type }) });
      };

      return _react2.default.createElement(
        'div',
        { className: 'pointer' },
        pointer('hour', this),
        pointer('minute', this),
        pointer('second', this)
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var steps = [],

      //current = this.state.current,
      stage = this.state.stage,
          step = stage === 'hour' || stage === 'clock' ? 1 : 5;

      for (var i = 0, s; i < 12; i++) {
        s = i * step;
        if (!this.state.am && stage === 'hour') {
          s += 12;
        }
        steps.push(s);
      }

      var sets = steps.map(function (s, i) {
        var _this2 = this;

        var pos = poslist[i],
            left = pos[0] + '%',
            top = pos[1] + '%';
        return _react2.default.createElement(
          'div',
          { onClick: function onClick() {
              _this2.setValue(s);
            }, className: (0, _classnames2.default)('clock-set'), key: i, style: { left: left, top: top } },
          s
        );
      }, this);

      var className = (0, _classnames2.default)('clock-wrapper', { active: this.state.active });

      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement('div', { onClick: this.close, className: 'clock-overlay' }),
        !this.props.timeOnly && _react2.default.createElement(
          'div',
          { onClick: this.close, className: 'clock-close' },
          _react2.default.createElement('i', { className: 'icon close' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'clock' },
          _react2.default.createElement(
            'div',
            { className: 'clock-inner' },
            sets
          ),
          this.renderPointer(),
          stage === 'hour' && _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'div',
              { onClick: function onClick() {
                  _this3.setState({ am: true });
                }, className: (0, _classnames2.default)('time-am', { active: this.state.am }) },
              'AM'
            ),
            _react2.default.createElement(
              'div',
              { onClick: function onClick() {
                  _this3.setState({ am: false });
                }, className: (0, _classnames2.default)('time-pm', { active: !this.state.am }) },
              'PM'
            )
          )
        )
      );
    }
  }]);

  return Clock;
}(_react.Component);

Clock.propTypes = {
  active: _react.PropTypes.bool,
  current: _react.PropTypes.instanceOf(Date),
  onTimeChange: _react.PropTypes.func,
  stage: _react.PropTypes.string,
  timeOnly: _react.PropTypes.bool
};

exports.default = Clock;