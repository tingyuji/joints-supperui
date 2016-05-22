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

var _obj = require('../../utils/obj');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        if (!(0, _obj.deepEqual)(this.props.data, nextProps.data)) {
          this.handleData(nextProps.data);
        }
        if (!(0, _obj.deepEqual)(this.props.fetch, nextProps.fetch)) {
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
              _this3.setState({ data: (0, _obj.clone)(res) });
            }
          })();
        } else {
          this.setState({ data: (0, _obj.clone)(data), fetchStatus: FETCH_SUCCESS });
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

        if (typeof fetch.then === 'function' || typeof fetch === 'function') {
          fetch.then(function (data) {
            _this4.setData(data);
          });
          return;
        }

        // TODO: fetch配置管理
        // if (typeof fetch === 'string') {
        //   fetch = { url: fetch };
        // }
        // let { method='get', url, data, then, ...options } = fetch;
        // let request = refetch[method](url, data, options).then(peerData.bind(request));

        // // handle response
        // if (then) { request = request.then(then); }
        // request.then((data) => {
        //   this.setData(data);
        // })
        // .catch((err) => {
        //   console.warn(err);
        //   this.setData(new Error());
        // });
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
          this.setState({ data: (0, _obj.clone)(data), fetchStatus: FETCH_SUCCESS });
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