'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _button = require('../button');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormSubmit = function FormSubmit(props) {
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
};

FormSubmit.propTypes = {
  children: _react.PropTypes.any,
  disabled: _react.PropTypes.bool,
  onClick: _react.PropTypes.func,
  style: _react.PropTypes.object
};

module.exports = FormSubmit;