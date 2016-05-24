'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _supperutils = require('supperutils');

var _ClickAway2 = require('../_mixins/ClickAway');

var _ClickAway3 = _interopRequireDefault(_ClickAway2);

var _util = require('../Grid/util');

var _Fetch = require('../_mixins/Fetch');

var _enhance = require('../Form/enhance');

var _locals = require('../../locals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var toArray = _supperutils.Str.toArray;
var substitute = _supperutils.Str.substitute;
var getOuterHeight = _supperutils.Dom.getOuterHeight;
var overView = _supperutils.Dom.overView;
var withoutTransition = _supperutils.Dom.withoutTransition;
var deepEqual = _supperutils.Obj.deepEqual;
var hashcode = _supperutils.Obj.hashcode;

var Select = function (_ClickAway) {
  _inherits(Select, _ClickAway);

  function Select(props) {
    _classCallCheck(this, Select);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Select).call(this, props));

    var values = toArray(props.value, props.mult ? props.sep : undefined);
    var data = _this.formatData(props.data, values);
    _this.state = {
      active: false,
      data: data,
      filter: '',
      value: values
    };

    _this.showOptions = _this.showOptions.bind(_this);
    _this.hideOptions = _this.hideOptions.bind(_this);
    return _this;
  }

  _createClass(Select, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!deepEqual(nextProps.value, this.props.value)) {
        this.setValue(nextProps.value);
      }
      if (!deepEqual(nextProps.data, this.props.data)) {
        this.setState({ data: this.formatData(nextProps.data) });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _get(Object.getPrototypeOf(Select.prototype), 'componentWillUnmount', this).call(this);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var target = this.props.mult ? undefined : this.refs.options;
      this.registerClickAway(this.hideOptions, target);
    }
  }, {
    key: 'showOptions',
    value: function showOptions() {
      var _this2 = this;

      if (this.state.active || this.props.readOnly) {
        return;
      }

      var options = this.refs.options;
      options.style.display = 'block';
      var offset = getOuterHeight(options) + 5;

      var el = this.refs.container;
      var dropup = overView(el, offset);

      withoutTransition(el, function () {
        _this2.setState({ dropup: dropup });
      });

      this.bindClickAway();

      setTimeout(function () {
        _this2.setState({ filter: '', active: true });
      }, 0);
    }
  }, {
    key: 'hideOptions',
    value: function hideOptions() {
      var _this3 = this;

      this.setState({ active: false });
      this.unbindClickAway();
      // use setTimeout instead of transitionEnd
      setTimeout(function () {
        if (_this3.state.active === false) {
          _this3.refs.options.style.display = 'none';
        }
      }, 500);
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

      if (typeof sep === 'string') {
        value = value.join(sep);
      } else if (typeof sep === 'function') {
        value = sep(raw);
      }

      return value;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      value = toArray(value, this.props.mult ? this.props.sep : null);
      if (this.state) {
        var data = this.state.data.map(function (d) {
          if (typeof d !== 'string') {
            d.$checked = value.indexOf(d.$value) >= 0;
          }
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
      var _this4 = this;

      var value = arguments.length <= 1 || arguments[1] === undefined ? this.state.value : arguments[1];

      if (!Array.isArray(data)) {
        data = Object.keys(data).map(function (key) {
          return { text: data[key], id: key };
        });
      }

      data = data.map(function (d) {
        if ((typeof d === 'undefined' ? 'undefined' : _typeof(d)) !== 'object') {
          return {
            $option: d,
            $result: d,
            $value: d,
            $filter: d.toLowerCase(),
            $checked: value.indexOf(d) >= 0,
            $key: hashcode(d)
          };
        }

        // speed filter
        if (_this4.props.filterAble) {
          d.$filter = Object.keys(d).map(function (k) {
            return d[k];
          }).join(',').toLowerCase();
        }

        var val = substitute(_this4.props.valueTpl, d);
        d.$option = substitute(_this4.props.optionTpl, d);
        d.$result = substitute(_this4.props.resultTpl || _this4.props.optionTpl, d);
        d.$value = val;
        d.$checked = value.indexOf(val) >= 0;
        d.$key = d.id ? d.id : hashcode(val + d.$option);
        return d;
      });

      if (this.props.groupBy) {
        (function () {
          var groups = {},
              groupBy = _this4.props.groupBy;
          data.forEach(function (d) {
            var key = d[groupBy];
            if (!groups[key]) {
              groups[key] = [];
            }
            groups[key].push(d);
          });
          data = [];
          Object.keys(groups).forEach(function (k) {
            data.push(k);
            data = data.concat(groups[k]);
          });
        })();
      }

      return data;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(i) {
      if (this.props.readOnly) {
        return;
      }

      var data = this.state.data;
      if (this.props.mult) {
        data[i].$checked = !data[i].$checked;
      } else {
        data.map(function (d, index) {
          if (typeof d !== 'string') {
            d.$checked = index === i ? true : false;
          }
        });
        this.hideOptions();
      }

      var value = this.getValue(this.props.sep, data);
      this.setState({ value: value, data: data });
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }, {
    key: 'handleRemove',
    value: function handleRemove(i) {
      var _this5 = this;

      // wait checkClickAway completed
      setTimeout(function () {
        _this5.handleChange(i);
      }, 0);
    }
  }, {
    key: 'renderFilter',
    value: function renderFilter() {
      var _this6 = this;

      if (this.props.filterAble) {
        return _react2.default.createElement(
          'div',
          { className: 'filter' },
          _react2.default.createElement('i', { className: 'search' }),
          _react2.default.createElement('input', { value: this.state.filter,
            onChange: function onChange(e) {
              return _this6.setState({ filter: e.target.value });
            },
            type: 'text' })
        );
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var _props = this.props;
      var className = _props.className;
      var fetchStatus = _props.fetchStatus;
      var grid = _props.grid;
      var readOnly = _props.readOnly;
      var mult = _props.mult;
      var placeholder = _props.placeholder;
      var style = _props.style;
      var _state = this.state;
      var filter = _state.filter;
      var active = _state.active;
      var msg = _state.msg;
      var data = _state.data;

      var result = [];

      className = (0, _classnames2.default)(className, (0, _util.getGrid)(grid), 'cmpt-form-control', 'cmpt-select', {
        active: active,
        readonly: readOnly,
        dropup: this.state.dropup,
        single: !mult
      });

      // if get remote data pending or failure, render message
      if (fetchStatus !== _Fetch.FETCH_SUCCESS) {
        return _react2.default.createElement(
          'div',
          { className: className },
          (0, _locals.getLang)('fetch.status')[fetchStatus]
        );
      }

      var filterText = filter ? filter.toLowerCase() : null;

      var options = data.map(function (d, i) {
        if (typeof d === 'string') {
          return _react2.default.createElement(
            'span',
            { key: 'g-' + d, className: 'show group' },
            d
          );
        }

        if (d.$checked) {
          if (mult) {
            result.push(_react2.default.createElement('div', { key: d.$key, className: 'cmpt-select-result',
              onClick: _this7.handleRemove.bind(_this7, i),
              dangerouslySetInnerHTML: { __html: d.$result }
            }));
          } else {
            result.push(_react2.default.createElement('span', { key: d.$key, dangerouslySetInnerHTML: { __html: d.$result } }));
          }
        }

        var optionClassName = (0, _classnames2.default)({
          active: d.$checked,
          show: filterText ? d.$filter.indexOf(filterText) >= 0 : true
        });
        return _react2.default.createElement('li', { key: d.$key,
          onClick: _this7.handleChange.bind(_this7, i),
          className: optionClassName,
          dangerouslySetInnerHTML: { __html: d.$option }
        });
      });

      return _react2.default.createElement(
        'div',
        { ref: 'container', onClick: this.showOptions, style: style, className: className },
        result.length > 0 ? result : _react2.default.createElement(
          'span',
          { className: 'placeholder' },
          msg || placeholder,
          ' '
        ),
        _react2.default.createElement(
          'div',
          { className: 'cmpt-select-options-wrap' },
          _react2.default.createElement('hr', null),
          _react2.default.createElement(
            'div',
            { ref: 'options', className: 'cmpt-select-options' },
            this.renderFilter(),
            _react2.default.createElement(
              'ul',
              null,
              options
            )
          )
        )
      );
    }
  }]);

  return Select;
}((0, _ClickAway3.default)(_react.Component));

Select.propTypes = {
  className: _react.PropTypes.string,
  data: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]),
  filterAble: _react.PropTypes.bool,
  grid: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object]),
  groupBy: _react.PropTypes.string,
  mult: _react.PropTypes.bool,
  onChange: _react.PropTypes.func,
  optionTpl: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  placeholder: _react.PropTypes.string,
  readOnly: _react.PropTypes.bool,
  responsive: _react.PropTypes.string,
  resultTpl: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  sep: _react.PropTypes.string,
  style: _react.PropTypes.object,
  value: _react.PropTypes.any,
  valueTpl: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  width: _react.PropTypes.number
};

Select.defaultProps = {
  dropup: false,
  sep: ',',
  data: [],
  optionTpl: '{text}',
  valueTpl: '{id}'
};

Select = (0, _Fetch.fetchEnhance)(Select);

module.exports = (0, _enhance.register)(Select, 'select', { valueType: 'array' });