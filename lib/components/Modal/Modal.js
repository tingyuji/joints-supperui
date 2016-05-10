'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _pubsubJs = require('pubsub-js');

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

var _button = require('../button');

var _overlay = require('../overlay');

var _str = require('../../utils/str');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _locals = require('../../locals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ADD_MODAL = 'id39hxqm';
var REMOVE_MODAL = 'id39i40m';
var CLICKAWAY = 'id5bok7e';
var ZINDEX = 1100;
var modals = [];
var modalContainer = null;

var ModalContainer = function (_Component) {
  _inherits(ModalContainer, _Component);

  function ModalContainer(props) {
    _classCallCheck(this, ModalContainer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ModalContainer).call(this, props));

    _this.state = {
      increase: false,
      modals: modals
    };
    _this.close = _this.close.bind(_this);
    _this.clickaway = _this.clickaway.bind(_this);
    _this.elements = {};
    return _this;
  }

  _createClass(ModalContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _pubsubJs2.default.subscribe(ADD_MODAL, this.addModal.bind(this));

      _pubsubJs2.default.subscribe(REMOVE_MODAL, this.removeModal.bind(this));

      _pubsubJs2.default.subscribe(CLICKAWAY, function () {
        var props = modals[modals.length - 1];
        if (props.clickaway) {
          _pubsubJs2.default.publish(REMOVE_MODAL);
        }
      });
    }
  }, {
    key: 'addModal',
    value: function addModal(topic, props) {
      var isReplace = false;
      modals = modals.map(function (m) {
        if (m.id === props.id) {
          isReplace = true;
          m = props;
        }
        return m;
      });
      if (!isReplace) {
        modals.push(props);
      }

      this.setState({ modals: modals, increase: true });
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';
    }
  }, {
    key: 'removeModal',
    value: function removeModal(topic, id) {
      var props = void 0;
      if (!id) {
        props = modals.pop();
      } else {
        modals.forEach(function (m, i) {
          if (m.id === id) {
            props = modals.splice(i, 1);
          }
        });
      }

      if (!props) {
        return;
      }

      if (props.onClose) {
        props.onClose();
      }
      this.setState({ modals: modals, increase: false });

      if (modals.length === 0) {
        document.body.style.height = '';
        document.body.style.overflow = '';
      }
    }
  }, {
    key: 'close',
    value: function close() {
      _pubsubJs2.default.publish(REMOVE_MODAL);
    }
  }, {
    key: 'clickaway',
    value: function clickaway(event) {
      if (event.target.className === 'cmpt-modal-inner') {
        event.stopPropagation();
        _pubsubJs2.default.publish(CLICKAWAY);
      }
    }
  }, {
    key: 'renderModals',
    value: function renderModals() {
      var _this2 = this;

      var modalLength = this.state.modals.length;
      return this.state.modals.map(function (options, i) {
        var style = {
          width: options.width || 500
        };

        var header = void 0,
            buttons = [];
        if (options.header) {
          header = _react2.default.createElement(
            'div',
            { className: 'cmpt-modal-header' },
            options.header
          );
        }

        if (options.buttons) {
          buttons = Object.keys(options.buttons).map(function (btn, j) {
            var func = options.buttons[btn],
                status = j === 0 ? 'primary' : '',
                handle = function handle() {
              if (func === true) {
                _this2.close();
              } else if (func === 'submit') {
                var form = _this2.elements[options.id].querySelector('form');
                if (form) {
                  var event = document.createEvent('HTMLEvents');
                  event.initEvent('submit');
                  form.dispatchEvent(event);
                }
              } else {
                if (func()) {
                  _this2.close();
                }
              }
            };
            return _react2.default.createElement(
              _button.Button,
              { status: status, key: btn, onClick: handle },
              btn
            );
          });
        }

        var className = (0, _classnames2.default)('cmpt-modal', {
          fadein: _this2.state.increase && modalLength - 1 === i,
          noPadding: options.noPadding
        });

        var clickaway = options.clickaway ? _this2.clickaway : undefined;

        return _react2.default.createElement(
          'div',
          { ref: function ref(el) {
              return _this2.elements[options.id] = el;
            }, className: 'cmpt-modal-inner', onClick: clickaway, style: { zIndex: ZINDEX + i }, key: options.id },
          _react2.default.createElement(
            'div',
            { style: style, className: className },
            _react2.default.createElement(
              'a',
              { className: 'cmpt-modal-close', onClick: _this2.close.bind(_this2, true) },
              _react2.default.createElement('span', null)
            ),
            header,
            _react2.default.createElement(
              'div',
              { className: 'cmpt-modal-content' },
              options.content
            ),
            buttons.length > 0 && _react2.default.createElement(
              'div',
              { className: 'cmpt-modal-footer' },
              buttons
            )
          )
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var mlen = this.state.modals.length;
      var className = (0, _classnames2.default)('cmpt-modal-container', { active: mlen > 0 });

      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement(_overlay.Overlay, {
          className: (0, _classnames2.default)({ active: mlen > 0 }),
          style: { zIndex: ZINDEX + mlen - 1 } }),
        this.renderModals()
      );
    }
  }]);

  return ModalContainer;
}(_react.Component);

// static method ===============================================================

function close(id) {
  _pubsubJs2.default.publish(REMOVE_MODAL, id);
};

function open(options) {
  if (!modalContainer) {
    createContainer();
  }
  if (!options.id) {
    options.id = (0, _str.nextUid)();
  }
  _pubsubJs2.default.publishSync(ADD_MODAL, options);
  return options.id;
};

function alert(content) {
  var header = arguments.length <= 1 || arguments[1] === undefined ? _react2.default.createElement(
    'span',
    null,
    ' '
  ) : arguments[1];

  var buttons = {};
  buttons[(0, _locals.getLang)('buttons.ok')] = true;

  return open({
    clickaway: false,
    content: content,
    header: header,
    buttons: buttons
  });
};

function confirm(content, callback) {
  var header = arguments.length <= 2 || arguments[2] === undefined ? _react2.default.createElement(
    'span',
    null,
    ' '
  ) : arguments[2];

  var buttons = {};

  buttons[(0, _locals.getLang)('buttons.ok')] = function () {
    callback();
    return true;
  };
  buttons[(0, _locals.getLang)('buttons.cancel')] = true;

  return open({
    clickaway: false,
    content: content,
    header: header,
    buttons: buttons
  });
};

function createContainer() {
  modalContainer = document.createElement('div');
  document.body.appendChild(modalContainer);
  _reactDom2.default.render(_react2.default.createElement(ModalContainer, null), modalContainer);
}

// modal ===================================================================

var Modal = function (_Component2) {
  _inherits(Modal, _Component2);

  function Modal(props) {
    _classCallCheck(this, Modal);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Modal).call(this, props));

    _this3.id = (0, _str.nextUid)();
    return _this3;
  }

  _createClass(Modal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.isOpen) {
        this.renderModal(this.props);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      if (!newProps.isOpen && !this.props.isOpen) {
        return;
      }

      if (newProps.isOpen) {
        this.renderModal(newProps);
      } else {
        close();
      }
    }
  }, {
    key: 'renderModal',
    value: function renderModal(props) {
      open((0, _objectAssign2.default)({}, props, {
        id: this.id,
        content: props.children
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      return _react.DOM.noscript();
    }
  }]);

  return Modal;
}(_react.Component);

Modal.propTypes = {
  buttons: _react.PropTypes.object,
  children: _react.PropTypes.any,
  isOpen: _react.PropTypes.bool,
  noPadding: _react.PropTypes.bool,
  onClose: _react.PropTypes.func,
  title: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element]),
  width: _react.PropTypes.number
};

Modal.open = open;
Modal.alert = alert;
Modal.confirm = confirm;
Modal.close = close;

module.exports = Modal;