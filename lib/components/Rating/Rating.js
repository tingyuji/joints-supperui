'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _enhance = require('../Form/enhance');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var themes = {
  // "star": [Icon, Icon],
  // "heart": [img, img]
};

var Rating = function (_Component) {
  _inherits(Rating, _Component);

  function Rating(props) {
    _classCallCheck(this, Rating);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Rating).call(this, props));

    _this.state = {
      value: props.value,
      hover: 0,
      wink: false
    };
    _this.handleLeave = _this.handleLeave.bind(_this);
    return _this;
  }

  _createClass(Rating, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        this.setValue(nextProps.value);
      }
    }
  }, {
    key: 'handleHover',
    value: function handleHover(value) {
      this.setState({ hover: value });
    }
  }, {
    key: 'handleLeave',
    value: function handleLeave() {
      this.setState({ hover: 0 });
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.setState({ value: value });
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.state.value;
    }
  }, {
    key: 'getIcon',
    value: function getIcon() {
      var pos = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      var icons = this.props.icons;
      if (!icons) {
        var theme = this.props.theme || Object.keys(themes)[0];
        icons = themes[theme];
      }
      if (!icons) {
        console.warn('icons or theme not exist');
        return null;
      }

      return icons[pos];
    }
  }, {
    key: 'getBackground',
    value: function getBackground() {
      var items = [],
          icon = this.getIcon(0);
      for (var i = 0; i < this.props.maxValue; i++) {
        items.push((0, _react.cloneElement)(icon, { key: i }));
      }

      return _react2.default.createElement(
        'div',
        { className: 'cmpt-rating-bg' },
        items
      );
    }
  }, {
    key: 'handleChange',
    value: function handleChange(val) {
      var _this2 = this;

      this.setValue(val);
      this.setState({ wink: true });
      setTimeout(function () {
        _this2.setState({ wink: false });
      }, 1000);
      setTimeout(function () {
        if (_this2.props.onChange) {
          _this2.props.onChange(val);
        }
      });
    }
  }, {
    key: 'getHandle',
    value: function getHandle() {
      var items = [],
          icon = this.getIcon(1),
          hover = this.state.hover,
          wink = this.state.wink,
          value = hover > 0 ? hover : this.state.value;

      for (var i = 0, active; i < this.props.maxValue; i++) {
        active = value > i;
        items.push(_react2.default.createElement(
          'span',
          { key: i,
            style: { cursor: 'pointer' },
            onMouseOver: this.handleHover.bind(this, i + 1),
            onClick: this.handleChange.bind(this, i + 1),
            className: (0, _classnames2.default)('cmpt-rating-handle', { active: active, wink: active && wink }) },
          (0, _react.cloneElement)(icon)
        ));
      }

      return _react2.default.createElement(
        'div',
        { onMouseOut: this.handleLeave, className: 'cmpt-rating-front' },
        items
      );
    }
  }, {
    key: 'getMute',
    value: function getMute() {
      var items = [],
          icon = this.getIcon(1),
          width = this.state.value / this.props.maxValue * 100 + '%';

      for (var i = 0; i < this.props.maxValue; i++) {
        items.push((0, _react.cloneElement)(icon, { key: i }));
      }

      return _react2.default.createElement(
        'div',
        { style: { width: width }, className: 'cmpt-rating-front' },
        _react2.default.createElement(
          'div',
          { className: 'cmpt-rating-inner' },
          items
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var className = (0, _classnames2.default)(this.props.className, 'cmpt-rating');
      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: className },
        this.getBackground(),
        this.props.readOnly ? this.getMute() : this.getHandle()
      );
    }
  }]);

  return Rating;
}(_react.Component);

Rating.propTypes = {
  className: _react.PropTypes.string,
  icons: _react.PropTypes.array,
  maxValue: _react.PropTypes.number,
  onChange: _react.PropTypes.func,
  readOnly: _react.PropTypes.bool,
  size: _react.PropTypes.number,
  style: _react.PropTypes.object,
  theme: _react.PropTypes.string,
  value: _react.PropTypes.number
};

Rating.defaultProps = {
  value: 0,
  maxValue: 5
};

Rating = (0, _enhance.register)(Rating, 'rating');

Rating.register = function (key, icons) {
  themes[key] = icons;
};

module.exports = Rating;