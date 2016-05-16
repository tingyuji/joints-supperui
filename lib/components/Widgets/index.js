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