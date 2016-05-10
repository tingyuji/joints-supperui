'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageGallery = exports.Avatar = exports.Divider = undefined;

var _divider = require('./divider');

var _divider2 = _interopRequireDefault(_divider);

var _avatar = require('./avatar');

var _avatar2 = _interopRequireDefault(_avatar);

var _imageGallery = require('./imageGallery');

var _imageGallery2 = _interopRequireDefault(_imageGallery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Divider = _divider2.default; /**
                                      * 小组件
                                      * 
                                      * Created by Ray on 2016-03-30
                                      */

exports.Avatar = _avatar2.default;
exports.ImageGallery = _imageGallery2.default;
exports.default = {
  Divider: _divider2.default,
  Avatar: _avatar2.default,
  ImageGallery: _imageGallery2.default
};