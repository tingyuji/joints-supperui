'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatepickerPair = exports.Datepicker = undefined;

var _Datepicker = require('./Datepicker');

var _Datepicker2 = _interopRequireDefault(_Datepicker);

var _Pair = require('./Pair');

var _Pair2 = _interopRequireDefault(_Pair);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Datepicker = _Datepicker2.default;
exports.DatepickerPair = _Pair2.default;
exports.default = {
  Datepicker: _Datepicker2.default,
  DatepickerPair: _Pair2.default
};