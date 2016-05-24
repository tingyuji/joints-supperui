'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _supperutils = require('supperutils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isDescendant = _supperutils.Dom.isDescendant;


module.exports = function (Component) {
  return function (_Component) {
    _inherits(_class, _Component);

    function _class(props) {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, props));
    }

    _createClass(_class, [{
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.unbindClickAway();
      }
    }, {
      key: 'bindClickAway',
      value: function bindClickAway() {
        var fn = this.getClickAwayEvent();
        _supperutils.Dom.onEvent(document, 'click', fn);
        _supperutils.Dom.onEvent(document, 'touchstart', fn);
      }
    }, {
      key: 'unbindClickAway',
      value: function unbindClickAway() {
        var fn = this.getClickAwayEvent();
        _supperutils.Dom.offEvent(document, 'click', fn);
        _supperutils.Dom.offEvent(document, 'touchstart', fn);
      }
    }, {
      key: 'registerClickAway',
      value: function registerClickAway(onClickAway, target) {
        this.clickAwayTarget = target;
        this.onClickAway = onClickAway;
      }
    }, {
      key: 'getClickAwayEvent',
      value: function getClickAwayEvent() {
        var _this2 = this;

        var fn = this._clickAwayEvent;
        if (!fn) {
          fn = function fn(event) {
            var el = _this2.clickAwayTarget || _reactDom2.default.findDOMNode(_this2);

            // Check if the target is inside the current component
            if (event.target !== el && !isDescendant(el, event.target)) {
              if (_this2.onClickAway) {
                _this2.onClickAway();
              }
            }
          };
          this._clickAwayEvent = fn;
        }
        return fn;
      }
    }]);

    return _class;
  }(Component);
};