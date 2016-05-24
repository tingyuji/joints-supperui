'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _enhance = require('./enhance');

var _supperutils = require('supperutils');

var _locals = require('../../locals');

var _util = require('../Grid/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var forEach = _supperutils.Obj.forEach;
var shallowEqual = _supperutils.Obj.shallowEqual;
var hashcode = _supperutils.Obj.hashcode;
var merge = _supperutils.Obj.merge;
var format = _supperutils.Str.format;


function setHint(hints, key, value) {
  var text = (0, _locals.getLang)('validation.hints.' + key, null);
  if (text) {
    hints.push(format(text, value));
  }
}

var FormControl = function (_Component) {
  _inherits(FormControl, _Component);

  function FormControl(props) {
    _classCallCheck(this, FormControl);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FormControl).call(this, props));

    _this.state = {
      validations: ''
    };

    // for check props
    _this.items = {};
    _this.itemBind = _this.itemBind.bind(_this);
    _this.itemUnbind = _this.itemUnbind.bind(_this);
    _this.itemChange = _this.itemChange.bind(_this);
    _this.handleValidate = _this.handleValidate.bind(_this);
    return _this;
  }

  _createClass(FormControl, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setItems(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!shallowEqual(this.props, nextProps)) {
        this.setItems(nextProps);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (!shallowEqual(this.props, nextProps)) {
        return true;
      }

      if (nextProps.formData) {
        var keys = Object.keys(this.items);
        for (var i = 0, key; i < keys.length; i++) {
          key = keys[i];
          if (nextProps.formData[key] !== this.items[key].$value) {
            return true;
          }
        }
      }

      return !shallowEqual(this.state, nextState);
    }
  }, {
    key: 'itemBind',
    value: function itemBind(props) {
      this.items[props.id] = props;

      if (this.props.itemBind) {
        this.props.itemBind(props);
      }
    }
  }, {
    key: 'itemUnbind',
    value: function itemUnbind(id) {
      delete this.items[id];

      if (this.props.itemUnbind) {
        var _props;

        (_props = this.props).itemUnbind.apply(_props, arguments);
      }
    }
  }, {
    key: 'itemChange',
    value: function itemChange(id, value, result) {
      this.items[id].$value = value;

      this.handleValidate(id, result);

      if (this.props.itemChange) {
        var _props2;

        (_props2 = this.props).itemChange.apply(_props2, arguments);
      }
    }
  }, {
    key: 'handleValidate',
    value: function handleValidate(id, result) {
      this.items[id].$validation = result;

      var validations = [];
      forEach(this.items, function (item) {
        if (item.$validation instanceof Error) {
          validations.push(item.$validation.message);
        }
      });
      validations = validations.join(', ');
      if (validations !== this.state.validations) {
        this.setState({ validations: validations });
      }
    }
  }, {
    key: 'getHint',
    value: function getHint(props) {
      if (props.required) {
        this.required = true;
      }

      if (props.tip) {
        return '';
      }

      var valueType = (0, _enhance.getValueType)(props.type);
      var hints = [];

      setHint(hints, this.props.type);
      if (props.min) {
        setHint(hints, 'min.' + valueType, props.min);
      }
      if (props.max) {
        setHint(hints, 'max.' + valueType, props.max);
      }

      return (props.label || '') + hints.join(', ');
    }
  }, {
    key: 'setChildrenHint',
    value: function setChildrenHint(hints, children) {
      var _this2 = this;

      _react.Children.toArray(children).forEach(function (child) {
        if (child.type && child.type.displayName === 'FormItem') {
          var hint = _this2.getHint(child.props);
          if (hint) {
            hints.push(hint);
          }
        } else if (child.children) {
          _this2.setChildrenHint(hints, children);
        }
      });
    }
  }, {
    key: 'setItems',
    value: function setItems(props) {
      var _this3 = this;

      var label = props.label;
      var layout = props.layout;
      var items = props.items;
      var children = props.children;

      var otherProps = _objectWithoutProperties(props, ['label', 'layout', 'items', 'children']);

      var hints = [];

      this.required = false;
      if (children) {
        this.setChildrenHint(hints, children);
      } else {
        if (!items) {
          items = [otherProps];
        }
      }

      if (items) {
        items.forEach(function (control) {
          var hint = _this3.getHint(control);
          if (hint) {
            hints.push(hint);
          }
        });
      }

      this.setState({ items: items, hints: hints.join(', ') });
    }
  }, {
    key: 'renderTip',
    value: function renderTip() {
      var _props3 = this.props;
      var tip = _props3.tip;
      var errorText = _props3.errorText;
      var _state = this.state;
      var validations = _state.validations;
      var hints = _state.hints;

      hints = tip || hints;

      if (validations) {
        // if has tip，use tip
        if (errorText) {
          validations = errorText;
        }
        return _react2.default.createElement(
          'span',
          { key: 'tip', className: 'error' },
          validations
        );
      }

      if (hints) {
        return _react2.default.createElement(
          'span',
          { key: 'tip', className: 'hint' },
          hints
        );
      } else {
        return;
      }
    }
  }, {
    key: 'propsExtend',
    value: function propsExtend(props) {
      props.itemBind = this.itemBind;
      props.itemUnbind = this.itemUnbind;
      props.itemChange = this.itemChange;
      props.formData = this.props.formData;
      props.onValidate = this.handleValidate;
      props.readOnly = props.readOnly || this.props.readOnly;
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren(children, index) {
      var _this4 = this;

      var newChildren = _react.Children.toArray(children).map(function (child, i) {
        //i = index + '.' + i;

        if (typeof child === 'string') {
          return _react2.default.createElement(
            'span',
            { key: i },
            child
          );
        }

        var props = {};
        if (child.type.isFormItem) {
          _this4.propsExtend(props);
        } else if (child.props && child.props.children === 'object') {
          props.children = _this4.renderChildren(child.props.children, i);
        }

        child = (0, _react.cloneElement)(child, props);
        return child;
      });
      return newChildren;
    }
  }, {
    key: 'renderItems',
    value: function renderItems(grid) {
      var _this5 = this;

      var children = this.props.children;


      var items = (this.state.items || []).map(function (props, i) {
        i += length;
        if (typeof props === 'string') {
          return _react2.default.createElement('span', { key: i, dangerouslySetInnerHTML: { __html: props } });
        }
        var component = _enhance.COMPONENTS[props.type];
        if (component) {
          _this5.propsExtend(props);
          props.key = props.label + '|' + props.name;
          props.$controlId = _this5.id;
          props = merge({}, props, grid);
          return component.render(props);
        }
      });

      if (children) {
        items = items.concat(this.renderChildren(children, items.length));
      }

      items.push(this.renderTip());

      return items;
    }
  }, {
    key: 'renderInline',
    value: function renderInline(className) {
      className = (0, _classnames2.default)(className, (0, _util.getGrid)(this.props.grid));
      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: className },
        this.renderItems({ grid: { width: 1 }, placeholder: this.props.placeholder || this.props.label })
      );
    }
  }, {
    key: 'renderStacked',
    value: function renderStacked(className) {
      var labelClass = (0, _classnames2.default)('label', { required: this.props.required || this.required });
      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: className },
        _react2.default.createElement(
          'label',
          { className: labelClass },
          this.props.label
        ),
        _react2.default.createElement(
          'div',
          null,
          this.renderItems()
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props;
      var hintType = _props4.hintType;
      var layout = _props4.layout;
      var className = _props4.className;

      if (!hintType) {
        hintType = layout === 'inline' ? 'pop' : 'block';
      }

      className = (0, _classnames2.default)(className, 'cmpt-control-group', 'cmpt-hint-' + hintType, {
        'cmpt-has-error': this.state.validations.length > 0
      });

      if (layout === 'inline') {
        return this.renderInline(className);
      } else {
        return this.renderStacked(className);
      }
    }
  }]);

  return FormControl;
}(_react.Component);

FormControl.propTypes = {
  children: _react.PropTypes.any,
  className: _react.PropTypes.string,
  data: _react.PropTypes.any,
  errorText: _react.PropTypes.string,
  formData: _react.PropTypes.object,
  grid: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object]),
  hintType: _react.PropTypes.oneOf(['block', 'none', 'pop', 'inline']),
  itemBind: _react.PropTypes.func,
  itemChange: _react.PropTypes.func,
  itemUnbind: _react.PropTypes.func,
  label: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element]),
  layout: _react.PropTypes.oneOf(['aligned', 'stacked', 'inline']),
  name: _react.PropTypes.string,
  onChange: _react.PropTypes.func,
  placeholder: _react.PropTypes.string,
  readOnly: _react.PropTypes.bool,
  required: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  tip: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.string]),
  type: _react.PropTypes.string,
  value: _react.PropTypes.any
};

FormControl.defaultProps = {
  layout: 'inline',
  type: 'text'
};

module.exports = FormControl;