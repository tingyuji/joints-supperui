(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],2:[function(require,module,exports){
'use strict';
/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],3:[function(require,module,exports){
/*
Copyright (c) 2010,2011,2012,2013,2014 Morgan Roderick http://roderick.dk
License: MIT - http://mrgnrdrck.mit-license.org

https://github.com/mroderick/PubSubJS
*/
(function (root, factory){
	'use strict';

    if (typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define(['exports'], factory);

    } else if (typeof exports === 'object'){
        // CommonJS
        factory(exports);

    }

    // Browser globals
    var PubSub = {};
    root.PubSub = PubSub;
    factory(PubSub);
    
}(( typeof window === 'object' && window ) || this, function (PubSub){
	'use strict';

	var messages = {},
		lastUid = -1;

	function hasKeys(obj){
		var key;

		for (key in obj){
			if ( obj.hasOwnProperty(key) ){
				return true;
			}
		}
		return false;
	}

	/**
	 *	Returns a function that throws the passed exception, for use as argument for setTimeout
	 *	@param { Object } ex An Error object
	 */
	function throwException( ex ){
		return function reThrowException(){
			throw ex;
		};
	}

	function callSubscriberWithDelayedExceptions( subscriber, message, data ){
		try {
			subscriber( message, data );
		} catch( ex ){
			setTimeout( throwException( ex ), 0);
		}
	}

	function callSubscriberWithImmediateExceptions( subscriber, message, data ){
		subscriber( message, data );
	}

	function deliverMessage( originalMessage, matchedMessage, data, immediateExceptions ){
		var subscribers = messages[matchedMessage],
			callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,
			s;

		if ( !messages.hasOwnProperty( matchedMessage ) ) {
			return;
		}

		for (s in subscribers){
			if ( subscribers.hasOwnProperty(s)){
				callSubscriber( subscribers[s], originalMessage, data );
			}
		}
	}

	function createDeliveryFunction( message, data, immediateExceptions ){
		return function deliverNamespaced(){
			var topic = String( message ),
				position = topic.lastIndexOf( '.' );

			// deliver the message as it is now
			deliverMessage(message, message, data, immediateExceptions);

			// trim the hierarchy and deliver message to each level
			while( position !== -1 ){
				topic = topic.substr( 0, position );
				position = topic.lastIndexOf('.');
				deliverMessage( message, topic, data, immediateExceptions );
			}
		};
	}

	function messageHasSubscribers( message ){
		var topic = String( message ),
			found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic])),
			position = topic.lastIndexOf( '.' );

		while ( !found && position !== -1 ){
			topic = topic.substr( 0, position );
			position = topic.lastIndexOf( '.' );
			found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic]));
		}

		return found;
	}

	function publish( message, data, sync, immediateExceptions ){
		var deliver = createDeliveryFunction( message, data, immediateExceptions ),
			hasSubscribers = messageHasSubscribers( message );

		if ( !hasSubscribers ){
			return false;
		}

		if ( sync === true ){
			deliver();
		} else {
			setTimeout( deliver, 0 );
		}
		return true;
	}

	/**
	 *	PubSub.publish( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	Publishes the the message, passing the data to it's subscribers
	**/
	PubSub.publish = function( message, data ){
		return publish( message, data, false, PubSub.immediateExceptions );
	};

	/**
	 *	PubSub.publishSync( message[, data] ) -> Boolean
	 *	- message (String): The message to publish
	 *	- data: The data to pass to subscribers
	 *	Publishes the the message synchronously, passing the data to it's subscribers
	**/
	PubSub.publishSync = function( message, data ){
		return publish( message, data, true, PubSub.immediateExceptions );
	};

	/**
	 *	PubSub.subscribe( message, func ) -> String
	 *	- message (String): The message to subscribe to
	 *	- func (Function): The function to call when a new message is published
	 *	Subscribes the passed function to the passed message. Every returned token is unique and should be stored if
	 *	you need to unsubscribe
	**/
	PubSub.subscribe = function( message, func ){
		if ( typeof func !== 'function'){
			return false;
		}

		// message is not registered yet
		if ( !messages.hasOwnProperty( message ) ){
			messages[message] = {};
		}

		// forcing token as String, to allow for future expansions without breaking usage
		// and allow for easy use as key names for the 'messages' object
		var token = 'uid_' + String(++lastUid);
		messages[message][token] = func;

		// return token for unsubscribing
		return token;
	};

	/* Public: Clears all subscriptions
	 */
	PubSub.clearAllSubscriptions = function clearAllSubscriptions(){
		messages = {};
	};

	/*Public: Clear subscriptions by the topic
	*/
	PubSub.clearSubscriptions = function clearSubscriptions(topic){
		var m; 
		for (m in messages){
			if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0){
				delete messages[m];
			}
		}
	};

	/* Public: removes subscriptions.
	 * When passed a token, removes a specific subscription.
	 * When passed a function, removes all subscriptions for that function
	 * When passed a topic, removes all subscriptions for that topic (hierarchy)
	 *
	 * value - A token, function or topic to unsubscribe.
	 *
	 * Examples
	 *
	 *		// Example 1 - unsubscribing with a token
	 *		var token = PubSub.subscribe('mytopic', myFunc);
	 *		PubSub.unsubscribe(token);
	 *
	 *		// Example 2 - unsubscribing with a function
	 *		PubSub.unsubscribe(myFunc);
	 *
	 *		// Example 3 - unsubscribing a topic
	 *		PubSub.unsubscribe('mytopic');
	 */
	PubSub.unsubscribe = function(value){
		var isTopic    = typeof value === 'string' && messages.hasOwnProperty(value),
			isToken    = !isTopic && typeof value === 'string',
			isFunction = typeof value === 'function',
			result = false,
			m, message, t;

		if (isTopic){
			delete messages[value];
			return;
		}

		for ( m in messages ){
			if ( messages.hasOwnProperty( m ) ){
				message = messages[m];

				if ( isToken && message[value] ){
					delete message[value];
					result = value;
					// tokens are unique, so we can just stop here
					break;
				}

				if (isFunction) {
					for ( t in message ){
						if (message.hasOwnProperty(t) && message[t] === value){
							delete message[t];
							result = true;
						}
					}
				}
			}
		}

		return result;
	};
}));

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('../Grid/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_Component) {
  _inherits(Button, _Component);

  function Button(props) {
    _classCallCheck(this, Button);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Button).call(this, props));

    _this.state = {
      disabled: props.disabled,
      show: null
    };
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(Button, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.disabled !== this.props.disabled) {
        this.setState({ disabled: nextProps.disabled });
      }
    }
  }, {
    key: 'disable',
    value: function disable(elem) {
      this.setState({ disabled: true, show: elem });
    }
  }, {
    key: 'enable',
    value: function enable(elem) {
      this.setState({ disabled: false, show: elem });
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      if (this.props.onClick) {
        this.props.onClick();
      }
      if (this.props.once) {
        this.disable();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var status = this.props.status;
      if (status) {
        status = 'cmpt-button-' + status;
      }

      var className = (0, _classnames2.default)(this.props.className, (0, _util.getGrid)(this.props.grid), 'cmpt-button', status);

      return _react2.default.createElement(
        'button',
        { onClick: this.handleClick,
          style: this.props.style,
          disabled: this.state.disabled,
          className: className,
          type: this.props.type || 'button' },
        this.state.show || this.props.children
      );
    }
  }]);

  return Button;
}(_react.Component);

Button.propTypes = {
  children: _react.PropTypes.any,
  className: _react.PropTypes.string,
  disabled: _react.PropTypes.bool,
  grid: _react.PropTypes.object,
  onClick: _react.PropTypes.func,
  once: _react.PropTypes.bool,
  status: _react.PropTypes.string,
  style: _react.PropTypes.object,
  type: _react.PropTypes.oneOf(['submit', 'button'])
};

module.exports = Button;

},{"../Grid/util":33,"classnames":1,"react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 按钮组件
 * 
 * Created by Ray on 2016-03-30
 */

exports.Button = _Button2.default;
exports.default = {
  Button: _Button2.default
};

},{"./Button":4,"react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Card = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 卡片组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Ray on 2016-03-30
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Card = exports.Card = function (_React$Component) {
  _inherits(Card, _React$Component);

  function Card(props) {
    _classCallCheck(this, Card);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Card).call(this, props));
  }

  _createClass(Card, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var children = _props.children;


      var cls = (0, _classnames2.default)(_defineProperty({
        "cmpt-card": true
      }, className, className));

      return _react2.default.createElement(
        'div',
        { className: cls },
        children
      );
    }
  }]);

  return Card;
}(_react2.default.Component);

;

exports.default = Card;

},{"classnames":1,"react":"react"}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardHeader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 卡片组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Ray on 2016-03-30
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CardHeader = exports.CardHeader = function (_React$Component) {
  _inherits(CardHeader, _React$Component);

  function CardHeader(props) {
    _classCallCheck(this, CardHeader);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CardHeader).call(this, props));
  }

  _createClass(CardHeader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var children = _props.children;


      var cls = (0, _classnames2.default)(_defineProperty({
        "cmpt-card-header": true

      }, className, className));

      return _react2.default.createElement(
        'div',
        { className: cls },
        this.props.children
      );
    }
  }]);

  return CardHeader;
}(_react2.default.Component);

;

exports.default = CardHeader;

},{"classnames":1,"react":"react"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardMedia = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 卡片组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Ray on 2016-03-30
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CardMedia = exports.CardMedia = function (_React$Component) {
  _inherits(CardMedia, _React$Component);

  function CardMedia(props) {
    _classCallCheck(this, CardMedia);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CardMedia).call(this, props));
  }

  _createClass(CardMedia, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var children = _props.children;


      var cls = (0, _classnames2.default)(_defineProperty({
        "cmpt-card-media": true
      }, className, className));

      return _react2.default.createElement(
        'div',
        { className: cls },
        children,
        _react2.default.createElement(
          'div',
          { className: 'overlay-container' },
          _react2.default.createElement(
            'div',
            { className: 'overlay' },
            this.props.overlay ? _react2.default.createElement(
              'div',
              { className: 'overlay-content' },
              this.props.overlay
            ) : ''
          )
        )
      );
    }
  }]);

  return CardMedia;
}(_react2.default.Component);

;

exports.default = CardMedia;

},{"classnames":1,"react":"react"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardPanel = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 卡片面板
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Ray on 2016-03-30
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CardPanel = exports.CardPanel = function (_React$Component) {
  _inherits(CardPanel, _React$Component);

  function CardPanel(props) {
    _classCallCheck(this, CardPanel);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CardPanel).call(this, props));
  }

  _createClass(CardPanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var children = _props.children;


      var cls = (0, _classnames2.default)(_defineProperty({
        "cmpt-card-panel": true
      }, className, className));

      return _react2.default.createElement(
        'div',
        _extends({}, this.props, { className: cls }),
        children
      );
    }
  }]);

  return CardPanel;
}(_react2.default.Component);

;

exports.default = CardPanel;

},{"classnames":1,"react":"react"}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardText = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 卡片组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Ray on 2016-03-30
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CardText = exports.CardText = function (_React$Component) {
  _inherits(CardText, _React$Component);

  function CardText(props) {
    _classCallCheck(this, CardText);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CardText).call(this, props));
  }

  _createClass(CardText, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var children = _props.children;


      var cls = (0, _classnames2.default)(_defineProperty({
        "cmpt-card-text": true
      }, className, className));

      return _react2.default.createElement(
        'div',
        { className: cls },
        children
      );
    }
  }]);

  return CardText;
}(_react2.default.Component);

;

exports.default = CardText;

},{"classnames":1,"react":"react"}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardTitle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 卡片组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Ray on 2016-03-30
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CardTitle = exports.CardTitle = function (_React$Component) {
  _inherits(CardTitle, _React$Component);

  function CardTitle(props) {
    _classCallCheck(this, CardTitle);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CardTitle).call(this, props));
  }

  _createClass(CardTitle, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var title = _props.title;
      var subtitle = _props.subtitle;


      var cls = (0, _classnames2.default)(_defineProperty({
        "cmpt-card-title": true
      }, className, className));

      return _react2.default.createElement(
        'div',
        { className: cls },
        title ? _react2.default.createElement(
          'div',
          { className: 'title' },
          title
        ) : '',
        subtitle ? _react2.default.createElement(
          'div',
          { className: 'subtitle' },
          subtitle
        ) : ''
      );
    }
  }]);

  return CardTitle;
}(_react2.default.Component);

;

exports.default = CardTitle;

},{"classnames":1,"react":"react"}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardPanel = exports.CardText = exports.CardMedia = exports.CardTitle = exports.CardHeader = exports.Card = undefined;

var _card = require('./card');

var _card2 = _interopRequireDefault(_card);

var _cardheader = require('./cardheader');

var _cardheader2 = _interopRequireDefault(_cardheader);

var _cardtitle = require('./cardtitle');

var _cardtitle2 = _interopRequireDefault(_cardtitle);

var _cardmedia = require('./cardmedia');

var _cardmedia2 = _interopRequireDefault(_cardmedia);

var _cardtext = require('./cardtext');

var _cardtext2 = _interopRequireDefault(_cardtext);

var _cardpanel = require('./cardpanel');

var _cardpanel2 = _interopRequireDefault(_cardpanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 卡片组件
 * 
 * Created by Ray on 2016-03-30
 */

exports.Card = _card2.default;
exports.CardHeader = _cardheader2.default;
exports.CardTitle = _cardtitle2.default;
exports.CardMedia = _cardmedia2.default;
exports.CardText = _cardtext2.default;
exports.CardPanel = _cardpanel2.default;
exports.default = {
  Card: _card2.default,
  CardHeader: _cardheader2.default,
  CardTitle: _cardtitle2.default,
  CardMedia: _cardmedia2.default,
  CardText: _cardtext2.default,
  CardPanel: _cardpanel2.default
};

},{"./card":6,"./cardheader":7,"./cardmedia":8,"./cardpanel":9,"./cardtext":10,"./cardtitle":11}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Checkbox = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Form = require('../Form');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Checkbox = exports.Checkbox = function (_Component) {
  _inherits(Checkbox, _Component);

  function Checkbox(props) {
    _classCallCheck(this, Checkbox);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Checkbox).call(this, props));

    _this.state = {
      checked: !!props.checked || props.value === props.checkValue
    };
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(Checkbox, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.checked !== this.props.checked && nextProps.checked !== this.state.checked) {
        this.handleChange(null, nextProps.checked);
      }
      if (nextProps.value !== this.props.value || nextProps.checkValue !== this.props.checkValue) {
        this.setValue(nextProps.value, nextProps.checkValue);
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event, checked) {
      var _this2 = this;

      if (this.props.readOnly) {
        return;
      }

      if (event) {
        checked = event.target.checked;
      }
      this.setState({ checked: checked });
      setTimeout(function () {
        if (_this2.props.onChange) {
          var value = checked ? _this2.props.checkValue : undefined;
          _this2.props.onChange(value, checked, _this2.props.index, event);
        }
      }, 0);
    }

    /*
    getValue () {
      return this._input.checked ? (this.props.value || true) : false;
    }
    */

  }, {
    key: 'setValue',
    value: function setValue(value) {
      var checkValue = arguments.length <= 1 || arguments[1] === undefined ? this.props.checkValue : arguments[1];

      this.setState({ checked: value === checkValue });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'label',
        { style: this.props.style, className: (0, _classnames2.default)(this.props.className, 'cmpt-checkbox') },
        _react2.default.createElement('input', { ref: function ref(c) {
            return _this3._input = c;
          },
          type: 'checkbox',
          disabled: this.props.readOnly,
          onChange: this.handleChange,
          checked: this.state.checked,
          value: this.props.value
        }),
        this.props.text,
        this.props.children
      );
    }
  }]);

  return Checkbox;
}(_react.Component);

Checkbox.propTypes = {
  checkValue: _react.PropTypes.any,
  checked: _react.PropTypes.bool,
  children: _react.PropTypes.any,
  className: _react.PropTypes.string,
  index: _react.PropTypes.number,
  onChange: _react.PropTypes.func,
  position: _react.PropTypes.number,
  readOnly: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  text: _react.PropTypes.any,
  value: _react.PropTypes.any
};

Checkbox.defaultProps = {
  checkValue: true
};

module.exports = (0, _Form.register)(Checkbox, 'checkbox');

// export for CheckboxGroup
module.exports.Checkbox = Checkbox;

},{"../Form":29,"classnames":1,"react":"react"}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckboxGroup = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _checkbox = require('./checkbox');

var _supperutils = require('supperutils');

var _Form = require('../Form');

var _Fetch = require('../_mixins/Fetch');

var _locals = require('../../locals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var toArray = _supperutils.Str.toArray;
var deepEqual = _supperutils.Obj.deepEqual;
var toTextValue = _supperutils.Obj.toTextValue;
var hashcode = _supperutils.Obj.hashcode;
var clone = _supperutils.Obj.clone;

var CheckboxGroup = exports.CheckboxGroup = function (_Component) {
  _inherits(CheckboxGroup, _Component);

  function CheckboxGroup(props) {
    _classCallCheck(this, CheckboxGroup);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CheckboxGroup).call(this, props));

    var values = toArray(props.value, props.sep);
    _this.state = {
      value: values,
      data: _this.formatData(props.data, values)
    };
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(CheckboxGroup, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _isValueChanged = !deepEqual(nextProps.value, this.props.value);
      var _isDataChanged = !deepEqual(nextProps.data, this.getRealData());

      if (_isDataChanged) {
        this.setState({ data: this.formatData(nextProps.data) }, function () {
          if (_isValueChanged) {
            this.setValue(nextProps.value);
          }
        });
      } else if (_isValueChanged) {
        this.setValue(nextProps.value);
      }
    }
  }, {
    key: 'getRealData',
    value: function getRealData() {
      var _data = clone(this.props.data);

      delete _data.$checked;
      delete _data.$value;
      delete _data.$text;
      delete _data.$key;

      return _data;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      value = toArray(value, this.props.sep);
      if (this.state) {
        var data = this.state.data.map(function (d) {
          d.$checked = value.indexOf(d.$value) >= 0;
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
      var value = arguments.length <= 1 || arguments[1] === undefined ? this.state.value : arguments[1];

      data = toTextValue(data, this.props.textTpl, this.props.valueTpl).map(function (d) {
        d.$checked = value.indexOf(d.$value) >= 0;
        return d;
      });

      _react.Children.map(this.props.children, function (child) {
        if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object') {
          var position = child.props.position;
          if (position === undefined) {
            position = data.length;
          }
          data = [].concat(_toConsumableArray(data.slice(0, position)), [{
            $checked: value.indexOf(child.props.checkValue) >= 0,
            $value: child.props.checkValue,
            $text: child.props.children || child.props.text,
            $key: hashcode(child.props.checkValue + '-' + child.props.text)
          }], _toConsumableArray(data.slice(position)));
        }
      });
      return data;
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

      if (sep && typeof sep === 'string') {
        value = value.join(sep);
      } else if (typeof sep === 'function') {
        value = sep(raw);
      }

      return value;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(value, checked, index, event) {
      var data = this.state.data;
      data[index].$checked = checked;
      value = this.getValue(this.props.sep, data);

      this.setState({ value: value, data: data });

      if (this.props.onChange) {
        this.props.onChange(value, this, data[index], event);
      }
    }
  }, {
    key: 'renderItems',
    value: function renderItems() {
      var _this2 = this;

      return this.state.data.map(function (item, i) {
        return _react2.default.createElement(_checkbox.Checkbox, { key: item.$key,
          index: i,
          readOnly: _this2.props.readOnly,
          checked: item.$checked,
          onChange: _this2.handleChange,
          text: item.$text,
          checkValue: item.$value
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var fetchStatus = _props.fetchStatus;
      var inline = _props.inline;

      // if get remote data pending or failure, render message

      if (fetchStatus !== _Fetch.FETCH_SUCCESS) {
        return _react2.default.createElement(
          'span',
          { className: 'fetch-' + fetchStatus },
          (0, _locals.getLang)('fetch.status')[fetchStatus]
        );
      }

      className = (0, _classnames2.default)(className, 'cmpt-checkbox-group', {
        'cmpt-inline': inline,
        'cmpt-block': !inline
      });

      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: className },
        this.renderItems()
      );
    }
  }]);

  return CheckboxGroup;
}(_react.Component);

CheckboxGroup.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.array]),
  className: _react.PropTypes.string,
  data: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]),
  fetchStatus: _react.PropTypes.string,
  inline: _react.PropTypes.bool,
  onChange: _react.PropTypes.func,
  readOnly: _react.PropTypes.bool,
  sep: _react.PropTypes.string,
  style: _react.PropTypes.object,
  textTpl: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  value: _react.PropTypes.any,
  valueTpl: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func])
};

CheckboxGroup.defaultProps = {
  data: [],
  sep: ',',
  inline: true,
  textTpl: '{text}',
  valueTpl: '{id}'
};

exports.CheckboxGroup = CheckboxGroup = (0, _Fetch.fetchEnhance)(CheckboxGroup);

module.exports = (0, _Form.register)(CheckboxGroup, 'checkbox-group', { valueType: 'array' });

},{"../../locals":68,"../Form":29,"../_mixins/Fetch":61,"./checkbox":13,"classnames":1,"react":"react","supperutils":"supperutils"}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioGroup = exports.Radio = exports.CheckboxGroup = exports.Checkbox = undefined;

var _checkbox = require('./checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _checkboxGroup = require('./checkboxGroup');

var _checkboxGroup2 = _interopRequireDefault(_checkboxGroup);

var _radio = require('./radio');

var _radio2 = _interopRequireDefault(_radio);

var _radioGroup = require('./radioGroup');

var _radioGroup2 = _interopRequireDefault(_radioGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * checkbox组件
 * 
 * Created by Ray on 2016-03-30
 */

exports.Checkbox = _checkbox2.default;
exports.CheckboxGroup = _checkboxGroup2.default;
exports.Radio = _radio2.default;
exports.RadioGroup = _radioGroup2.default;
exports.default = {
  Checkbox: _checkbox2.default,
  CheckboxGroup: _checkboxGroup2.default,
  Radio: _radio2.default,
  RadioGroup: _radioGroup2.default
};

},{"./checkbox":13,"./checkboxGroup":14,"./radio":16,"./radioGroup":17}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Radio = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Radio = exports.Radio = function (_Component) {
  _inherits(Radio, _Component);

  function Radio(props) {
    _classCallCheck(this, Radio);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Radio).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(Radio, [{
    key: 'handleClick',
    value: function handleClick() {
      if (this.props.onClick) {
        this.props.onClick(this.props.value, this.props.index);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'label',
        { style: this.props.style, className: 'cmpt-radio' },
        _react2.default.createElement('input', { ref: 'input',
          type: 'radio',
          disabled: this.props.readOnly,
          onChange: function onChange() {},
          onClick: this.handleClick,
          checked: this.props.checked,
          value: this.props.value
        }),
        _react2.default.createElement(
          'span',
          null,
          this.props.text
        )
      );
    }
  }]);

  return Radio;
}(_react.Component);

Radio.propTypes = {
  checked: _react.PropTypes.bool,
  index: _react.PropTypes.number,
  onClick: _react.PropTypes.func,
  readOnly: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  text: _react.PropTypes.any,
  value: _react.PropTypes.any
};

exports.default = Radio;

},{"react":"react"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioGroup = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _supperutils = require('supperutils');

var _radio = require('./radio');

var _radio2 = _interopRequireDefault(_radio);

var _Form = require('../Form');

var _Fetch = require('../_mixins/Fetch');

var _locals = require('../../locals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var deepEqual = _supperutils.Obj.deepEqual;
var toTextValue = _supperutils.Obj.toTextValue;
var hashcode = _supperutils.Obj.hashcode;


function transformValue(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== 'string') {
    value = value.toString();
  }

  return value;
}

var RadioGroup = exports.RadioGroup = function (_Component) {
  _inherits(RadioGroup, _Component);

  function RadioGroup(props) {
    _classCallCheck(this, RadioGroup);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RadioGroup).call(this, props));

    _this.state = {
      value: transformValue(props.value),
      data: _this.formatData(props.data)
    };
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(RadioGroup, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        this.setValue(nextProps.value);
      }
      if (!deepEqual(nextProps.data, this.props.data)) {
        this.setState({ data: this.formatData(nextProps.data) });
      }
    }
  }, {
    key: 'formatData',
    value: function formatData(data) {
      data = toTextValue(data, this.props.textTpl, this.props.valueTpl);
      _react.Children.map(this.props.children, function (child) {
        if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object') {
          var position = child.props.position;
          if (position === undefined) {
            position = data.length;
          }
          data = [].concat(_toConsumableArray(data.slice(0, position)), [{
            $value: child.props.value,
            $text: child.props.children || child.props.text,
            $key: hashcode(child.props.value + '-' + child.props.text)
          }], _toConsumableArray(data.slice(position)));
        }
      });
      return data;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      value = transformValue(value);
      this.setState({ value: value });
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.state.value;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(value) {
      if (this.props.readOnly) {
        return;
      }

      this.setState({ value: value });
      var change = this.props.onChange;
      if (change) {
        change(value);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var fetchStatus = _props.fetchStatus;
      var inline = _props.inline;
      var readOnly = _props.readOnly;

      // if get remote data pending or failure, render message

      if (fetchStatus !== _Fetch.FETCH_SUCCESS) {
        return _react2.default.createElement(
          'span',
          { className: 'fetch-' + fetchStatus },
          (0, _locals.getLang)('fetch.status')[fetchStatus]
        );
      }

      className = (0, _classnames2.default)(className, 'cmpt-radio-group', { 'cmpt-inline': inline });
      var items = this.state.data.map(function (item) {
        return _react2.default.createElement(_radio2.default, { key: item.$key,
          onClick: this.handleChange,
          readOnly: readOnly,
          checked: this.state.value === item.$value,
          text: item.$text,
          value: item.$value
        });
      }, this);

      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: className },
        items
      );
    }
  }]);

  return RadioGroup;
}(_react.Component);

RadioGroup.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.array]),
  className: _react.PropTypes.string,
  data: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]),
  fetchStatus: _react.PropTypes.string,
  inline: _react.PropTypes.bool,
  onChange: _react.PropTypes.func,
  readOnly: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  textTpl: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  value: _react.PropTypes.any,
  valueTpl: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func])
};

RadioGroup.defaultProps = {
  textTpl: '{text}',
  valueTpl: '{id}',
  inline: true
};

exports.RadioGroup = RadioGroup = (0, _Fetch.fetchEnhance)(RadioGroup);

module.exports = (0, _Form.register)(RadioGroup, 'radio-group');

},{"../../locals":68,"../Form":29,"../_mixins/Fetch":61,"./radio":16,"classnames":1,"react":"react","supperutils":"supperutils"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var poslist = require('./util').getPositions(12, 50, -90);

var Clock = function (_Component) {
  _inherits(Clock, _Component);

  function Clock(props) {
    _classCallCheck(this, Clock);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Clock).call(this, props));

    _this.state = {
      current: props.current,
      stage: props.stage || 'clock',
      active: props.active,
      am: props.current.getHours() < 12
    };
    _this.close = _this.close.bind(_this);
    return _this;
  }

  _createClass(Clock, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.current !== this.props.current) {
        this.setState({ current: nextProps.current, am: nextProps.current.getHours() < 12 });
      }
    }
  }, {
    key: 'changeTimeStage',
    value: function changeTimeStage(stage) {
      this.setState({ stage: stage, active: true });
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      var d = {};
      d[this.state.stage] = value;
      this.props.onTimeChange(d);
    }
  }, {
    key: 'close',
    value: function close() {
      if (!this.props.timeOnly) {
        this.setState({ active: false });
      }
    }
  }, {
    key: 'getRotate',
    value: function getRotate(type) {
      var current = this.state.current,
          value = void 0,
          max = type === 'hour' ? 12 : 60;

      switch (type) {
        case 'hour':
          value = current.getHours() + current.getMinutes() / 60;
          break;
        case 'minute':
          value = current.getMinutes() + current.getSeconds() / 60;
          break;
        case 'second':
          value = current.getSeconds();
          break;
      }

      value = value * 360 / max - 90;
      return 'rotate(' + value + 'deg)';
    }
  }, {
    key: 'renderPointer',
    value: function renderPointer() {
      var stage = this.state.stage;

      var pointer = function pointer(type, context) {
        var rotate = context.getRotate(type);
        return _react2.default.createElement('div', { style: { transform: rotate, WebkitTransform: rotate }, className: (0, _classnames2.default)(type, { active: stage === type }) });
      };

      return _react2.default.createElement(
        'div',
        { className: 'pointer' },
        pointer('hour', this),
        pointer('minute', this),
        pointer('second', this)
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var steps = [],

      //current = this.state.current,
      stage = this.state.stage,
          step = stage === 'hour' || stage === 'clock' ? 1 : 5;

      for (var i = 0, s; i < 12; i++) {
        s = i * step;
        if (!this.state.am && stage === 'hour') {
          s += 12;
        }
        steps.push(s);
      }

      var sets = steps.map(function (s, i) {
        var _this2 = this;

        var pos = poslist[i],
            left = pos[0] + '%',
            top = pos[1] + '%';
        return _react2.default.createElement(
          'div',
          { onClick: function onClick() {
              _this2.setValue(s);
            }, className: (0, _classnames2.default)('clock-set'), key: i, style: { left: left, top: top } },
          s
        );
      }, this);

      var className = (0, _classnames2.default)('clock-wrapper', { active: this.state.active });

      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement('div', { onClick: this.close, className: 'clock-overlay' }),
        !this.props.timeOnly && _react2.default.createElement(
          'div',
          { onClick: this.close, className: 'clock-close' },
          _react2.default.createElement('i', { className: 'icon close' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'clock' },
          _react2.default.createElement(
            'div',
            { className: 'clock-inner' },
            sets
          ),
          this.renderPointer(),
          stage === 'hour' && _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'div',
              { onClick: function onClick() {
                  _this3.setState({ am: true });
                }, className: (0, _classnames2.default)('time-am', { active: this.state.am }) },
              'AM'
            ),
            _react2.default.createElement(
              'div',
              { onClick: function onClick() {
                  _this3.setState({ am: false });
                }, className: (0, _classnames2.default)('time-pm', { active: !this.state.am }) },
              'PM'
            )
          )
        )
      );
    }
  }]);

  return Clock;
}(_react.Component);

Clock.propTypes = {
  active: _react.PropTypes.bool,
  current: _react.PropTypes.instanceOf(Date),
  onTimeChange: _react.PropTypes.func,
  stage: _react.PropTypes.string,
  timeOnly: _react.PropTypes.bool
};

exports.default = Clock;

},{"./util":23,"classnames":1,"react":"react"}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _supperutils = require('supperutils');

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

var overView = _supperutils.Dom.overView;
var getOuterHeight = _supperutils.Dom.getOuterHeight;


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
        return _supperutils.Dt.format(value, this.props.format);
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
      picker.style.display = 'block';
      var height = getOuterHeight(picker);

      setTimeout(function () {
        _this2.setState({
          active: true,
          popup: overView(_this2.refs.datetime, height),
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

},{"../../locals":68,"../../utils/dt":74,"../_mixins/ClickAway":60,"./Clock":18,"./TimeSet":21,"classnames":1,"react":"react","supperutils":"supperutils"}],20:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _supperutils = require('supperutils');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var shallowEqual = _supperutils.Obj.shallowEqual;

var Pair = function (_React$Component) {
  _inherits(Pair, _React$Component);

  function Pair(props) {
    _classCallCheck(this, Pair);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pair).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Pair, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !shallowEqual(nextProps, this.props) || !shallowEqual(this.state, nextState);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var names = _props.names;
      var min = _props.min;
      var max = _props.max;
      var con = _props.con;

      var other = _objectWithoutProperties(_props, ['names', 'min', 'max', 'con']);

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_index2.default, _extends({ min: min, name: names[0] }, other, {
          max: this.state.second,
          onChange: function onChange(first) {
            return _this2.setState({ first: first });
          }
        })),
        con,
        _react2.default.createElement(_index2.default, _extends({ max: max, name: names[1] }, other, {
          min: this.state.first,
          onChange: function onChange(second) {
            return _this2.setState({ second: second });
          }
        }))
      );
    }
  }]);

  return Pair;
}(_react2.default.Component);

;

Pair.isFormItem = true;

Pair.propTypes = {
  con: _react.PropTypes.any,
  max: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.object]),
  min: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.object]),
  names: _react.PropTypes.array
};

Pair.defaultProps = {
  con: '-',
  names: []
};

module.exports = Pair;

},{"./index":22,"react":"react","supperutils":"supperutils"}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeSet = function (_Component) {
  _inherits(TimeSet, _Component);

  function TimeSet(props) {
    _classCallCheck(this, TimeSet);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimeSet).call(this, props));

    _this.state = {
      value: props.value || 0,
      type: props.type
    };
    _this.changeStage = _this.changeStage.bind(_this);
    _this.add = _this.add.bind(_this);
    _this.sub = _this.sub.bind(_this);
    return _this;
  }

  _createClass(TimeSet, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        this.setState({ value: nextProps.value });
      }
    }
  }, {
    key: 'add',
    value: function add() {
      var value = this.state.value,
          max = this.props.type === 'hour' ? 24 : 60;
      value += 1;
      if (value >= max) {
        value = 0;
      }
      this.changeTime(value);
    }
  }, {
    key: 'sub',
    value: function sub() {
      var value = this.state.value,
          max = this.props.type === 'hour' ? 23 : 59;
      value -= 1;
      if (value < 0) {
        value = max;
      }
      this.changeTime(value);
    }
  }, {
    key: 'changeTime',
    value: function changeTime(value) {
      var d = {};
      d[this.props.type] = value;
      var success = this.props.onTimeChange(d);
      if (!success) {
        return;
      }
      this.setState({ value: value });
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.setState({ value: value });
    }
  }, {
    key: 'changeStage',
    value: function changeStage() {
      this.props.onStageChange(this.props.type);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { onClick: this.changeStage, className: 'time-set' },
        _react2.default.createElement(
          'div',
          { className: 'text' },
          _react2.default.createElement(
            'span',
            null,
            this.state.value
          ),
          _react2.default.createElement(
            'a',
            { onClick: this.add, className: 'add' },
            _react2.default.createElement('i', { className: 'icon angle-up' })
          ),
          _react2.default.createElement(
            'a',
            { onClick: this.sub, className: 'sub' },
            _react2.default.createElement('i', { className: 'icon angle-down' })
          )
        )
      );
    }
  }]);

  return TimeSet;
}(_react.Component);

TimeSet.propTypes = {
  onStageChange: _react.PropTypes.func,
  onTimeChange: _react.PropTypes.func,
  type: _react.PropTypes.string,
  value: _react.PropTypes.number
};

exports.default = TimeSet;

},{"react":"react"}],22:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Datetime = require('./Datetime');

var _Datetime2 = _interopRequireDefault(_Datetime);

var _supperutils = require('supperutils');

var _enhance = require('../Form/enhance');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var shallowEqual = _supperutils.Obj.shallowEqual;

var Datepicker = function (_React$Component) {
  _inherits(Datepicker, _React$Component);

  function Datepicker(props) {
    _classCallCheck(this, Datepicker);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Datepicker).call(this, props));
  }

  _createClass(Datepicker, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !shallowEqual(this.props, nextProps);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_Datetime2.default, this.props);
    }
  }]);

  return Datepicker;
}(_react2.default.Component);

module.exports = (0, _enhance.register)(Datepicker, ['datetime', 'time', 'date'], { valueType: 'datetime' });

},{"../Form/enhance":28,"./Datetime":19,"react":"react","supperutils":"supperutils"}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPositions = getPositions;
function getAngle(r, angle, x0, y0) {
  var x1 = x0 + r * Math.cos(angle * Math.PI / 180);
  var y1 = y0 + r * Math.sin(angle * Math.PI / 180);
  return [x1.toFixed(2), y1.toFixed(2)];
}

/**
 * @param {count} point's count
 * @param {r} radius
 * @param {angle} init angle
 * @param {x0} center point x
 * @param {y0} center point y
 */
function getPositions(count) {
  var r = arguments.length <= 1 || arguments[1] === undefined ? 50 : arguments[1];
  var angle = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  var x0 = arguments.length <= 3 || arguments[3] === undefined ? r : arguments[3];
  var y0 = arguments.length <= 4 || arguments[4] === undefined ? r : arguments[4];

  var pos = [];
  var step = 360 / count;
  for (var i = 0; i < count; i++) {
    pos.push(getAngle(r, step * i + angle, x0, y0));
  }
  return pos;
}

},{}],24:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _supperutils = require('supperutils');

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

var forEach = _supperutils.Obj.forEach;
var deepEqual = _supperutils.Obj.deepEqual;
var hashcode = _supperutils.Obj.hashcode;
var clone = _supperutils.Obj.clone;

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
    _this.reset = _this.reset.bind(_this);
    _this.getData = _this.getData.bind(_this);
    _this.validateField = _this.validateField.bind(_this);

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

    _this.validate = _this.validate.bind(_this);
    return _this;
  }

  _createClass(Form, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!deepEqual(this.props.data, nextProps.data)) {
        this.setState({ data: nextProps.data });

        // if data changed, clear validation
        forEach(this.items, function (item) {
          delete item.$validation;
        });
      }
    }
  }, {
    key: 'validate',
    value: function validate() {
      var _this2 = this;

      var success = true;
      forEach(this.items, function (item) {
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
    key: 'validateField',
    value: function validateField(name) {
      var success = true;

      forEach(this.items, function (item) {
        if (item.name === name) {
          success = item.validate();
          return false;
        }
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
          var data = clone(_this3.state.data);

          // remove ignore value
          forEach(_this3.items, function (item) {
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
      var data = clone(this.state.data);

      return data;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.setState({
        data: this.props.resetData || {}
      });
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


      return clone(controls).map(function (control, i) {
        if ((typeof control === 'undefined' ? 'undefined' : _typeof(control)) !== 'object') {
          return control;
        } else {
          control.key = control.key || control.name || hashcode(control);
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

},{"../../locals":68,"../Grid/util":33,"../_mixins/Fetch":61,"./FormControl":25,"./FormSubmit":27,"classnames":1,"react":"react","supperutils":"supperutils"}],25:[function(require,module,exports){
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

},{"../../locals":68,"../Grid/util":33,"./enhance":28,"classnames":1,"react":"react","supperutils":"supperutils"}],26:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enhance = require('./enhance');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormItem = function (_React$Component) {
  _inherits(FormItem, _React$Component);

  function FormItem(props) {
    _classCallCheck(this, FormItem);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FormItem).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(FormItem, [{
    key: 'handleChange',
    value: function handleChange(value) {
      if (value && value.nativeEvent) {
        value = value.target.value;
      }
      this.props.onChange(value);
    }
  }, {
    key: 'render',
    value: function render() {
      return (0, _react.cloneElement)(this.props.children, {
        value: this.props.value || '',
        onChange: this.handleChange
      });
    }
  }]);

  return FormItem;
}(_react2.default.Component);

FormItem.propTypes = {
  children: _react.PropTypes.element,
  onChange: _react.PropTypes.func,
  value: _react.PropTypes.any
};

module.exports = (0, _enhance.enhance)(FormItem);

},{"./enhance":28,"react":"react"}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormSubmit = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _button = require('../button');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormSubmit = exports.FormSubmit = function (_Component) {
  _inherits(FormSubmit, _Component);

  function FormSubmit() {
    _classCallCheck(this, FormSubmit);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(FormSubmit).apply(this, arguments));
  }

  _createClass(FormSubmit, [{
    key: 'render',
    value: function render() {
      var props = this.props;

      var children = props.children;
      var content = void 0;
      if (Array.isArray(children)) {
        content = props.disabled ? children[1] : children[0];
      } else {
        content = children;
      }

      return _react2.default.createElement(
        'div',
        { style: props.style, className: 'cmpt-control-group' },
        _react2.default.createElement(
          _button.Button,
          { type: 'submit',
            status: 'primary',
            onClick: props.onClick,
            disabled: props.disabled },
          content
        )
      );
    }
  }]);

  return FormSubmit;
}(_react.Component);

FormSubmit.propTypes = {
  children: _react.PropTypes.any,
  disabled: _react.PropTypes.bool,
  onClick: _react.PropTypes.func,
  style: _react.PropTypes.object
};

module.exports = FormSubmit;

},{"../button":63,"react":"react"}],28:[function(require,module,exports){
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

var _supperutils = require('supperutils');

var _util = require('./util');

var FormUtil = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var forEach = _supperutils.Obj.forEach;
var deepEqual = _supperutils.Obj.deepEqual;
var shallowEqual = _supperutils.Obj.shallowEqual;
var hashcode = _supperutils.Obj.hashcode;
var clone = _supperutils.Obj.clone;
var toStyleObject = _supperutils.Str.toStyleObject;
var nextUid = _supperutils.Str.nextUid;
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
      _this.getValue = _this.getValue.bind(_this);
      _this.setValue = _this.setValue.bind(_this);
      _this.validate = _this.validate.bind(_this);
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
        return !shallowEqual(nextProps, this.props) || !shallowEqual(this.state, nextState);
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

        this.id = nextUid();
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
          style = toStyleObject(style);
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

},{"./util":30,"classnames":1,"react":"react","supperutils":"supperutils"}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormSubmit = exports.FormControl = exports.FormItem = exports.Form = exports.register = undefined;

var _enhance = require('./enhance');

var _Form = require('./Form');

var _Form2 = _interopRequireDefault(_Form);

var _FormItem = require('./FormItem');

var _FormItem2 = _interopRequireDefault(_FormItem);

var _FormControl = require('./FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _FormSubmit = require('./FormSubmit');

var _FormSubmit2 = _interopRequireDefault(_FormSubmit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.register = _enhance.register;
exports.Form = _Form2.default;
exports.FormItem = _FormItem2.default;
exports.FormControl = _FormControl2.default;
exports.FormSubmit = _FormSubmit2.default;
exports.default = {
  Form: _Form2.default,
  FormItem: _FormItem2.default,
  FormControl: _FormControl2.default,
  FormSubmit: _FormSubmit2.default
};

},{"./Form":24,"./FormControl":25,"./FormItem":26,"./FormSubmit":27,"./enhance":28}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _supperutils = require('supperutils');

var _locals = require('../../locals');

var Regs = _supperutils.Regex;
var format = _supperutils.Str.format;
var toArray = _supperutils.Str.toArray;


function handleError(label, value, key, tip) {
  // handle error
  var text = (0, _locals.getLang)('validation.tips.' + key, null);
  if (text) {
    text = (label || '') + format(text, value);
  } else {
    text = tip;
  }
  return new Error(text);
}

function validate(value, valueType, _ref) {
  var label = _ref.label;
  var required = _ref.required;
  var min = _ref.min;
  var max = _ref.max;
  var readOnly = _ref.readOnly;
  var sep = _ref.sep;
  var tip = _ref.tip;
  var type = _ref.type;
  var validator = _ref.validator;
  var formData = _ref.formData;

  var len = 0;

  if (readOnly) {
    return true;
  }

  // validate required
  if (required && (value === undefined || value === null || value.length === 0)) {
    return handleError(label, value, 'required', tip);
  }

  var reg = Regs[type];

  // custom validator
  if (validator) {
    if (typeof validator === 'function') {
      validator = { func: validator };
    }
    if (validator.func) {
      return validator.func(value, formData);
    }
    if (validator.reg) {
      reg = validator.reg;
      if (typeof reg === 'string') {
        reg = new RegExp(reg);
      }
    }
  }

  // skip empty value
  if (value === undefined || value === null || value === '') {
    return true;
  }

  // validate type
  if (reg && !reg.test(value)) {
    return handleError(label, value, type, tip);
  }

  switch (valueType) {
    case 'array':
      len = toArray(value, sep).length;
      break;
    case 'number':
      len = parseFloat(value);
      break;
    default:
      len = value.length;
      break;
  }

  if (max && len > max) {
    return handleError(label, max, 'max.' + valueType, tip);
  }

  if (min && len < min) {
    return handleError(label, min, 'min.' + valueType, tip);
  }

  return true;
};

},{"../../locals":68,"supperutils":"supperutils"}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grid = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Grid = exports.Grid = function (_Component) {
  _inherits(Grid, _Component);

  function Grid() {
    _classCallCheck(this, Grid);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Grid).apply(this, arguments));
  }

  _createClass(Grid, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var width = _props.width;
      var offset = _props.offset;
      var responsive = _props.responsive;
      var style = _props.style;
      var children = _props.children;

      className = (0, _classnames2.default)(className, (0, _util.getGrid)({ width: width, offset: offset, responsive: responsive }));
      return _react2.default.createElement(
        'div',
        { style: style, className: className },
        children
      );
    }
  }]);

  return Grid;
}(_react.Component);

;

Grid.propTypes = {
  children: _react.PropTypes.any,
  className: _react.PropTypes.string,
  offset: _react.PropTypes.number,
  responsive: _react.PropTypes.string,
  style: _react.PropTypes.object,
  width: _react.PropTypes.number
};

module.exports = Grid;

},{"./util":33,"classnames":1,"react":"react"}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridUtil = exports.Grid = undefined;

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 删格系统
 * 
 * Created by Ray on 2016-03-30
 */

exports.Grid = _Grid2.default;
exports.GridUtil = _util2.default;
exports.default = {
  Grid: _Grid2.default,
  GridUtil: _util2.default
};

},{"./Grid":31,"./util":33}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.setOptions = setOptions;
exports.getGrid = getGrid;
var GRIDS = {};
var OFFSETS = {};
var RESPONSIVE = {
  'sm': '568',
  'md': '768',
  'lg': '992',
  'xl': '1200'
};
var gridPre = 'cmpt-grid';
var offsetPre = 'cmpt-offset';
var defaultResponsive = 'md';

function setOptions(options) {
  if (!options) {
    return;
  }
  if (options.gridPre) {
    gridPre = options.gridPre;
  }
  if (options.offsetPre) {
    offsetPre = options.offsetPre;
  }
  if (options.responsive) {
    defaultResponsive = options.responsive;
  }
}

function getGrid(options) {
  if (!options) {
    return '';
  }
  if (typeof options === 'number') {
    options = { width: options };
  }

  var _options = options;
  var width = _options.width;
  var offset = _options.offset;
  var responsive = _options.responsive;

  var gridClass = generate(width, 'grid', responsive);
  var offsetClass = generate(offset, 'offset', responsive);

  return gridPre + ' ' + gridPre + '-1 ' + gridClass + ' ' + offsetClass;
}

function generate(width, type, responsive) {
  if (!width || width <= 0) {
    return '';
  }

  if (width > 1) {
    width = 1;
  }
  width = (width * 100).toFixed(4);
  width = width.substr(0, width.length - 1);

  responsive = responsive || defaultResponsive;
  var key = responsive + '-' + width.replace('.', '-');
  if (type === 'grid') {
    if (!GRIDS[key]) {
      generateGrid(width, key, responsive);
    }
    return gridPre + '-' + key;
  } else {
    if (!OFFSETS[key]) {
      generateOffset(width, key, responsive);
    }
    return offsetPre + '-' + key;
  }
}

function generateGrid(width, key, responsive) {
  GRIDS[key] = true;
  var minWidth = RESPONSIVE[responsive];
  var text = '@media screen and (min-width: ' + minWidth + 'px) { .' + gridPre + '-' + key + '{width: ' + width + '%} }';

  createStyle(text);
}

function generateOffset(width, key, responsive) {
  OFFSETS[key] = true;
  var minWidth = RESPONSIVE[responsive];
  var text = '@media screen and (min-width: ' + minWidth + 'px) { .' + offsetPre + '-' + key + '{margin-left: ' + width + '%} }';

  createStyle(text);
}

function createStyle(text) {
  if ((typeof document === 'undefined' ? 'undefined' : _typeof(document)) === "object" && document.createElement) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = text;
    document.head.appendChild(style);
  }
}

(function () {
  var text = [];

  text.push('\n.' + gridPre + ' {\n  display: inline-block;\n  zoom: 1;\n  letter-spacing: normal;\n  word-spacing: normal;\n  vertical-align: top;\n  text-rendering: auto;\n  box-sizing: border-box;\n}');

  text.push('.' + gridPre + '-1{width:100%}');
  createStyle(text.join(''));
})();

exports.default = {
  setOptions: setOptions,
  getGrid: getGrid
};

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icon = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 图标组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Ray on 2016-03-30
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var prefix = 'fa';

var Icon = exports.Icon = function (_Component) {
  _inherits(Icon, _Component);

  function Icon(props) {
    _classCallCheck(this, Icon);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Icon).call(this, props));

    _this.state = {
      spin: props.spin
    };
    return _this;
  }

  _createClass(Icon, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ spin: nextProps.spin });
    }
  }, {
    key: 'render',
    value: function render() {
      var classes = ['' + prefix];
      var _props = this.props;
      var style = _props.style;
      var font = _props.font;
      var size = _props.size;
      var icon = _props.icon;


      if (this.state.spin) {
        classes.push(prefix + '-spin');
      }

      if (icon) {
        classes.push(prefix + '-' + icon);
      }

      if (font) {
        style.fontFamily = font;
      }

      if (size) {
        if (typeof size === 'number' || size.length === 1) {
          size = size + 'x';
        }
        classes.push(prefix + '-' + size);
      }

      return _react2.default.createElement(
        'i',
        { style: style, className: _classnames2.default.apply(undefined, classes) },
        this.props.children
      );
    }
  }]);

  return Icon;
}(_react.Component);

Icon.propTypes = {
  children: _react.PropTypes.any,
  font: _react.PropTypes.string,
  icon: _react.PropTypes.string,
  size: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  spin: _react.PropTypes.bool,
  style: _react.PropTypes.object
};

Icon.setPrefix = function (pre) {
  prefix = pre;
};

exports.default = {
  Icon: Icon
};

},{"classnames":1,"react":"react"}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _supperutils = require('supperutils');

var _util = require('../Grid/util');

var _Form = require('../Form');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Regs = _supperutils.Regex;

var Input = exports.Input = function (_Component) {
  _inherits(Input, _Component);

  function Input(props) {
    _classCallCheck(this, Input);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Input).call(this, props));

    _this.state = {
      value: props.value
    };
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleTrigger = _this.handleTrigger.bind(_this);
    return _this;
  }

  _createClass(Input, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var value = nextProps.value;
      if (value !== this.props.value && value !== this.state.value) {
        this.setState({ value: value });
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      var _props = this.props;
      var readOnly = _props.readOnly;
      var type = _props.type;
      var trigger = _props.trigger;


      if (readOnly) {
        return;
      }

      var value = event.target.value;

      if (value && (type === 'integer' || type === 'number')) {
        if (!Regs[type].test(value)) {
          value = this.state.value || '';
        }
      }

      this.setState({ value: value });

      if (trigger === 'change') {
        this.handleTrigger(event);
      }
    }
  }, {
    key: 'handleTrigger',
    value: function handleTrigger(event) {
      var value = event.target.value;

      if (this.props.onChange) {
        this.props.onChange(value, event);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var className = _props2.className;
      var grid = _props2.grid;
      var type = _props2.type;
      var trigger = _props2.trigger;

      var others = _objectWithoutProperties(_props2, ['className', 'grid', 'type', 'trigger']);

      var props = {
        className: (0, _classnames2.default)(className, 'cmpt-form-control', (0, _util.getGrid)(grid)),
        onChange: this.handleChange,
        type: type === 'password' ? 'password' : 'text',
        value: this.state.value
      };

      if (trigger !== 'change') {
        var handle = 'on' + trigger.charAt(0).toUpperCase() + trigger.slice(1);
        props[handle] = this.handleTrigger;
      }

      return _react2.default.createElement('input', _extends({}, others, props));
    }
  }]);

  return Input;
}(_react.Component);

Input.propTypes = {
  className: _react.PropTypes.string,
  defaultValue: _react.PropTypes.string,
  grid: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object]),
  id: _react.PropTypes.string,
  onBlur: _react.PropTypes.func,
  onChange: _react.PropTypes.func,
  onFocus: _react.PropTypes.func,
  placeholder: _react.PropTypes.string,
  readOnly: _react.PropTypes.bool,
  rows: _react.PropTypes.number,
  style: _react.PropTypes.object,
  trigger: _react.PropTypes.string,
  type: _react.PropTypes.string,
  value: _react.PropTypes.any
};

Input.defaultProps = {
  trigger: 'blur',
  value: ''
};

module.exports = (0, _Form.register)(Input, ['text', 'mobile', 'email', 'alpha', 'alphanum', 'password', 'url', 'integer', 'number']);

},{"../Form":29,"../Grid/util":33,"classnames":1,"react":"react","supperutils":"supperutils"}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = undefined;

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Input = _Input2.default;
exports.default = {
  Input: _Input2.default
};

},{"./Input":35}],37:[function(require,module,exports){
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

},{"../Overlay":42,"classnames":1,"pubsub-js":3,"react":"react","react-dom":"react-dom"}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Message = undefined;

var _Message = require('./Message');

var _Message2 = _interopRequireDefault(_Message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Message = _Message2.default;
exports.default = {
  Message: _Message2.default
};

},{"./Message":37}],39:[function(require,module,exports){
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

var _supperutils = require('supperutils');

var _button = require('../button');

var _overlay = require('../overlay');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _locals = require('../../locals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var nextUid = _supperutils.Str.nextUid;


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
    options.id = nextUid();
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

    _this3.id = nextUid();
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

},{"../../locals":68,"../button":63,"../overlay":66,"classnames":1,"object-assign":2,"pubsub-js":3,"react":"react","react-dom":"react-dom","supperutils":"supperutils"}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Modal = undefined;

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Modal = _Modal2.default;
exports.default = {
  Modal: _Modal2.default
};

},{"./Modal":39}],41:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Overlay = function (_Component) {
  _inherits(Overlay, _Component);

  function Overlay() {
    _classCallCheck(this, Overlay);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Overlay).apply(this, arguments));
  }

  _createClass(Overlay, [{
    key: 'render',
    value: function render() {
      var className = (0, _classnames2.default)(this.props.className, 'cmpt-overlay');

      return _react2.default.createElement('div', { className: className, style: this.props.style, onClick: this.props.onClick });
    }
  }]);

  return Overlay;
}(_react.Component);

Overlay.propTypes = {
  className: _react.PropTypes.string,
  onClick: _react.PropTypes.func,
  style: _react.PropTypes.object
};

Overlay.defaultProps = {
  onClick: function onClick() {}
};

module.exports = Overlay;

},{"classnames":1,"react":"react"}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Overlay = undefined;

var _Overlay = require('./Overlay');

var _Overlay2 = _interopRequireDefault(_Overlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Overlay = _Overlay2.default;
exports.default = {
  Overlay: _Overlay2.default
};

},{"./Overlay":41}],43:[function(require,module,exports){
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

},{"../Form/enhance":28,"classnames":1,"react":"react"}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rating = undefined;

var _Rating = require('./Rating');

var _Rating2 = _interopRequireDefault(_Rating);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Rating = _Rating2.default;
exports.default = {
  Rating: _Rating2.default
};

},{"./Rating":43}],45:[function(require,module,exports){
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

},{"../../locals":68,"../Form/enhance":28,"../Grid/util":33,"../_mixins/ClickAway":60,"../_mixins/Fetch":61,"classnames":1,"react":"react","supperutils":"supperutils"}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Select = undefined;

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Select = _Select2.default;
exports.default = {
  Select: _Select2.default
};

},{"./Select":45}],47:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _supperutils = require('supperutils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var forEach = _supperutils.Obj.forEach;

var Pagination = function (_Component) {
  _inherits(Pagination, _Component);

  function Pagination(props) {
    _classCallCheck(this, Pagination);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pagination).call(this, props));

    _this.state = {
      index: props.index
    };
    _this.setInput = _this.setInput.bind(_this);
    return _this;
  }

  _createClass(Pagination, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.index !== this.props.index) {
        this.setState({ index: nextProps.index });
      }
    }
  }, {
    key: 'getIndex',
    value: function getIndex() {
      return this.state.index;
    }
  }, {
    key: 'setIndex',
    value: function setIndex(index) {
      index = parseInt(index);
      this.setState({ index: index });
    }
  }, {
    key: 'setInput',
    value: function setInput(event) {
      event.preventDefault();

      var value = this.refs.input.value;
      value = parseInt(value);
      if (isNaN(value)) {
        return;
      }
      if (value < 1) {
        this.handleChange(1);
        return;
      }

      this.setIndex(value);
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(index) {
      this.setIndex(index);
      if (this.refs.input) {
        this.refs.input.value = index;
      }
      if (this.props.onChange) {
        this.props.onChange(index);
      }
    }
  }, {
    key: 'getPages',
    value: function getPages() {
      var _props = this.props;
      var total = _props.total;
      var size = _props.size;
      var index = _props.index;
      var pages = _props.pages;

      var max = Math.ceil(total / size),
          left = void 0,
          right = void 0,
          span = pages || 10;

      // bad thing...
      pages = [];

      if (index > max) {
        index = max;
      }

      left = index - Math.floor(span / 2) + 1;
      if (left < 1) {
        left = 1;
      }
      right = left + span - 2;
      if (right >= max) {
        right = max;
        left = right - span + 2;
        if (left < 1) {
          left = 1;
        }
      } else {
        right -= left > 1 ? 1 : 0;
      }

      // push first
      if (left > 1) {
        pages.push(1);
      }
      if (left > 2) {
        pages.push('<..');
      }
      for (var i = left; i < right + 1; i++) {
        pages.push(i);
      }
      if (right < max - 1) {
        pages.push('..>');
      }
      // push last
      if (right < max) {
        pages.push(max);
      }

      return { pages: pages, max: max };
    }
  }, {
    key: 'render',
    value: function render() {
      var index = this.state.index;
      var mini = this.props.mini;

      var _getPages = this.getPages();

      var pages = _getPages.pages;
      var max = _getPages.max;
      var items = [];

      // Previous
      items.push(_react2.default.createElement(
        'li',
        { key: 'previous', onClick: index <= 1 ? null : this.handleChange.bind(this, index - 1), className: (0, _classnames2.default)('previous', { disabled: index <= 1 }) },
        _react2.default.createElement(
          'a',
          null,
          _react2.default.createElement(
            'span',
            null,
            ' '
          )
        )
      ));

      if (mini) {
        items.push(_react2.default.createElement(
          'form',
          { key: 'i', onSubmit: this.setInput },
          _react2.default.createElement('input', { ref: 'input', defaultValue: this.state.index, type: 'text', className: 'cmpt-form-control' })
        ));
        items.push(_react2.default.createElement(
          'span',
          { key: 's' },
          ' / ',
          max
        ));
      } else {
        forEach(pages, function (i) {
          if (i === '<..' || i === '..>') {
            items.push(_react2.default.createElement(
              'li',
              { key: i, className: 'sep' },
              _react2.default.createElement(
                'span',
                null,
                '...'
              )
            ));
          } else {
            items.push(_react2.default.createElement(
              'li',
              { onClick: this.handleChange.bind(this, i), className: (0, _classnames2.default)({ active: i === index }), key: i },
              _react2.default.createElement(
                'a',
                null,
                i
              )
            ));
          }
        }, this);
      }

      // Next
      items.push(_react2.default.createElement(
        'li',
        { key: 'next', onClick: index >= max ? null : this.handleChange.bind(this, index + 1), className: (0, _classnames2.default)('next', { disabled: index >= max }) },
        _react2.default.createElement(
          'a',
          null,
          _react2.default.createElement(
            'span',
            null,
            ' '
          )
        )
      ));

      var className = (0, _classnames2.default)(this.props.className, 'cmpt-pagination-wrap', { 'cmpt-pagination-mini': mini });
      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: className },
        _react2.default.createElement(
          'ul',
          { className: 'cmpt-pagination' },
          items
        ),
        this.props.jumper && !mini && _react2.default.createElement(
          'form',
          { onSubmit: this.setInput },
          _react2.default.createElement(
            'div',
            { className: 'cmpt-input-group' },
            _react2.default.createElement('input', { ref: 'input', defaultValue: this.state.index, type: 'text', className: 'cmpt-form-control' }),
            _react2.default.createElement(
              'span',
              { onClick: this.setInput, className: 'addon' },
              'go'
            )
          )
        )
      );
    }
  }]);

  return Pagination;
}(_react.Component);

Pagination.propTypes = {
  className: _react.PropTypes.string,
  index: _react.PropTypes.number,
  jumper: _react.PropTypes.bool,
  mini: _react.PropTypes.bool,
  onChange: _react.PropTypes.func,
  pages: _react.PropTypes.number,
  size: _react.PropTypes.number,
  style: _react.PropTypes.object,
  total: _react.PropTypes.number
};

Pagination.defaultProps = {
  index: 1,
  pages: 10,
  size: 20,
  total: 0
};

module.exports = Pagination;

},{"classnames":1,"react":"react","supperutils":"supperutils"}],48:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _supperutils = require('supperutils');

var _TableHeader = require('./TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _Fetch = require('../_mixins/Fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var substitute = _supperutils.Str.substitute;
var deepEqual = _supperutils.Obj.deepEqual;
var hashcode = _supperutils.Obj.hashcode;

var Table = function (_Component) {
  _inherits(Table, _Component);

  function Table(props) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Table).call(this, props));

    _this.state = {
      index: props.pagination ? props.pagination.props.index : 1,
      data: props.data,
      sort: {},
      total: null
    };

    _this.getSelected = _this.getSelected.bind(_this);
    _this.getData = _this.getData.bind(_this);
    _this.sortData = _this.sortData.bind(_this);

    _this.onBodyScroll = _this.onBodyScroll.bind(_this);
    return _this;
  }

  _createClass(Table, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setHeaderWidth();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!deepEqual(nextProps.data, this.props.data)) {
        this.setState({ data: nextProps.data });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.setHeaderWidth();
    }
  }, {
    key: 'checkHeadFixed',
    value: function checkHeadFixed() {
      var height = this.props.height;

      return !!height && height !== 'auto';
    }
  }, {
    key: 'setHeaderWidth',
    value: function setHeaderWidth() {
      if (!this.checkHeadFixed()) {
        return;
      }
      var tr = this.refs.body.querySelector('tr');
      if (!tr) {
        return;
      }

      var ths = this.refs.header.querySelectorAll('th');

      var tds = tr.querySelectorAll('td');
      if (tds.length <= 1) {
        return;
      }
      for (var i = 0, count = tds.length; i < count; i++) {
        if (ths[i]) {
          ths[i].style.width = tds[i].offsetWidth + 'px';
        }
      }
    }
  }, {
    key: 'sortData',
    value: function sortData(key, asc) {
      var data = this.state.data;
      data = data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (asc) {
          return x < y ? -1 : x > y ? 1 : 0;
        } else {
          return x > y ? -1 : x < y ? 1 : 0;
        }
      });
      this.setState({ data: data });
    }
  }, {
    key: 'onSelect',
    value: function onSelect(i, e) {
      var checked = typeof e === 'boolean' ? e : e.target.checked,
          data = this.state.data,
          index = this.state.index,
          size = this.props.pagination ? this.props.pagination.props.size : data.length,
          start = 0,
          end = 0;
      if (i === 'all') {
        start = (index - 1) * size;
        end = index * size;
      } else {
        start = (index - 1) * size + i;
        end = start + 1;
      }
      for (; start < end; start++) {
        data[start].$checked = checked;
      }
      this.setState({ data: data });
    }
  }, {
    key: 'getSelected',
    value: function getSelected(name) {
      var values = [];
      this.state.data.forEach(function (d) {
        if (d.$checked) {
          values.push(name ? d[name] : d);
        }
      });
      return values;
    }
  }, {
    key: 'onBodyScroll',
    value: function onBodyScroll(e) {
      var hc = this.refs.headerContainer;
      hc.style.marginLeft = 0 - e.target.scrollLeft + 'px';
    }
  }, {
    key: 'getData',
    value: function getData() {
      var _this2 = this;

      var page = this.props.pagination,
          filters = this.props.filters,
          data = [];

      if (filters) {
        (function () {
          var filterCount = filters.length;
          _this2.state.data.forEach(function (d) {
            var checked = true;
            for (var i = 0; i < filterCount; i++) {
              var f = filters[i].func;
              checked = f(d);
              if (!checked) {
                break;
              }
            }
            if (checked) {
              data.push(d);
            }
          });
        })();
      } else {
        data = this.state.data;
      }

      var total = data.length;

      if (!page) {
        return { total: total, data: data };
      }
      var size = page.props.size;
      if (data.length <= size) {
        return { total: total, data: data };
      }
      var index = this.state.index;
      data = data.slice((index - 1) * size, index * size);
      return { total: total, data: data };
    }
  }, {
    key: 'renderBody',
    value: function renderBody(data) {
      var _this3 = this;

      var _props = this.props;
      var selectAble = _props.selectAble;
      var headers = _props.headers;


      if (!Array.isArray(data)) {
        return _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'td',
              { colSpan: headers.length },
              data
            )
          )
        );
      }

      var headerKeys = headers.map(function (h) {
        return h.name || hashcode(h);
      });

      var trs = data.map(function (d, i) {
        var tds = [];
        if (selectAble) {
          tds.push(_react2.default.createElement(
            'td',
            { className: 'td-checkbox', key: 'checkbox' },
            _react2.default.createElement('input', { checked: d.$checked, onChange: _this3.onSelect.bind(_this3, i), type: 'checkbox' })
          ));
        }
        var rowKey = d.id ? d.id : hashcode(d);
        headers.map(function (h, j) {
          if (h.hidden) {
            return;
          }
          var content = h.content,
              tdStyle = {};
          if (typeof content === 'string') {
            content = substitute(content, d);
          } else if (typeof content === 'function') {
            content = content(d);
          } else {
            content = d[h.name];
          }
          if (h.width) {
            tdStyle.width = h.width;
          }
          tds.push(_react2.default.createElement(
            'td',
            { style: tdStyle, key: headerKeys[j] },
            content
          ));
        });
        return _react2.default.createElement(
          'tr',
          { key: rowKey },
          tds
        );
      });

      return _react2.default.createElement(
        'tbody',
        null,
        trs
      );
    }
  }, {
    key: 'renderHeader',
    value: function renderHeader() {
      var _this4 = this;

      var headers = [];
      if (this.props.selectAble) {
        headers.push(_react2.default.createElement(_TableHeader2.default, { key: 'checkbox', name: '$checkbox', header: _react2.default.createElement('input', { onClick: this.onSelect.bind(this, 'all'), type: 'checkbox' }) }));
      }
      this.props.headers.map(function (header, i) {
        if (header.hidden) {
          return;
        }

        var props = {
          key: header.name || i,
          onSort: function onSort(name, asc) {
            _this4.setState({ sort: { name: name, asc: asc } });
            if (_this4.props.onSort) {
              _this4.props.onSort(name, asc);
            } else {
              _this4.sortData(name, asc);
            }
          },
          sort: _this4.state.sort
        };

        headers.push(_react2.default.createElement(_TableHeader2.default, _extends({}, header, props)));
      });
      return _react2.default.createElement(
        'tr',
        null,
        headers
      );
    }
  }, {
    key: 'renderPagination',
    value: function renderPagination(total) {
      var _this5 = this;

      if (!this.props.pagination) {
        return null;
      }

      var props = {
        total: total,
        onChange: function onChange(index) {
          var data = _this5.state.data;
          data.forEach(function (d) {
            d.$checked = false;
          });
          _this5.setState({ index: index, data: data });
        }
      };
      return (0, _react.cloneElement)(this.props.pagination, props);
    }
  }, {
    key: 'render',
    value: function render() {
      var bodyStyle = {};
      var headerStyle = {};
      var tableStyle = {};
      var onBodyScroll = null;

      var _getData = this.getData();

      var total = _getData.total;
      var data = _getData.data;
      var _props2 = this.props;
      var height = _props2.height;
      var width = _props2.width;
      var bordered = _props2.bordered;
      var striped = _props2.striped;

      var fixedHead = this.checkHeadFixed();

      if (height) {
        bodyStyle.height = height;
        bodyStyle.overflow = 'auto';
      }
      if (width) {
        headerStyle.width = width;
        if (typeof headerStyle.width === 'number') {
          headerStyle.width += 20;
        }
        tableStyle.width = width;
        bodyStyle.overflow = 'auto';
        onBodyScroll = this.onBodyScroll;
      }

      var className = (0, _classnames2.default)(this.props.className, 'cmpt-table', {
        'cmpt-bordered': bordered,
        'cmpt-scrolled': height,
        'cmpt-striped': striped
      });

      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: className },
        fixedHead && _react2.default.createElement(
          'div',
          { className: 'header-container' },
          _react2.default.createElement(
            'div',
            { ref: 'headerContainer', style: headerStyle },
            _react2.default.createElement(
              'table',
              { ref: 'header' },
              _react2.default.createElement(
                'thead',
                null,
                this.renderHeader()
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { onScroll: onBodyScroll, style: bodyStyle, className: 'body-container' },
          _react2.default.createElement(
            'table',
            { style: tableStyle, className: 'cmpt-table-body', ref: 'body' },
            !fixedHead && _react2.default.createElement(
              'thead',
              null,
              this.renderHeader()
            ),
            this.renderBody(data)
          )
        ),
        this.renderPagination(total)
      );
    }
  }]);

  return Table;
}(_react.Component);

Table.propTypes = {
  bordered: _react.PropTypes.bool,
  children: _react.PropTypes.array,
  className: _react.PropTypes.string,
  data: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.element]),
  filters: _react.PropTypes.array,
  headers: _react.PropTypes.array,
  height: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  onSort: _react.PropTypes.func,
  pagination: _react.PropTypes.object,
  selectAble: _react.PropTypes.bool,
  striped: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  width: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string])
};

Table.defaultProps = {
  data: []
};

module.exports = (0, _Fetch.fetchEnhance)(Table);

},{"../_mixins/Fetch":61,"./TableHeader":49,"classnames":1,"react":"react","supperutils":"supperutils"}],49:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableHeader = function (_Component) {
  _inherits(TableHeader, _Component);

  function TableHeader(props) {
    _classCallCheck(this, TableHeader);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TableHeader).call(this, props));

    _this.state = {
      asc: 0
    };
    _this.onSort = _this.onSort.bind(_this);
    return _this;
  }

  _createClass(TableHeader, [{
    key: 'onSort',
    value: function onSort() {
      var asc = this.state.asc === 0 ? 1 : 0;
      this.setState({ asc: asc });
      this.props.onSort(this.props.name, asc);
    }
  }, {
    key: 'render',
    value: function render() {
      var sort = [],
          onSort = null,
          style = {};

      if (this.props.sortAble) {
        sort.push(_react2.default.createElement('i', { key: 'up', className: (0, _classnames2.default)('arrow-up', { active: this.props.name === this.props.sort.name && this.state.asc === 1 }) }));
        sort.push(_react2.default.createElement('i', { key: 'down', className: (0, _classnames2.default)('arrow-down', { active: this.props.name === this.props.sort.name && this.state.asc === 0 }) }));

        onSort = this.onSort;
        style = { cursor: 'pointer' };
      }

      return _react2.default.createElement(
        'th',
        { style: style, onClick: onSort },
        this.props.header,
        sort
      );
    }
  }]);

  return TableHeader;
}(_react.Component);

TableHeader.propTypes = {
  content: _react.PropTypes.any,
  header: _react.PropTypes.any,
  hidden: _react.PropTypes.bool,
  name: _react.PropTypes.string,
  onSort: _react.PropTypes.func,
  sort: _react.PropTypes.object,
  sortAble: _react.PropTypes.bool,
  width: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string])
};

TableHeader.defaultProps = {
  hidden: false
};

module.exports = TableHeader;

},{"classnames":1,"react":"react"}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Table = exports.TableHeader = exports.Pagination = undefined;

var _Pagination = require('./Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _TableHeader = require('./TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _Table = require('./Table');

var _Table2 = _interopRequireDefault(_Table);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Pagination = _Pagination2.default;
exports.TableHeader = _TableHeader2.default;
exports.Table = _Table2.default;
exports.default = {
  Pagination: _Pagination2.default,
  TableHeader: _TableHeader2.default,
  Table: _Table2.default
};

},{"./Pagination":47,"./Table":48,"./TableHeader":49}],51:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _supperutils = require('supperutils');

var _util = require('../Grid/util');

var _enhance = require('../Form/enhance');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var computedStyle = _supperutils.Dom.computedStyle;
var getLineHeight = _supperutils.Dom.getLineHeight;

var Textarea = function (_Component) {
  _inherits(Textarea, _Component);

  function Textarea(props) {
    _classCallCheck(this, Textarea);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Textarea).call(this, props));

    _this.state = {
      value: props.value,
      rows: props.rows
    };

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleTrigger = _this.handleTrigger.bind(_this);
    return _this;
  }

  _createClass(Textarea, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var el = this.element;

      if (this.props.autoHeight) {
        this.lineHeight = getLineHeight(el);
        this.paddingHeight = parseInt(computedStyle(el, 'paddingTop')) + parseInt(computedStyle(el, 'paddingBottom'));
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var value = nextProps.value;
      if (value !== this.props.value && value !== this.state.value) {
        this.setState({ value: value });
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.props.autoHeight && this.autoHeight();

      var value = event.target.value;
      this.setState({ value: value });

      if (this.props.trigger === 'change') {
        this.handleTrigger(event);
      }
    }
  }, {
    key: 'handleTrigger',
    value: function handleTrigger(event) {
      var value = event.target.value;
      this.props.onChange(value, event);
    }
  }, {
    key: 'autoHeight',
    value: function autoHeight() {
      var el = this.element;
      var scrH = void 0;
      var rows = void 0;

      el.style.height = '1px';
      scrH = el.scrollHeight - this.paddingHeight;
      rows = Math.floor(scrH / this.lineHeight);

      if (rows >= this.props.rows) {
        this.setState({
          rows: rows
        });
      }
      el.style.height = 'auto';
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var className = _props.className;
      var grid = _props.grid;
      var style = _props.style;
      var autoHeight = _props.autoHeight;
      var trigger = _props.trigger;

      var other = _objectWithoutProperties(_props, ['className', 'grid', 'style', 'autoHeight', 'trigger']);

      var _state = this.state;
      var rows = _state.rows;
      var value = _state.value;


      style.minHeight = 'auto';
      if (autoHeight) {
        style.resize = 'none';
      }

      var props = {
        className: (0, _classnames2.default)(className, (0, _util.getGrid)(grid), 'cmpt-form-control'),
        onChange: this.handleChange,
        style: style,
        rows: rows,
        value: value
      };

      if (trigger !== 'change') {
        var handle = 'on' + trigger.charAt(0).toUpperCase() + trigger.slice(1);
        props[handle] = this.handleTrigger;
      }

      return _react2.default.createElement('textarea', _extends({ ref: function ref(c) {
          return _this2.element = c;
        } }, other, props));
    }
  }]);

  return Textarea;
}(_react.Component);

Textarea.propTypes = {
  autoHeight: _react.PropTypes.bool,
  className: _react.PropTypes.string,
  grid: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object]),
  onChange: _react.PropTypes.func,
  placeholder: _react.PropTypes.string,
  rows: _react.PropTypes.number,
  style: _react.PropTypes.object,
  trigger: _react.PropTypes.string,
  value: _react.PropTypes.any
};

Textarea.defaultProps = {
  style: {},
  grid: 1,
  rows: 10,
  trigger: 'blur',
  value: ''
};

module.exports = (0, _enhance.register)(Textarea, ['textarea']);

},{"../Form/enhance":28,"../Grid/util":33,"classnames":1,"react":"react","supperutils":"supperutils"}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Textarea = undefined;

var _Textarea = require('./Textarea');

var _Textarea2 = _interopRequireDefault(_Textarea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Textarea = _Textarea2.default;
exports.default = {
  Textarea: _Textarea2.default
};

},{"./Textarea":51}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Upload = undefined;

var _upload = require('./upload');

var _upload2 = _interopRequireDefault(_upload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Upload = _upload2.default; /**
                                    * 文件上传
                                    * 
                                    * Created by Ray on 2016-03-30
                                    */

exports.default = {
  Upload: _upload2.default
};

},{"./upload":54}],54:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _supperutils = require('supperutils');

var _util = require('../Grid/util');

var _locals = require('../../locals');

var _enhance = require('../Form/enhance');

var _util2 = require('./util');

var _util3 = _interopRequireDefault(_util2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var nextUid = _supperutils.Str.nextUid;
var format = _supperutils.Str.format;

var Upload = function (_Component) {
  _inherits(Upload, _Component);

  function Upload(props) {
    _classCallCheck(this, Upload);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Upload).call(this, props));

    _this.state = {
      files: {}
    };
    _this.addFile = _this.addFile.bind(_this);
    _this.files = {};
    return _this;
  }

  _createClass(Upload, [{
    key: 'isCompleted',
    value: function isCompleted() {
      var completed = true,
          files = this.state.files;
      Object.keys(files).forEach(function (id) {
        if (files[id].status !== 2) {
          completed = false;
        }
      });
      return completed;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      var values = [],
          files = this.state.files;
      var sep = this.props.sep;

      Object.keys(files).forEach(function (id) {
        //if (autoUpload) {
        values.push(files[id].value);
        //} else {
        //  values.push(files[id].file.files[0]);
        //}
      });
      if (sep) {
        values = values.join(sep);
      }
      return values;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(value) {
      var onChange = this.props.onChange;

      if (value === undefined) {
        if (this.isCompleted()) {
          value = this.getValue();
        } else {
          value = new Error('');
        }
      }
      if (onChange) {
        onChange(value);
      }
    }
  }, {
    key: 'addFile',
    value: function addFile() {
      var _this2 = this;

      var _props = this.props;
      var accept = _props.accept;
      var autoUpload = _props.autoUpload;
      var disabled = _props.disabled;
      var readOnly = _props.readOnly;
      var fileSize = _props.fileSize;

      if (disabled || readOnly) {
        return;
      }

      var files = this.state.files,
          file = document.createElement('input');
      file.type = 'file';
      file.accept = accept;
      file.click();
      _supperutils.Dom.onEvent(file, 'change', function () {
        var blob = file.files[0];
        if (blob.size / 1024 > fileSize) {
          _this2.handleChange(new Error(format((0, _locals.getLang)('validation.tips.fileSize'), fileSize)));
          return;
        }

        var id = nextUid();
        files[id] = {
          file: file,
          name: file.files[0].name,
          status: autoUpload ? 1 : 0
        };

        if (autoUpload) {
          files[id].xhr = _this2.uploadFile(file, id);
        }
        _this2.setState({ files: files });
      });
    }
  }, {
    key: 'removeFile',
    value: function removeFile(id) {
      if (this.props.disabled || this.props.readOnly) {
        return;
      }

      var files = this.state.files;
      var file = files[id];
      if (file.xhr) {
        file.xhr.abort();
      }
      delete files[id];
      this.setState({ files: files });
      this.handleChange();
    }
  }, {
    key: 'uploadFile',
    value: function uploadFile(file, id) {
      var _this3 = this;

      var onUpload = this.props.onUpload;

      return (0, _util3.default)({
        url: this.props.action,
        name: this.props.name,
        cors: this.props.cors,
        params: this.props.params,
        withCredentials: this.props.withCredentials,
        file: file.files[0],
        onProgress: function onProgress(e) {
          var progress = _this3.files[id];
          progress.style.width = e.loaded / e.total * 100 + '%';
          _this3.handleChange(new Error(''));
        },
        onLoad: function onLoad(e) {
          var files = _this3.state.files;
          var value = e.currentTarget.responseText;
          if (onUpload) {
            value = onUpload(value);
          }

          if (value instanceof Error) {
            files[id].status = 3;
            files[id].name = value.message;
          } else {
            files[id].status = 2;
            files[id].value = value;
          }

          _this3.setState({ files: files });
          _this3.handleChange();
        },
        onError: function onError() {
          var files = _this3.state.files;
          files[id].status = 3;
          _this3.setState({ files: files });
          _this3.handleChange();
        }
      });
    }
  }, {
    key: 'start',
    value: function start() {
      var _this4 = this;

      var files = this.state.files;
      Object.keys(files).forEach(function (id) {
        _this4.uploadFile(files[id].file, id);
      });
    }
  }, {
    key: 'renderFiles',
    value: function renderFiles() {
      var _this5 = this;

      var files = this.state.files;
      return Object.keys(files).map(function (id, i) {
        var file = _this5.state.files[id];
        var className = (0, _classnames2.default)({
          'uploaded': file.status === 2,
          'has-error': file.status === 3
        });
        return _react2.default.createElement(
          'div',
          { key: i, className: className },
          _react2.default.createElement(
            'div',
            { className: 'cmpt-file' },
            _react2.default.createElement(
              'span',
              null,
              file.name
            ),
            _react2.default.createElement(
              'a',
              { className: 'remove', onClick: _this5.removeFile.bind(_this5, id) },
              '× ',
              (0, _locals.getLang)('buttons.cancel')
            )
          ),
          _react2.default.createElement('div', { ref: function ref(c) {
              return _this5.files[id] = c;
            }, className: 'cmpt-upload-progress' })
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var className = _props2.className;
      var grid = _props2.grid;
      var limit = _props2.limit;
      var style = _props2.style;
      var content = _props2.content;

      className = (0, _classnames2.default)((0, _util.getGrid)(grid), 'cmpt-upload-container', className);
      return _react2.default.createElement(
        'div',
        { className: className, style: style },
        Object.keys(this.state.files).length < limit && _react2.default.createElement(
          'div',
          { onClick: this.addFile },
          content
        ),
        this.renderFiles()
      );
    }
  }]);

  return Upload;
}(_react.Component);

Upload.propTypes = {
  accept: _react.PropTypes.string,
  action: _react.PropTypes.string.isRequired,
  autoUpload: _react.PropTypes.bool,
  className: _react.PropTypes.string,
  content: _react.PropTypes.object,
  cors: _react.PropTypes.bool,
  disabled: _react.PropTypes.bool,
  fileSize: _react.PropTypes.number,
  grid: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object]),
  limit: _react.PropTypes.number,
  name: _react.PropTypes.string.isRequired,
  onChange: _react.PropTypes.func,
  onUpload: _react.PropTypes.func,
  params: _react.PropTypes.object,
  readOnly: _react.PropTypes.bool,
  sep: _react.PropTypes.string,
  style: _react.PropTypes.object,
  withCredentials: _react.PropTypes.bool
};

Upload.defaultProps = {
  autoUpload: true,
  cors: true,
  fileSize: 4096,
  limit: 1,
  withCredentials: false
};

module.exports = (0, _enhance.register)(Upload, 'upload', { valueType: 'array' });

},{"../../locals":68,"../Form/enhance":28,"../Grid/util":33,"./util":55,"classnames":1,"react":"react","supperutils":"supperutils"}],55:[function(require,module,exports){
'use strict';

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest !== 'undefined') {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

function ajaxUpload(_ref, callback) {
  var url = _ref.url;
  var name = _ref.name;
  var cors = _ref.cors;
  var params = _ref.params;
  var uploadParams = _ref.uploadParams;
  var file = _ref.file;
  var onProgress = _ref.onProgress;
  var onLoad = _ref.onLoad;
  var onError = _ref.onError;
  var withCredentials = _ref.withCredentials;

  var data = new FormData();
  data.append(name, file);

  if (params) {
    for (var k in params) {
      data.append(k, params[k]);
    }
  }

  var xhr = createCORSRequest('post', url, cors);
  xhr.withCredentials = withCredentials;
  xhr.upload.addEventListener('progress', onProgress, false);
  xhr.onload = onLoad;
  xhr.onerror = onError;
  xhr.send(data);

  if (callback) {
    callback(null, xhr);
  }
}

module.exports = function (args, callback) {
  return ajaxUpload(args, callback);
};

},{}],56:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Avatar = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 头像组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Ray on 2016-03-30
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Avatar = exports.Avatar = function (_React$Component) {
  _inherits(Avatar, _React$Component);

  function Avatar(props) {
    _classCallCheck(this, Avatar);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Avatar).call(this, props));
  }

  _createClass(Avatar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var icon = _props.icon;
      var src = _props.src;
      var className = _props.className;


      var cls = (0, _classnames2.default)(_defineProperty({
        "cmpt-avatar": true
      }, className, className));

      if (src) {
        return _react2.default.createElement('img', { src: src, className: cls });
      } else {
        return _react2.default.createElement(
          'div',
          { className: cls },
          this.props.children
        );
      }
    }
  }]);

  return Avatar;
}(_react2.default.Component);

;

exports.default = Avatar;

},{"classnames":1,"react":"react"}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Divider = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 分隔线组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Ray on 2016-03-30
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Divider = exports.Divider = function (_React$Component) {
  _inherits(Divider, _React$Component);

  function Divider(props) {
    _classCallCheck(this, Divider);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Divider).call(this, props));
  }

  _createClass(Divider, [{
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var className = _props.className;
      var children = _props.children;


      var cls = (0, _classnames2.default)(_defineProperty({
        "cmpt-divider": true
      }, className, className));

      return _react2.default.createElement('hr', { className: cls });
    }
  }]);

  return Divider;
}(_react2.default.Component);

;

exports.default = Divider;

},{"classnames":1,"react":"react"}],58:[function(require,module,exports){
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

},{"../_mixins/ClickAway":60,"classnames":1,"react":"react"}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tip = exports.Avatar = exports.Divider = undefined;

var _Divider = require('./Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Avatar = require('./Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

var _Tip = require('./Tip');

var _Tip2 = _interopRequireDefault(_Tip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Divider = _Divider2.default; /**
                                      * 小组件
                                      * 
                                      * Created by Ray on 2016-03-30
                                      */

exports.Avatar = _Avatar2.default;
exports.Tip = _Tip2.default;
exports.default = {
  Divider: _Divider2.default,
  Avatar: _Avatar2.default,
  Tip: _Tip2.default
};

},{"./Avatar":56,"./Divider":57,"./Tip":58}],60:[function(require,module,exports){
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

},{"react-dom":"react-dom","supperutils":"supperutils"}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchEnhance = exports.FETCH_FAILURE = exports.FETCH_SUCCESS = exports.FETCH_PENDING = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.setPeer = setPeer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _supperutils = require('supperutils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var deepEqual = _supperutils.Obj.deepEqual;
var clone = _supperutils.Obj.clone;
var FETCH_PENDING = exports.FETCH_PENDING = 'pending';
var FETCH_SUCCESS = exports.FETCH_SUCCESS = 'success';
var FETCH_FAILURE = exports.FETCH_FAILURE = 'failure';

// handle response data
function peerData(res) {
  return res;
}

function setPeer(fn) {
  peerData = fn;
}

var fetchEnhance = exports.fetchEnhance = function fetchEnhance(ComposedComponent) {
  var Fetch = function (_Component) {
    _inherits(Fetch, _Component);

    function Fetch(props) {
      _classCallCheck(this, Fetch);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Fetch).call(this, props));

      _this.state = {
        data: undefined,
        fetchStatus: FETCH_SUCCESS
      };
      return _this;
    }

    _createClass(Fetch, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        this._isMounted = true;
        var _props = this.props;
        var data = _props.data;
        var fetch = _props.fetch;

        if (data) {
          this.handleData(data);
        }
        if (fetch) {
          this.fetchData(fetch);
        }
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        var component = this.component;
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
        if (!deepEqual(this.props.data, nextProps.data)) {
          this.handleData(nextProps.data);
        }
        if (!deepEqual(this.props.fetch, nextProps.fetch)) {
          this.fetchData(nextProps.fetch);
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._isMounted = false;
      }
    }, {
      key: 'handleData',
      value: function handleData(data) {
        var _this3 = this;

        // old dataSource api
        if (typeof data === 'function') {
          this.setState({ data: undefined, fetchStatus: FETCH_PENDING });
          data.then(function (res) {
            if (_this3._isMounted) {
              _this3.setState({ data: clone(res) });
            }
          })();
        } else {
          this.setState({ data: clone(data), fetchStatus: FETCH_SUCCESS });
        }
      }
    }, {
      key: 'fetchData',
      value: function fetchData(fetch) {
        var _this4 = this;

        if (!fetch) {
          return;
        }

        this.setState({ fetchStatus: FETCH_PENDING });

        if (typeof fetch === 'function') {
          fetch.then(function (data) {
            _this4.setData(data);
          });
          return;
        }

        if (typeof fetch === 'string') {
          fetch = { url: fetch };
        }
        var _fetch = fetch;
        var _fetch$method = _fetch.method;
        var method = _fetch$method === undefined ? 'get' : _fetch$method;
        var url = _fetch.url;
        var data = _fetch.data;
        var then = _fetch.then;

        var options = _objectWithoutProperties(_fetch, ['method', 'url', 'data', 'then']);

        var request = _supperutils.Refetch[method](url, data, options).then(peerData.bind(request));

        // handle response
        if (then) {
          request = request.then(then);
        }
        request.then(function (data) {
          _this4.setData(data);
        }).catch(function (err) {
          console.warn(err);
          _this4.setData(new Error());
        });
      }
    }, {
      key: 'setData',
      value: function setData(data) {
        if (!this._isMounted) {
          return;
        }

        if (data instanceof Error) {
          this.setState({ fetchStatus: FETCH_FAILURE });
        } else {
          this.setState({ data: clone(data), fetchStatus: FETCH_SUCCESS });
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this5 = this;

        var _props2 = this.props;
        var data = _props2.data;

        var others = _objectWithoutProperties(_props2, ['data']);

        return _react2.default.createElement(ComposedComponent, _extends({ ref: function ref(c) {
            return _this5.component = c;
          }, data: this.state.data, fetchStatus: this.state.fetchStatus }, others));
      }
    }]);

    return Fetch;
  }(_react.Component);

  Fetch.propTypes = {
    data: _react.PropTypes.any,
    fetch: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func, _react.PropTypes.object])
  };

  return Fetch;
};

},{"react":"react","supperutils":"supperutils"}],62:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"../Grid/util":33,"classnames":1,"dup":4,"react":"react"}],63:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./Button":62,"dup":5,"react":"react"}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tip = exports.Divider = exports.Avatar = exports.Pagination = exports.TableHeader = exports.Table = exports.FormSubmit = exports.FormControl = exports.FormItem = exports.Form = exports.RadioGroup = exports.Radio = exports.CheckboxGroup = exports.Checkbox = exports.DatepickerPair = exports.Datetime = exports.Datepicker = exports.Rating = exports.Upload = exports.Textarea = exports.Input = exports.Select = exports.Button = exports.Message = exports.Modal = exports.Overlay = exports.CardPanel = exports.CardText = exports.CardMedia = exports.CardTitle = exports.CardHeader = exports.Card = exports.GridUtil = exports.Grid = exports.Icon = undefined;

var _Icon = require('./Icon');

var _Grid = require('./Grid');

var _Card = require('./Card');

var _Overlay = require('./Overlay');

var _Modal = require('./Modal');

var _Message = require('./Message');

var _Button = require('./Button');

var _Select = require('./Select');

var _Input = require('./Input');

var _Textarea = require('./Textarea');

var _Upload = require('./Upload');

var _Rating = require('./Rating');

var _Datepicker = require('./Datepicker');

var _Datepicker2 = _interopRequireDefault(_Datepicker);

var _Pair = require('./Datepicker/Pair');

var _Pair2 = _interopRequireDefault(_Pair);

var _Checkbox = require('./Checkbox');

var _Form = require('./Form');

var _Table = require('./Table');

var _Widgets = require('./Widgets');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 控件整合
 * 
 * Created by Ray on 2016-03-30
 */

exports.Icon = _Icon.Icon;
exports.Grid = _Grid.Grid;
exports.GridUtil = _Grid.GridUtil;
exports.Card = _Card.Card;
exports.CardHeader = _Card.CardHeader;
exports.CardTitle = _Card.CardTitle;
exports.CardMedia = _Card.CardMedia;
exports.CardText = _Card.CardText;
exports.CardPanel = _Card.CardPanel;
exports.Overlay = _Overlay.Overlay;
exports.Modal = _Modal.Modal;
exports.Message = _Message.Message;
exports.Button = _Button.Button;
exports.Select = _Select.Select;
exports.Input = _Input.Input;
exports.Textarea = _Textarea.Textarea;
exports.Upload = _Upload.Upload;
exports.Rating = _Rating.Rating;
exports.Datepicker = _Datepicker2.default;
var Datetime = exports.Datetime = _Datepicker2.default;
exports.DatepickerPair = _Pair2.default;
exports.Checkbox = _Checkbox.Checkbox;
exports.CheckboxGroup = _Checkbox.CheckboxGroup;
exports.Radio = _Checkbox.Radio;
exports.RadioGroup = _Checkbox.RadioGroup;
exports.Form = _Form.Form;
exports.FormItem = _Form.FormItem;
exports.FormControl = _Form.FormControl;
exports.FormSubmit = _Form.FormSubmit;
exports.Table = _Table.Table;
exports.TableHeader = _Table.TableHeader;
exports.Pagination = _Table.Pagination;
exports.Avatar = _Widgets.Avatar;
exports.Divider = _Widgets.Divider;
exports.Tip = _Widgets.Tip;
exports.default = {
  Icon: _Icon.Icon,

  Grid: _Grid.Grid,
  GridUtil: _Grid.GridUtil,

  Card: _Card.Card,
  CardHeader: _Card.CardHeader,
  CardTitle: _Card.CardTitle,
  CardMedia: _Card.CardMedia,
  CardText: _Card.CardText,
  CardPanel: _Card.CardPanel,

  Overlay: _Overlay.Overlay,
  Modal: _Modal.Modal,
  Message: _Message.Message,

  Button: _Button.Button,

  Select: _Select.Select,
  Input: _Input.Input,
  Textarea: _Textarea.Textarea,
  Upload: _Upload.Upload,
  Rating: _Rating.Rating,

  Datepicker: _Datepicker2.default,
  Datetime: _Datepicker2.default,
  DatepickerPair: _Pair2.default,

  Checkbox: _Checkbox.Checkbox,
  CheckboxGroup: _Checkbox.CheckboxGroup,
  Radio: _Checkbox.Radio,
  RadioGroup: _Checkbox.RadioGroup,

  Form: _Form.Form,
  FormItem: _Form.FormItem,
  FormControl: _Form.FormControl,
  FormSubmit: _Form.FormSubmit,

  Table: _Table.Table,
  TableHeader: _Table.TableHeader,
  Pagination: _Table.Pagination,

  Avatar: _Widgets.Avatar,
  Divider: _Widgets.Divider,
  Tip: _Widgets.Tip
};

},{"./Button":5,"./Card":12,"./Checkbox":15,"./Datepicker":22,"./Datepicker/Pair":20,"./Form":29,"./Grid":32,"./Icon":34,"./Input":36,"./Message":38,"./Modal":40,"./Overlay":42,"./Rating":44,"./Select":46,"./Table":50,"./Textarea":52,"./Upload":53,"./Widgets":59}],65:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"classnames":1,"dup":41,"react":"react"}],66:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Overlay":65,"dup":42}],67:[function(require,module,exports){
(function (global){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _supperutils = require('supperutils');

var _supperutils2 = _interopRequireDefault(_supperutils);

var _components = require('./components');

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;(function () {
  var g;
  if (typeof window !== "undefined") {
    g = window;
  } else if (typeof global !== "undefined") {
    g = global;
  } else if (typeof self !== "undefined") {
    g = self;
  } else {
    // works providing we're not in "use strict";
    // needed for Java 8 Nashorn
    // see https://github.com/facebook/react/issues/3037
    g = this;
  }

  g.React = _react2.default;
  g.ReactDOM = _reactDom2.default;
  g.SupperUtils = _supperutils2.default;
  g.SupperUI = _components2.default;
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components":64,"react":"react","react-dom":"react-dom","supperutils":"supperutils"}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOCATION = undefined;
exports.getLang = getLang;
exports.setLocation = setLocation;

var _supperutils = require('supperutils');

var merge = _supperutils.Obj.merge;


var langDataMap = {
  'zh-cn': require('./zh-cn')
};

var langData = null;

var LOCATION = exports.LOCATION = 'zh-cn';

function getLang(path, def) {
  if (!langData) {
    setLocation(LOCATION);
  }

  var result = langData || {};

  if (path === undefined) {
    return result;
  }

  if (!path || typeof path !== 'string') {
    return undefined;
  }

  var paths = path.split('.');

  for (var i = 0, count = paths.length; i < count; i++) {
    result = result[paths[i]];
    if (result === undefined) {
      if (def !== undefined) {
        return def;
      } else {
        return undefined;
      }
    }
  }

  return result;
}

function setLocation(location) {
  exports.LOCATION = LOCATION = location;

  if (langDataMap[location] && langDataMap[location]["default"]) {
    langData = langDataMap[location]["default"];
  }
}

},{"./zh-cn":72,"supperutils":"supperutils"}],69:[function(require,module,exports){
'use strict';

module.exports = {
  buttons: {
    add: '新建',
    back: '返回',
    cancel: '取消',
    clear: '清空',
    fields: '字段',
    filter: '筛选',
    ok: '确定',
    refresh: '刷新',
    reset: '重置',
    save: '保存'
  }
};

},{}],70:[function(require,module,exports){
'use strict';

module.exports = {
  datetime: {
    year: '年',
    month: '月',
    fullMonth: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    shortMonth: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    weekday: ['日', '一', '二', '三', '四', '五', '六'],
    format: {
      year: 'yyyy年',
      month: 'MM月',
      date: 'yyyy-MM-dd',
      datetime: 'yyyy-MM-dd hh:mm:ss',
      time: 'hh:mm:ss'
    }
  }
};

},{}],71:[function(require,module,exports){
'use strict';

module.exports = {
  fetch: {
    status: {
      pending: '数据加载中...',
      failure: '数据加载失败.',
      success: ''
    }
  }
};

},{}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _buttons = require('./buttons');

var _datetime = require('./datetime');

var _fetch = require('./fetch');

var _validation = require('./validation');

exports.default = {
  buttons: _buttons.buttons,
  datetime: _datetime.datetime,
  fetch: _fetch.fetch,
  validation: _validation.validation
};

},{"./buttons":69,"./datetime":70,"./fetch":71,"./validation":73}],73:[function(require,module,exports){
'use strict';

module.exports = {
  validation: {
    hints: {
      alpha: '英文字符，"-"，"_"',
      alphanum: '数字、英文字符和"_"',
      integer: '整数',
      required: '必填',
      max: {
        array: '最多选择 {0} 个选项',
        number: '最大值 {0}',
        string: '最大长度 {0} 个字符'
      },
      min: {
        array: '最少选择 {0} 个选项',
        number: '最小值 {0}',
        string: '最小长度 {0} 个字符'
      },
      number: '数字',
      password: '大写英文字符,小写英文字符,数字,特殊字符'
    },
    tips: {
      alpha: '只能包含英文字符，"-"，"_"',
      alphanum: '只能包含数字、英文字符和"_"',
      email: '格式不正确',
      mobile: '格式不正确(目前只支持中国大陆手机号)',
      integer: '必须为整数',
      required: '不能为空',
      max: {
        array: '最多选择 {0} 个选项',
        number: '不能大于 {0}',
        string: '最大长度不能超过 {0} 个字符',
        datetime: '时间不能晚于 {0}'
      },
      min: {
        array: '最少选择 {0} 个选项',
        number: '不能小于 {0}',
        string: '最小长度不能少于 {0} 个字符',
        datetime: '时间不能早于 {0}'
      },
      number: '必须为数字',
      password: '含有非法字符',
      url: '格式不正确',
      hex: '格式不正确，应为6位16进制字符串。例：#ffffff)',
      rgb: '格式不正确，应为逗号分隔、三个0-255组成的数组。例：rgb(255,255,255)',
      rgba: '格式不正确，应为三个0-255和0-1组成的数组。例：rgba(255,255,255,1)',
      hsv: '格式不正确，应为色相(0-360)、彩度(0-100)、明度(0-100)组成的数组。例：hsv(360,100%,100%)',
      fileSize: '最大上传文件大小不能超过 {0} KB'
    }
  }
};

},{}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFullMonth = getFullMonth;
exports.getShortMonth = getShortMonth;
exports.getDayOfWeek = getDayOfWeek;
exports.getDatetime = getDatetime;
exports.getDate = getDate;
exports.getFullYear = getFullYear;
exports.getTime = getTime;
exports.convert = convert;

var _supperutils = require('supperutils');

var _locals = require('../locals');

function getFullMonth(d) {
  var month = d.getMonth();
  return (0, _locals.getLang)('datetime.fullMonth')[month];
}

function getShortMonth(d) {
  var month = d.getMonth();
  return (0, _locals.getLang)('datetime.shortMonth')[month];
}

function getDayOfWeek(d) {
  var weekday = d.getDay();
  return (0, _locals.getLang)('datetime.weekday')[weekday];
}

function getDatetime(d) {
  return _supperutils.Dt.format(d, (0, _locals.getLang)('datetime.format.datetime'));
}

function getDate(d) {
  return _supperutils.Dt.format(d, (0, _locals.getLang)('datetime.format.date'));
}

function getFullYear(d) {
  return _supperutils.Dt.format(d, (0, _locals.getLang)('datetime.format.year'));
}

function getTime(d) {
  return _supperutils.Dt.format(d, (0, _locals.getLang)('datetime.format.time'));
}

// string, unixtimestamp convert to Date
function convert(obj, def) {
  if (def === undefined) {
    def = new Date();
  }

  if (!obj) {
    return def;
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (/^[-+]?[0-9]+$/.test(obj)) {
    obj = parseInt(obj);
  } else {
    obj = obj.replace(/-/g, '/');
  }

  if (/^\d?\d:\d?\d/.test(obj)) {
    obj = getDate(new Date()) + ' ' + obj;
  }

  obj = new Date(obj);
  // Invalid Date
  if (isNaN(obj.getTime())) {
    obj = def;
  }

  return obj;
}

},{"../locals":68,"supperutils":"supperutils"}]},{},[67]);
