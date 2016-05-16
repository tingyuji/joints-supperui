'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Table = exports.TableHeader = exports.Pagination = undefined;

var _Pagination = require('./Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _TableHeader = require('./TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _Table = require('./Table');

var _Table2 = _interopRequireDefault(_Table);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Pagination = _Pagination2.default;
exports.TableHeader = _TableHeader2.default;
exports.Table = _Table2.default;
exports.default = {
  Pagination: _Pagination2.default,
  TableHeader: _TableHeader2.default,
  Table: _Table2.default
};