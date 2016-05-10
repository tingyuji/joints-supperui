'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Grid = function Grid(props) {
  var className = props.className;
  var width = props.width;
  var offset = props.offset;
  var responsive = props.responsive;
  var style = props.style;
  var children = props.children;

  className = (0, _classnames2.default)(className, (0, _util.getGrid)({ width: width, offset: offset, responsive: responsive }));
  return _react2.default.createElement(
    'div',
    { style: style, className: className },
    children
  );
};

Grid.propTypes = {
  children: _react.PropTypes.any,
  className: _react.PropTypes.string,
  offset: _react.PropTypes.number,
  responsive: _react.PropTypes.string,
  style: _react.PropTypes.object,
  width: _react.PropTypes.number
};

module.exports = Grid;