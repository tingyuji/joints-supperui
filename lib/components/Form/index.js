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