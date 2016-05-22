'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValueType = exports.register = exports.enhance = exports.COMPONENTS = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('./util');

var FormUtil = _interopRequireWildcard(_util);

var _obj = require('../../utils/obj');

var _str = require('../../utils/str');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COMPONENTS = exports.COMPONENTS = {};

var enhance = exports.enhance = function enhance(ComposedComponent) {
  var FormItem = function (_Component) {
    _inherits(FormItem, _Component);

    function FormItem(props) {
      _classCallCheck(this, FormItem);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FormItem).call(this, props));

      _this.state = {
        hasError: false,
        value: getValue(props)
      };

      _this.valueType = getValueType(props.type);
      _this.handleChange = _this.handleChange.bind(_this);
      return _this;
    }

    _createClass(FormItem, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var itemBind = this.props.itemBind;


        if (itemBind) {
          var value = getValue(this.props);
          this.bindToForm(this.props, value);
        }
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        var component = this.component;
        if (!component) {
          return;
        }
        Object.keys(component).forEach(function (key) {
          if (!_this2.hasOwnProperty(key)) {
            var func = component[key];
            if (typeof func === 'function') {
              _this2[key] = func;
            }
          }
        });
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var name = nextProps.name;
        var value = nextProps.value;
        var formData = nextProps.formData;
        var itemUnbind = nextProps.itemUnbind;


        if (nextProps.type && nextProps.type !== this.props.type) {
          this.valueType = getValueType(nextProps.type);
        }

        if (formData) {
          value = formData[name];

          if (this.props.name !== name && itemUnbind) {
            itemUnbind(this.id, this.props.name);
            this.bindToForm(nextProps, value);
          }

          if (value !== this.state.value) {
            this.handleChange(value, nextProps);
          }
        } else {
          if (value !== this.props.value && value !== this.state.value) {
            this.handleChange(value, nextProps);
          }
        }
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        return !(0, _obj.shallowEqual)(nextProps, this.props) || !(0, _obj.shallowEqual)(this.state, nextState);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _props = this.props;
        var itemUnbind = _props.itemUnbind;
        var name = _props.name;

        if (itemUnbind) {
          itemUnbind(this.id, name);
        }
      }
    }, {
      key: 'bindToForm',
      value: function bindToForm(props, value) {
        var name = props.name;
        var validator = props.validator;
        var ignore = props.ignore;
        var itemBind = props.itemBind;

        this.id = (0, _str.nextUid)();
        var valiBind = void 0;
        if (validator && validator.bind) {
          valiBind = validator.bind;
          if (typeof valiBind === 'string') {
            valiBind = [valiBind];
          }
        }

        itemBind({
          id: this.id,
          name: name,
          valiBind: valiBind,
          ignore: ignore,
          value: value,
          validate: this.validate.bind(this)
        });
      }
    }, {
      key: 'validate',
      value: function validate() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? this.state.value : arguments[0];
        var props = arguments.length <= 1 || arguments[1] === undefined ? this.props : arguments[1];
        var onValidate = props.onValidate;

        var other = _objectWithoutProperties(props, ['onValidate']);

        var result = FormUtil.validate(value, this.valueType, other);
        this.setState({ hasError: result !== true });
        if (onValidate) {
          onValidate(this.id, result);
        }
        return result;
      }
    }, {
      key: 'getValue',
      value: function getValue() {
        return this.state.value;
      }
    }, {
      key: 'setValue',
      value: function setValue(value) {
        this.handleChange(value);
      }
    }, {
      key: 'handleChange',
      value: function handleChange(value, props) {
        var _this3 = this,
            _arguments = arguments;

        if (!props || (typeof props === 'undefined' ? 'undefined' : _typeof(props)) !== 'object' || props.nativeEvent) {
          props = this.props;
        }
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value && value.nativeEvent) {
          value = value.target.value;
        }
        var _props2 = props;
        var itemChange = _props2.itemChange;
        var onChange = _props2.onChange;

        var result = value instanceof Error ? value : this.validate(value, props);
        this.setState({ value: value }, function () {
          itemChange = itemChange || _this3.props.itemChange;
          onChange = onChange || _this3.props.onChange;
          if (itemChange) {
            itemChange(_this3.id, value, result);
          }
          if (onChange) {
            onChange.apply(undefined, _arguments);
          }
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this4 = this;

        var _props3 = this.props;
        var className = _props3.className;
        var onChange = _props3.onChange;
        var value = _props3.value;
        var style = _props3.style;

        var props = _objectWithoutProperties(_props3, ['className', 'onChange', 'value', 'style']);

        className = (0, _classnames2.default)(className, {
          'has-error': this.state.hasError
        });
        value = this.state.value;

        if (typeof style === 'string') {
          style = (0, _str.toStyleObject)(style);
        }

        return _react2.default.createElement(ComposedComponent, _extends({ ref: function ref(c) {
            return _this4.component = c;
          } }, props, { onChange: this.handleChange, style: style, value: value, className: className }));
      }
    }]);

    return FormItem;
  }(_react.Component);

  FormItem.displayName = 'FormItem';

  FormItem.isFormItem = true;

  FormItem.propTypes = {
    className: _react.PropTypes.string,
    formData: _react.PropTypes.object,
    ignore: _react.PropTypes.bool,
    itemBind: _react.PropTypes.func,
    itemChange: _react.PropTypes.func,
    itemRename: _react.PropTypes.func,
    itemUnbind: _react.PropTypes.func,
    name: _react.PropTypes.string,
    onChange: _react.PropTypes.func,
    onValidate: _react.PropTypes.func,
    sep: _react.PropTypes.string,
    style: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]),
    type: _react.PropTypes.string,
    validator: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.object]),
    value: _react.PropTypes.any
  };

  FormItem.defaultProps = {
    sep: ','
  };

  return FormItem;
};

var register = exports.register = function register(ComposedComponent) {
  var types = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var newComponent = enhance(ComposedComponent);

  // allow empty type
  //if (isEmpty(types)) {
  //  console.warn('types must be string or array');
  //  return;
  //}

  if (!Array.isArray(types)) {
    types = [types];
  }

  types.forEach(function (type) {
    if (COMPONENTS.hasOwnProperty(type)) {
      console.warn('type ' + type + ' was already existed.');
      return;
    }

    var valueType = options.valueType;
    var render = options.render;

    if (!valueType) {
      valueType = ['integer', 'number'].indexOf(type) > -1 ? 'number' : 'string';
    }

    if (!render) {
      render = function render(props) {
        return (0, _react.createElement)(newComponent, props);
      };
    }

    COMPONENTS[type] = { render: render, valueType: valueType, component: ComposedComponent };
  });

  return newComponent;
};

var getValueType = exports.getValueType = function getValueType(type) {
  var valueType = 'string';
  if (COMPONENTS[type]) {
    valueType = COMPONENTS[type].valueType;
  }
  return valueType;
};

function getValue(props) {
  var value = props.value;
  var name = props.name;
  var formData = props.formData;

  if (formData && formData[name] !== undefined) {
    value = formData[name];
  }

  return value;
}