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