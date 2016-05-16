'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _dom = require('../../utils/dom');

var _dt = require('../../utils/dt');

var datetime = _interopRequireWildcard(_dt);

var _ClickAway2 = require('../_mixins/ClickAway');

var _ClickAway3 = _interopRequireDefault(_ClickAway2);

var _TimeSet = require('./TimeSet');

var _TimeSet2 = _interopRequireDefault(_TimeSet);

var _Clock = require('./Clock');

var _Clock2 = _interopRequireDefault(_Clock);

var _locals = require('../../locals');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DATETIME = 'datetime';
var DATE = 'date';
var TIME = 'time';

var Datetime = function (_ClickAway) {
  _inherits(Datetime, _ClickAway);

  function Datetime(props) {
    _classCallCheck(this, Datetime);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Datetime).call(this, props));

    var value = props.value;

    _this.state = {
      active: false,
      popup: false,
      stage: props.type === TIME ? 'clock' : 'day',
      current: datetime.convert(value, new Date()),
      value: datetime.convert(value, null)
    };

    _this.timeChange = _this.timeChange.bind(_this);
    _this.timeStageChange = _this.timeStageChange.bind(_this);
    _this.pre = _this.pre.bind(_this);
    _this.next = _this.next.bind(_this);
    _this.open = _this.open.bind(_this);
    _this.close = _this.close.bind(_this);
    return _this;
  }

  _createClass(Datetime, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setMinMax(this.props);
      if (this.props.timeOnly || this.props.dateOnly) {
        console.warn('timeOnly and dateOnly is deprecated, use type="date|time" instead.');
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.registerClickAway(this.close, this.refs.datepicker);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        this.setState({ value: datetime.convert(nextProps.value) });
      }
      this.setMinMax(nextProps);
    }
  }, {
    key: 'setMinMax',
    value: function setMinMax(props) {
      var zero = new Date(0),
          min = datetime.convert(props.min, zero).getTime(),
          max = datetime.convert(props.max, zero).getTime();
      this.setState({ min: min, max: max });
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      var value = this.state.value;
      if (!value) {
        return null;
      }

      // if dateOnly, remove time
      if (this.props.type === DATE) {
        value = new Date(value.getFullYear(), value.getMonth(), value.getDate());
      }

      if (this.props.unixtime) {
        // cut milliseconds
        return Math.ceil(value.getTime());
      } else {
        return this.formatValue(value);
      }
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      value = datetime.convert(value, null);
      this.setState({ value: value });
    }
  }, {
    key: 'formatValue',
    value: function formatValue(value) {
      if (this.props.format) {
        return datetime.format(value, this.props.format);
      }

      var format = datetime.getDatetime;
      if (this.props.type === DATE) {
        format = datetime.getDate;
      } else if (this.props.type === TIME) {
        format = datetime.getTime;
      }
      return format(value);
    }
  }, {
    key: 'open',
    value: function open() {
      var _this2 = this;

      if (this.props.readOnly || this.state.active) {
        return;
      }

      var today = new Date();
      // remove time
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      var picker = this.refs.datepicker;
      if (!picker.style) {
        picker.style = {};
      }
      picker.style.display = 'block';
      var height = (0, _dom.getOuterHeight)(picker);

      setTimeout(function () {
        _this2.setState({
          active: true,
          popup: (0, _dom.overView)(_this2.refs.datetime, height),
          current: _this2.state.value || today,
          stage: _this2.props.type === TIME ? 'clock' : 'day'
        });

        _this2.bindClickAway();

        if (_this2.props.type === TIME) {
          _this2.refs.clock.changeTimeStage('hour');
        }
      }, 0);
    }
  }, {
    key: 'close',
    value: function close() {
      var _this3 = this;

      this.setState({ active: false });
      this.unbindClickAway();
      if (this.refs.clock) {
        this.refs.clock.close();
      }
      setTimeout(function () {
        if (_this3.state.active === false) {
          if (!_this3.refs.datepicker.style) {
            _this3.refs.datepicker.style = {};
          }
          _this3.refs.datepicker.style.display = 'none';
        }
      }, 500);
    }
  }, {
    key: 'changeDate',
    value: function changeDate(obj) {
      var c = this.state.current,
          year = obj.year === undefined ? c.getFullYear() : obj.year,
          month = obj.month === undefined ? c.getMonth() : obj.month,
          day = obj.day === undefined ? c.getDate() : obj.day,
          hour = obj.hour === undefined ? c.getHours() : obj.hour,
          minute = obj.minute === undefined ? c.getMinutes() : obj.minute,
          second = obj.second === undefined ? c.getSeconds() : obj.second;

      var d = new Date(year, month, day, hour, minute, second);
      return d;
    }
  }, {
    key: 'stateChange',
    value: function stateChange(state, pop) {
      var _this4 = this;

      // setTimeout wait checkClickAway completed
      setTimeout(function () {
        _this4.setState(state);
        if (pop && _this4.props.onChange) {
          _this4.props.onChange(_this4.getValue());
        }
      }, 0);
    }
  }, {
    key: 'stageChange',
    value: function stageChange(stage) {
      this.stateChange({ stage: stage });
    }
  }, {
    key: 'yearChange',
    value: function yearChange(year) {
      var d = this.changeDate({ year: year, day: 1 });
      this.stateChange({ stage: 'month', current: d });
    }
  }, {
    key: 'monthChange',
    value: function monthChange(month) {
      var d = this.changeDate({ month: month, day: 1 });
      this.stateChange({ stage: 'day', current: d });
    }
  }, {
    key: 'dayChange',
    value: function dayChange(day) {
      var d = this.changeDate({
        year: day.getFullYear(),
        month: day.getMonth(),
        day: day.getDate()
      });
      this.stateChange({ value: d, current: d }, true);
      if (this.props.type === DATE) {
        this.close();
      }
    }
  }, {
    key: 'timeChange',
    value: function timeChange(time) {
      var d = this.changeDate(time),
          timestamp = d.getTime();
      var _state = this.state;
      var min = _state.min;
      var max = _state.max;


      var valid = true;
      if (min > 0) {
        valid = timestamp >= min;
      }
      if (valid && max > 0) {
        valid = timestamp <= max;
      }

      if (valid) {
        this.stateChange({ value: d, current: d }, true);
        return true;
      }

      return false;
    }
  }, {
    key: 'getTime',
    value: function getTime() {
      var current = this.state.current;

      return _react2.default.createElement(
        'div',
        { className: 'time-container' },
        _react2.default.createElement(_Clock2.default, { current: current, timeOnly: this.props.type === TIME, onTimeChange: this.timeChange, ref: 'clock' }),
        _react2.default.createElement(_TimeSet2.default, { onTimeChange: this.timeChange, onStageChange: this.timeStageChange, type: 'hour', value: current.getHours() }),
        _react2.default.createElement(_TimeSet2.default, { onTimeChange: this.timeChange, onStageChange: this.timeStageChange, type: 'minute', value: current.getMinutes() }),
        _react2.default.createElement(_TimeSet2.default, { onTimeChange: this.timeChange, onStageChange: this.timeStageChange, type: 'second', value: current.getSeconds() })
      );
    }
  }, {
    key: 'next',
    value: function next(stage) {
      var d = this.state.current;
      switch (stage) {
        case 'year':
          d = this.changeDate({ year: d.getFullYear() + 18, day: 1 });
          break;
        case 'month':
          d = this.changeDate({ year: d.getFullYear() + 1, day: 1 });
          break;
        case 'day':
          d = this.changeDate({ month: d.getMonth() + 1, day: 1 });
          break;
      }
      this.stateChange({ current: d });
    }
  }, {
    key: 'pre',
    value: function pre(stage) {
      var d = this.state.current;
      switch (stage) {
        case 'year':
          d = this.changeDate({ year: d.getFullYear() - 18, day: 1 });
          break;
        case 'month':
          d = this.changeDate({ year: d.getFullYear() - 1, day: 1 });
          break;
        case 'day':
          d = this.changeDate({ month: d.getMonth() - 1, day: 1 });
          break;
      }
      this.stateChange({ current: d });
    }
  }, {
    key: 'renderYears',
    value: function renderYears() {
      var _this5 = this;

      var year = this.state.current.getFullYear(),
          years = [],
          i = year - 8,
          j = year + 9;

      for (; i <= j; i++) {
        years.push(i);
      }

      var buttons = [];
      buttons.push(_react2.default.createElement(
        'button',
        { type: 'button', className: 'year', key: i - 1,
          onClick: function onClick() {
            _this5.pre('year');
          } },
        _react2.default.createElement('i', { className: 'year-left' }),
        _react2.default.createElement('i', { className: 'year-left' })
      ));

      years.forEach(function (y, i) {
        buttons.push(_react2.default.createElement(
          'button',
          { type: 'button', className: 'year', key: i,
            onClick: function onClick() {
              _this5.yearChange(y);
            } },
          y
        ));
      }, this);

      buttons.push(_react2.default.createElement(
        'button',
        { type: 'button', className: 'year', key: i + 1,
          onClick: function onClick() {
            _this5.next('year');
          } },
        _react2.default.createElement('i', { className: 'year-right' }),
        _react2.default.createElement('i', { className: 'year-right' })
      ));

      return buttons;
    }
  }, {
    key: 'renderMonths',
    value: function renderMonths() {
      return (0, _locals.getLang)('datetime.fullMonth').map(function (m, i) {
        var _this6 = this;

        return _react2.default.createElement(
          'button',
          { type: 'button', onClick: function onClick() {
              _this6.monthChange(i);
            }, key: i, className: 'month' },
          m
        );
      }, this);
    }
  }, {
    key: 'renderDays',
    value: function renderDays() {
      var _state2 = this.state;
      var value = _state2.value;
      var current = _state2.current;
      var min = _state2.min;
      var max = _state2.max;

      var year = current.getFullYear(),
          month = current.getMonth(),
          hour = current.getHours(),
          minute = current.getMinutes(),
          second = current.getSeconds(),
          monthFirst = new Date(year, month, 1),
          monthEnd = new Date(year, month + 1, 0),
          first = 1 - monthFirst.getDay(),
          end = Math.ceil((monthEnd.getDate() - first + 1) / 7) * 7,
          today = new Date(),
          days = [];

      for (var date, i = 0; i < end; i++) {
        date = new Date(year, month, i + first, hour, minute, second);
        days.push(date);
      }

      var isCurrent = value ? year === value.getFullYear() && month === value.getMonth() : false;
      var isToday = year === today.getFullYear() && month === today.getMonth();

      return days.map(function (d, i) {
        var _this7 = this;

        var className = (0, _classnames2.default)('day', {
          gray: d.getMonth() !== month,
          active: isCurrent && value.getDate() === d.getDate() && value.getMonth() === d.getMonth(),
          today: isToday && today.getDate() === d.getDate() && today.getMonth() === d.getMonth()
        });
        var disabled = false,
            speedTime = d.getTime();
        if (min > 0) {
          disabled = speedTime < min;
        }
        if (!disabled && max > 0) {
          disabled = speedTime > max;
        }

        return _react2.default.createElement(
          'button',
          { type: 'button', disabled: disabled,
            onClick: function onClick() {
              _this7.dayChange(d);
            }, key: i,
            className: className },
          d.getDate()
        );
      }, this);
    }
  }, {
    key: 'timeStageChange',
    value: function timeStageChange(type) {
      this.refs.clock.changeTimeStage(type);
    }
  }, {
    key: 'renderHeader',
    value: function renderHeader() {
      var _this8 = this;

      if (this.props.type === TIME) {
        return null;
      }

      var _state3 = this.state;
      var current = _state3.current;
      var stage = _state3.stage;

      var display = stage === 'day' ? 'block' : 'none';

      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: 'date-picker-header' },
        _react2.default.createElement(
          'a',
          { style: { float: 'left', display: display }, onClick: this.pre.bind(this, 'month') },
          _react2.default.createElement('i', { className: 'icon arrow-left' }),
          _react2.default.createElement('i', { className: 'icon arrow-left' })
        ),
        _react2.default.createElement(
          'a',
          { style: { float: 'left', display: display }, onClick: this.pre.bind(this, 'day') },
          _react2.default.createElement('i', { className: 'icon arrow-left' })
        ),
        _react2.default.createElement(
          'a',
          { onClick: function onClick() {
              _this8.stageChange('year');
            }, className: 'year' },
          datetime.getFullYear(current)
        ),
        _react2.default.createElement(
          'a',
          { onClick: function onClick() {
              _this8.stageChange('month');
            }, className: 'month' },
          datetime.getFullMonth(current)
        ),
        _react2.default.createElement(
          'a',
          { style: { float: 'right', display: display }, onClick: this.next.bind(this, 'month') },
          _react2.default.createElement('i', { className: 'icon arrow-right' }),
          _react2.default.createElement('i', { className: 'icon arrow-right' })
        ),
        _react2.default.createElement(
          'a',
          { style: { float: 'right', display: display }, onClick: this.next.bind(this, 'day') },
          _react2.default.createElement('i', { className: 'icon arrow-right' })
        )
      );
    }
  }, {
    key: 'renderInner',
    value: function renderInner() {
      switch (this.state.stage) {
        case 'day':
          var weeks = (0, _locals.getLang)('datetime.weekday').map(function (w, i) {
            return _react2.default.createElement(
              'div',
              { key: i, className: 'week' },
              w
            );
          });
          return _react2.default.createElement(
            'div',
            { className: 'inner' },
            weeks,
            this.renderDays()
          );
        case 'month':
          return _react2.default.createElement(
            'div',
            { className: 'inner month-inner' },
            this.renderMonths()
          );
        case 'year':
          return _react2.default.createElement(
            'div',
            { className: 'inner year-inner' },
            this.renderYears()
          );
        case 'clock':
          return _react2.default.createElement('div', { className: 'inner empty' });
      }
      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var className = (0, _classnames2.default)(this.props.className, 'cmpt-datetime', 'cmpt-form-control', {
        'active': this.state.active && !this.props.readOnly,
        'popup': this.state.popup,
        'readonly': this.props.readOnly,
        'short': this.props.type !== DATETIME
      });

      var _state4 = this.state;
      var stage = _state4.stage;
      var value = _state4.value;

      var text = value ? this.formatValue(value) : '';
      text = text ? _react2.default.createElement(
        'span',
        { className: 'date-text' },
        text
      ) : _react2.default.createElement(
        'span',
        { className: 'placeholder' },
        this.props.placeholder,
        ' '
      );

      return _react2.default.createElement(
        'div',
        { ref: 'datetime', onClick: this.open, className: className },
        text,
        _react2.default.createElement('i', { className: 'icon calendar' }),
        _react2.default.createElement(
          'div',
          { ref: 'datepicker', className: 'date-picker' },
          this.renderHeader(),
          this.renderInner(),
          (stage === 'day' || stage === 'clock') && this.props.type !== DATE && this.getTime()
        ),
        _react2.default.createElement('div', { className: 'overlay', onClick: this.close })
      );
    }
  }]);

  return Datetime;
}((0, _ClickAway3.default)(_react.Component));

Datetime.propTypes = {
  className: _react.PropTypes.string,
  format: _react.PropTypes.string,
  max: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.object]),
  min: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.object]),
  onChange: _react.PropTypes.func,
  placeholder: _react.PropTypes.string,
  readOnly: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  type: _react.PropTypes.oneOf([DATETIME, DATE, TIME]),
  unixtime: _react.PropTypes.bool,
  value: _react.PropTypes.any
};

Datetime.defaultProps = {
  type: DATETIME
};

module.exports = Datetime;