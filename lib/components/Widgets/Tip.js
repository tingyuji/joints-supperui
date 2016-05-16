'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ClickAway2 = require('../_mixins/ClickAway');

var _ClickAway3 = _interopRequireDefault(_ClickAway2);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tip = function (_ClickAway) {
  _inherits(Tip, _ClickAway);

  function Tip(props) {
    _classCallCheck(this, Tip);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tip).call(this, props));

    _this.state = {
      show: props.show,
      position: props.position
    };
    _this.showTip = _this.showTip.bind(_this);
    _this.hideTip = _this.hideTip.bind(_this);
    return _this;
  }

  _createClass(Tip, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.trigger == 'click') {
        this.registerClickAway(this.hideTip, this.root);
      }
    }
  }, {
    key: 'showTip',
    value: function showTip() {
      this.setState({
        show: true
      });
      this.bindClickAway();
    }
  }, {
    key: 'hideTip',
    value: function hideTip() {
      this.setState({
        show: false
      });
      this.unbindClickAway();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props;
      var event = {};
      var pos = this.state.position;
      var clsShow = 'pos-' + pos;
      var clsName = (0, _classnames3.default)('tip-block', pos + '-origin', _defineProperty({}, clsShow, this.state.show));

      event[props.trigger == 'hover' ? 'onMouseEnter' : 'onClick'] = this.showTip;
      props.trigger == 'hover' && (event['onMouseLeave'] = this.hideTip);

      return _react2.default.createElement(
        'div',
        _extends({ ref: function ref(el) {
            return _this2.root = el;
          }, className: 'component-tip' }, event),
        props.children[0],
        _react2.default.createElement(
          'div',
          { ref: 'content', className: clsName },
          _react2.default.createElement(
            'div',
            { className: 'tip-border' },
            _react2.default.createElement('span', { className: 'arrow' }),
            props.children[1]
          )
        )
      );
    }
  }]);

  return Tip;
}((0, _ClickAway3.default)(_react.Component));

;

Tip.defaultProps = {
  position: 'bottom',
  trigger: 'hover',
  show: false
};

Tip.propTypes = {
  className: _react.PropTypes.string,
  position: _react.PropTypes.oneOf(['top', 'bottom']),
  show: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  trigger: _react.PropTypes.oneOf(['click', 'hover'])
};

module.exports = Tip;