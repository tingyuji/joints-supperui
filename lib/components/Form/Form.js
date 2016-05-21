'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _obj = require('../../utils/obj');

var _util = require('../Grid/util');

var _locals = require('../../locals');

var _Fetch = require('../_mixins/Fetch');

var _FormControl = require('./FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _FormSubmit = require('./FormSubmit');

var _FormSubmit2 = _interopRequireDefault(_FormSubmit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_Component) {
  _inherits(Form, _Component);

  function Form(props) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this, props));

    _this.state = {
      data: props.data
    };

    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.submit = _this.submit.bind(_this);

    _this.items = {};
    _this.validationPools = {};

    _this.itemBind = function (item) {
      _this.items[item.id] = item;

      var data = _this.state.data;
      data[item.name] = item.value;
      _this.setState({ data: data });

      // bind triger item
      if (item.valiBind) {
        item.valiBind.forEach(function (vb) {
          _this.validationPools[vb] = (_this.validationPools[vb] || []).concat(item.validate);
        });
      }
    };

    _this.itemUnbind = function (id, name) {
      var data = _this.state.data;
      delete _this.items[id];
      delete data[name];
      // remove valiBind
      delete _this.validationPools[name];
      _this.setState({ data: data });
    };

    _this.itemChange = function (id, value, err) {
      var data = _this.state.data;
      var name = _this.items[id].name;

      // don't use merge or immutablejs
      //data = merge({}, data, {[name]: value});

      if (data[name] !== value) {
        data[name] = value;
        // setState only triger render, data was changed
        _this.setState({ data: data });
      }

      var valiBind = _this.validationPools[name];
      if (valiBind) {
        valiBind.forEach(function (validate) {
          if (validate) {
            validate();
          }
        });
      }

      _this.items[id].$validation = err;
    };
    return _this;
  }

  _createClass(Form, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!(0, _obj.deepEqual)(this.props.data, nextProps.data)) {
        this.setState({ data: nextProps.data });

        // if data changed, clear validation
        (0, _obj.forEach)(this.items, function (item) {
          delete item.$validation;
        });
      }
    }
  }, {
    key: 'validate',
    value: function validate() {
      var _this2 = this;

      var success = true;
      (0, _obj.forEach)(this.items, function (item) {
        var suc = item.$validation;
        if (suc === undefined) {
          suc = item.validate();
          _this2.items[item.id].$validation = suc;
        }
        success = success && suc === true;
      });
      return success;
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      if (this.props.disabled) {
        return;
      }

      event.preventDefault();
      this.submit();
    }
  }, {
    key: 'submit',
    value: function submit() {
      var _this3 = this;

      var success = this.validate();
      if (success && this.props.beforeSubmit) {
        success = this.props.beforeSubmit();
      }

      if (!success) {
        return;
      }

      if (this.props.onSubmit) {
        (function () {
          // send clone data
          var data = (0, _obj.clone)(_this3.state.data);

          // remove ignore value
          (0, _obj.forEach)(_this3.items, function (item) {
            if (item.ignore) {
              delete data[item.name];
            }
          });

          _this3.props.onSubmit(data);
        })();
      }

      return true;
    }
  }, {
    key: 'getData',
    value: function getData() {
      var data = (0, _obj.clone)(this.state.data);

      return data;
    }
  }, {
    key: 'renderControls',
    value: function renderControls() {
      var _this4 = this;

      var data = this.state.data;
      var _props = this.props;
      var hintType = _props.hintType;
      var controls = _props.controls;
      var disabled = _props.disabled;
      var layout = _props.layout;


      return (0, _obj.clone)(controls).map(function (control, i) {
        if ((typeof control === 'undefined' ? 'undefined' : _typeof(control)) !== 'object') {
          return control;
        } else {
          control.key = control.key || control.name || (0, _obj.hashcode)(control);
          control.hintType = control.hintType || hintType;
          control.readOnly = control.readOnly || disabled;
          control.layout = layout;
          control.itemBind = _this4.itemBind;
          control.itemUnbind = _this4.itemUnbind;
          control.itemChange = _this4.itemChange;
          control.formData = data;
          return _react2.default.createElement(_FormControl2.default, control);
        }
      });
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren(children) {
      var _this5 = this;

      var data = this.state.data;
      var _props2 = this.props;
      var fetchStatus = _props2.fetchStatus;
      var disabled = _props2.disabled;


      return _react.Children.map(children, function (child) {
        if (!child) {
          return null;
        }
        if (typeof child === 'string') {
          return child;
        }
        var _child$props = child.props;
        var hintType = _child$props.hintType;
        var readOnly = _child$props.readOnly;

        var props = {
          hintType: hintType || _this5.props.hintType,
          readOnly: readOnly || disabled,
          layout: _this5.props.layout
        };
        if (child.type === _FormControl2.default || child.type.displayName === 'FormItem') {
          props.itemBind = _this5.itemBind;
          props.itemUnbind = _this5.itemUnbind;
          props.itemChange = _this5.itemChange;
          props.formData = data;
        } else if (child.type === _FormSubmit2.default) {
          props.disabled = disabled;
          if (fetchStatus !== _Fetch.FETCH_SUCCESS) {
            props.children = (0, _locals.getLang)('fetch.status')[fetchStatus];
          }
        } else if (child.props.children) {
          props.children = _this5.renderChildren(child.props.children);
        }

        return (0, _react.cloneElement)(child, props);
      });
    }
  }, {
    key: 'renderButton',
    value: function renderButton(text) {
      return _react2.default.createElement(
        _FormSubmit2.default,
        { disabled: this.props.disabled },
        text
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var button = _props3.button;
      var controls = _props3.controls;
      var fetchStatus = _props3.fetchStatus;
      var children = _props3.children;
      var className = _props3.className;
      var onSubmit = _props3.onSubmit;
      var grid = _props3.grid;
      var layout = _props3.layout;

      var props = _objectWithoutProperties(_props3, ['button', 'controls', 'fetchStatus', 'children', 'className', 'onSubmit', 'grid', 'layout']);

      className = (0, _classnames2.default)(className, (0, _util.getGrid)(grid), 'cmpt-form', {
        'cmpt-form-aligned': layout === 'aligned',
        'cmpt-form-inline': layout === 'inline',
        'cmpt-form-stacked': layout === 'stacked'
      });

      return _react2.default.createElement(
        'form',
        _extends({ onSubmit: this.handleSubmit, className: className }, props),
        controls && this.renderControls(),
        this.renderChildren(children),
        button && this.renderButton(button),
        fetchStatus !== _Fetch.FETCH_SUCCESS && _react2.default.createElement('div', { className: 'cmpt-form-mask' })
      );
    }
  }]);

  return Form;
}(_react.Component);

Form.propTypes = {
  beforeSubmit: _react.PropTypes.func,
  button: _react.PropTypes.string,
  children: _react.PropTypes.any,
  className: _react.PropTypes.string,
  controls: _react.PropTypes.array,
  data: _react.PropTypes.object,
  disabled: _react.PropTypes.bool,
  fetchStatus: _react.PropTypes.string,
  grid: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object]),
  hintType: _react.PropTypes.oneOf(['block', 'none', 'pop', 'inline']),
  layout: _react.PropTypes.oneOf(['aligned', 'stacked', 'inline']),
  onSubmit: _react.PropTypes.func,
  style: _react.PropTypes.object
};

Form.defaultProps = {
  data: {},
  layout: 'aligned',
  disabled: false
};

module.exports = (0, _Fetch.fetchEnhance)(Form);