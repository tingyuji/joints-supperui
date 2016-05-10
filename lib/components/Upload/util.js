'use strict';

var _apiadapter = require('../../utils/apiadapter');

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest !== 'undefined') {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

var _uploadParams = null;
var _uploadInfo = null;

// 从服务器端获取上传必须信息
function fetchUploadInfo(params, callback) {
  if (params && (_uploadParams !== params || !_uploadInfo)) {
    (0, _apiadapter.fetchApi)("upinfo").then(function (respData) {
      return callback(null, respData);
    }).catch(function (err) {
      return callback(err);
    });
  } else {
    return callback(null, _uploadInfo);
  }
}

function ajaxUpload(_ref, callback) {
  var url = _ref.url;
  var name = _ref.name;
  var cors = _ref.cors;
  var params = _ref.params;
  var uploadParams = _ref.uploadParams;
  var file = _ref.file;
  var onProgress = _ref.onProgress;
  var onLoad = _ref.onLoad;
  var onError = _ref.onError;
  var withCredentials = _ref.withCredentials;

  return fetchUploadInfo(uploadParams, function (err, respData) {
    if (err && callback) {
      return callback(err);
    }

    var data = new FormData();
    data.append(name, file);

    if (params) {
      for (var k in params) {
        data.append(k, params[k]);
      }
    }

    var xhr = createCORSRequest('post', url, cors);
    xhr.withCredentials = withCredentials;
    xhr.upload.addEventListener('progress', onProgress, false);
    xhr.onload = onLoad;
    xhr.onerror = onError;
    xhr.send(data);

    if (callback) {
      callback(null, xhr);
    }
  });
}

module.exports = function (args, callback) {
  return ajaxUpload(args, callback);
};