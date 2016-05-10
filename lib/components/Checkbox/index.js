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