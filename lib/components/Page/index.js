'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PagePanel = exports.PageTitle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTitleComponent = require('react-title-component');

var _reactTitleComponent2 = _interopRequireDefault(_reactTitleComponent);

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

var PageTitle = _reactTitleComponent2.default;

exports.PageTitle = PageTitle;

var PagePanel = exports.PagePanel = function (_React$Component) {
  _inherits(PagePanel, _React$Component);

  function PagePanel(props) {
    _classCallCheck(this, PagePanel);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PagePanel).call(this, props));
  }

  _createClass(PagePanel, [{
    key: 'render',
    value: function render() {
      var title = this.props.title;


      return _react2.default.createElement(
        'div',
        { className: 'page-panel' },
        _react2.default.createElement(PageTitle, { render: "joints app" }),
        _react2.default.createElement(
          'div',
          this.props,
          this.props.children
        )
      );
    }
  }]);

  return PagePanel;
}(_react2.default.Component);

;

exports.default = {
  PageTitle: PageTitle,
  PagePanel: PagePanel
};