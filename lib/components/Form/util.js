'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _regex = require('../../utils/regex');

var _regex2 = _interopRequireDefault(_regex);

var _str = require('../../utils/str');

var _locals = require('../../locals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleError(label, value, key, tip) {
  // handle error
  var text = (0, _locals.getLang)('validation.tips.' + key, null);
  if (text) {
    text = (label || '') + (0, _str.format)(text, value);
  } else {
    text = tip;
  }
  return new Error(text);
}

function validate(value, valueType, _ref) {
  var label = _ref.label;
  var required = _ref.required;
  var min = _ref.min;
  var max = _ref.max;
  var readOnly = _ref.readOnly;
  var sep = _ref.sep;
  var tip = _ref.tip;
  var type = _ref.type;
  var validator = _ref.validator;
  var formData = _ref.formData;

  var len = 0;

  if (readOnly) {
    return true;
  }

  // validate required
  if (required && (value === undefined || value === null || value.length === 0)) {
    return handleError(label, value, 'required', tip);
  }

  var reg = _regex2.default[type];

  // custom validator
  if (validator) {
    if (typeof validator === 'function') {
      validator = { func: validator };
    }
    if (validator.func) {
      return validator.func(value, formData);
    }
    if (validator.reg) {
      reg = validator.reg;
      if (typeof reg === 'string') {
        reg = new RegExp(reg);
      }
    }
  }

  // skip empty value
  if (value === undefined || value === null || value === '') {
    return true;
  }

  // validate type
  if (reg && !reg.test(value)) {
    return handleError(label, value, type, tip);
  }

  switch (valueType) {
    case 'array':
      len = (0, _str.toArray)(value, sep).length;
      break;
    case 'number':
      len = parseFloat(value);
      break;
    default:
      len = value.length;
      break;
  }

  if (max && len > max) {
    return handleError(label, max, 'max.' + valueType, tip);
  }

  if (min && len < min) {
    return handleError(label, min, 'min.' + valueType, tip);
  }

  return true;
};