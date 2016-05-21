"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Overlay = require('../Overlay');

var _pubsubJs = require('pubsub-js');

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CALLBACK_MESSAGE = "CALLBACK_MESSAGE";
var ADD_MESSAGE = "EB3A79637B40";
var REMOVE_MESSAGE = "73D4EF15DF50";
var CLEAR_MESSAGE = "73D4EF15DF52";
var messages = [];
var messageContainer = null;

var Item = function (_React$Component) {
  _inherits(Item, _React$Component);

  function Item() {
    _classCallCheck(this, Item);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Item).apply(this, arguments));
  }

  _createClass(Item, [{
    key: 'dismiss',
    value: function dismiss() {
      if (this.props.dismissed) {
        return;
      }
      this.props.onDismiss(this.props.index);
    }
  }, {
    key: 'render',
    value: function render() {
      var className = (0, _classnames2.default)(this.props.className, 'cmpt-message', 'cmpt-message-' + this.props.type, { 'dismissed': this.props.dismissed });

      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement(
          'button',
          { type: 'button', onClick: this.dismiss.bind(this), className: 'close' },
          '×'
        ),
        this.props.content
      );
    }
  }]);

  return Item;
}(_react2.default.Component);

Item.displayName = 'Message.Item';
Item.propTypes = {
  className: _react2.default.PropTypes.string,
  content: _react2.default.PropTypes.any,
  dismissed: _react2.default.PropTypes.bool,
  index: _react2.default.PropTypes.number,
  onDismiss: _react2.default.PropTypes.func,
  type: _react2.default.PropTypes.string
};

var Message = function (_React$Component2) {
  _inherits(Message, _React$Component2);

  function Message() {
    _classCallCheck(this, Message);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Message).apply(this, arguments));
  }

  _createClass(Message, [{
    key: 'dismiss',
    value: function dismiss(index) {
      _pubsubJs2.default.publish(REMOVE_MESSAGE, index);
    }
  }, {
    key: 'clear',
    value: function clear() {
      _pubsubJs2.default.publish(CLEAR_MESSAGE);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var items = this.props.messages.map(function (msg, i) {
        return _react2.default.createElement(Item, _extends({ key: i, index: i, ref: i, onDismiss: _this3.dismiss }, msg));
      });

      var className = (0, _classnames2.default)(this.props.className, 'cmpt-message-container', { 'has-message': this.props.messages.length > 0 });

      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement(_Overlay.Overlay, { onClick: this.clear.bind(this) }),
        items
      );
    }
  }], [{
    key: 'show',
    value: function show(content, type, cb) {
      if (!messageContainer) {
        createContainer();
      }

      _pubsubJs2.default.publish(ADD_MESSAGE, {
        content: content,
        type: type || 'info'
      });

      if (typeof cb === "function") {
        _pubsubJs2.default.publish(CALLBACK_MESSAGE, cb, {
          content: content,
          type: type || 'info'
        });
      }
    }
  }, {
    key: 'success',
    value: function success(content, cb) {
      Message.show(content, "success", cb);
    }
  }, {
    key: 'error',
    value: function error(content, cb) {
      Message.show(content, "error", cb);
    }
  }, {
    key: 'warning',
    value: function warning(content, cb) {
      Message.show(content, "warning", cb);
    }
  }]);

  return Message;
}(_react2.default.Component);

Message.displayName = 'Message';
Message.propTypes = {
  className: _react2.default.PropTypes.string,
  messages: _react2.default.PropTypes.array
};
exports.default = Message;


function renderContainer() {
  _reactDom2.default.render(_react2.default.createElement(Message, { messages: messages }), messageContainer);
}

function createContainer() {
  messageContainer = document.createElement('div');
  document.body.appendChild(messageContainer);
}

_pubsubJs2.default.subscribe(CALLBACK_MESSAGE, function (topic, cb, data) {
  if (typeof cb === "function") {
    cb(topic, data);
  }
});

_pubsubJs2.default.subscribe(ADD_MESSAGE, function (topic, data) {
  messages = [].concat(_toConsumableArray(messages), [data]);
  renderContainer();
});

_pubsubJs2.default.subscribe(REMOVE_MESSAGE, function (topic, index) {
  messages = [].concat(_toConsumableArray(messages.slice(0, index)), _toConsumableArray(messages.slice(index + 1)));
  renderContainer();
});

_pubsubJs2.default.subscribe(CLEAR_MESSAGE, function () {
  messages = messages.map(function (m) {
    m.dismissed = true;
    return m;
  });
  renderContainer();
  setTimeout(function () {
    messages = [];
    renderContainer();
  }, 400);
});