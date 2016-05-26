'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _supperutils = require('supperutils');

var _util = require('../Grid/util');

var _locals = require('../../locals');

var _enhance = require('../Form/enhance');

var _util2 = require('./util');

var _util3 = _interopRequireDefault(_util2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var nextUid = _supperutils.Str.nextUid;
var format = _supperutils.Str.format;

var Upload = function (_Component) {
  _inherits(Upload, _Component);

  function Upload(props) {
    _classCallCheck(this, Upload);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Upload).call(this, props));

    _this.state = {
      files: {}
    };
    _this.addFile = _this.addFile.bind(_this);
    _this.files = {};
    return _this;
  }

  _createClass(Upload, [{
    key: 'isCompleted',
    value: function isCompleted() {
      var completed = true,
          files = this.state.files;
      Object.keys(files).forEach(function (id) {
        if (files[id].status !== 2) {
          completed = false;
        }
      });
      return completed;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      var values = [],
          files = this.state.files;
      var sep = this.props.sep;

      Object.keys(files).forEach(function (id) {
        //if (autoUpload) {
        values.push(files[id].value);
        //} else {
        //  values.push(files[id].file.files[0]);
        //}
      });
      if (sep) {
        values = values.join(sep);
      }
      return values;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(value) {
      var onChange = this.props.onChange;

      if (value === undefined) {
        if (this.isCompleted()) {
          value = this.getValue();
        } else {
          value = new Error('');
        }
      }
      if (onChange) {
        onChange(value);
      }
    }
  }, {
    key: 'addFile',
    value: function addFile() {
      var _this2 = this;

      var _props = this.props;
      var accept = _props.accept;
      var autoUpload = _props.autoUpload;
      var disabled = _props.disabled;
      var readOnly = _props.readOnly;
      var fileSize = _props.fileSize;

      if (disabled || readOnly) {
        return;
      }

      var files = this.state.files,
          file = document.createElement('input');
      file.type = 'file';
      file.accept = accept;
      file.click();
      _supperutils.Dom.onEvent(file, 'change', function () {
        var blob = file.files[0];
        if (blob.size / 1024 > fileSize) {
          _this2.handleChange(new Error(format((0, _locals.getLang)('validation.tips.fileSize'), fileSize)));
          return;
        }

        var id = nextUid();
        files[id] = {
          file: file,
          name: file.files[0].name,
          status: autoUpload ? 1 : 0
        };

        if (autoUpload) {
          files[id].xhr = _this2.uploadFile(file, id);
        }
        _this2.setState({ files: files });
      });
    }
  }, {
    key: 'removeFile',
    value: function removeFile(id) {
      if (this.props.disabled || this.props.readOnly) {
        return;
      }

      var files = this.state.files;
      var file = files[id];
      if (file.xhr) {
        file.xhr.abort();
      }
      delete files[id];
      this.setState({ files: files });
      this.handleChange();
    }
  }, {
    key: 'uploadFile',
    value: function uploadFile(file, id) {
      var _this3 = this;

      var onUpload = this.props.onUpload;

      return (0, _util3.default)({
        url: this.props.action,
        name: this.props.name,
        cors: this.props.cors,
        params: this.props.params,
        withCredentials: this.props.withCredentials,
        file: file.files[0],
        onProgress: function onProgress(e) {
          var progress = _this3.files[id];
          progress.style.width = e.loaded / e.total * 100 + '%';
          _this3.handleChange(new Error(''));
        },
        onLoad: function onLoad(e) {
          var files = _this3.state.files;
          var value = e.currentTarget.responseText;
          if (onUpload) {
            value = onUpload(value);
          }

          if (value instanceof Error) {
            files[id].status = 3;
            files[id].name = value.message;
          } else {
            files[id].status = 2;
            files[id].value = value;
          }

          _this3.setState({ files: files });
          _this3.handleChange();
        },
        onError: function onError() {
          var files = _this3.state.files;
          files[id].status = 3;
          _this3.setState({ files: files });
          _this3.handleChange();
        }
      });
    }
  }, {
    key: 'start',
    value: function start() {
      var _this4 = this;

      var files = this.state.files;
      Object.keys(files).forEach(function (id) {
        _this4.uploadFile(files[id].file, id);
      });
    }
  }, {
    key: 'renderFiles',
    value: function renderFiles() {
      var _this5 = this;

      var files = this.state.files;
      return Object.keys(files).map(function (id, i) {
        var file = _this5.state.files[id];
        var className = (0, _classnames2.default)({
          'uploaded': file.status === 2,
          'has-error': file.status === 3
        });
        return _react2.default.createElement(
          'div',
          { key: i, className: className },
          _react2.default.createElement(
            'div',
            { className: 'cmpt-file' },
            _react2.default.createElement(
              'span',
              null,
              file.name
            ),
            _react2.default.createElement(
              'a',
              { className: 'remove', onClick: _this5.removeFile.bind(_this5, id) },
              '× ',
              (0, _locals.getLang)('buttons.cancel')
            )
          ),
          _react2.default.createElement('div', { ref: function ref(c) {
              return _this5.files[id] = c;
            }, className: 'cmpt-upload-progress' })
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var className = _props2.className;
      var grid = _props2.grid;
      var limit = _props2.limit;
      var style = _props2.style;
      var content = _props2.content;

      className = (0, _classnames2.default)((0, _util.getGrid)(grid), 'cmpt-upload-container', className);
      return _react2.default.createElement(
        'div',
        { className: className, style: style },
        Object.keys(this.state.files).length < limit && _react2.default.createElement(
          'div',
          { onClick: this.addFile },
          content
        ),
        this.renderFiles()
      );
    }
  }]);

  return Upload;
}(_react.Component);

Upload.propTypes = {
  accept: _react.PropTypes.string,
  action: _react.PropTypes.string.isRequired,
  autoUpload: _react.PropTypes.bool,
  className: _react.PropTypes.string,
  content: _react.PropTypes.object,
  cors: _react.PropTypes.bool,
  disabled: _react.PropTypes.bool,
  fileSize: _react.PropTypes.number,
  grid: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.object]),
  limit: _react.PropTypes.number,
  name: _react.PropTypes.string.isRequired,
  onChange: _react.PropTypes.func,
  onUpload: _react.PropTypes.func,
  params: _react.PropTypes.object,
  readOnly: _react.PropTypes.bool,
  sep: _react.PropTypes.string,
  style: _react.PropTypes.object,
  withCredentials: _react.PropTypes.bool
};

Upload.defaultProps = {
  autoUpload: true,
  cors: true,
  fileSize: 4096,
  limit: 1,
  withCredentials: false
};

module.exports = (0, _enhance.register)(Upload, 'upload', { valueType: 'array' });