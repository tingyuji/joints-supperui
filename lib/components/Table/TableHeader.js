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