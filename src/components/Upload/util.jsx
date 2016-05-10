'use strict';

import { fetchApi } from '../../utils/apiadapter';

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

let _uploadParams = null;
let _uploadInfo = null;

// 从服务器端获取上传必须信息
function fetchUploadInfo(params, callback){
  if(params && (_uploadParams !== params || !_uploadInfo)){
    fetchApi("upinfo").then(function(respData){
      return callback(null, respData)
    }).catch(function(err){
      return callback(err);
    })
  } else {
    return callback(null, _uploadInfo);
  }
}

function ajaxUpload({url, name, cors, params, uploadParams, file, onProgress, onLoad, onError, withCredentials}, callback) {
  return fetchUploadInfo(uploadParams, function(err, respData){
    if(err && callback){
      return callback(err);
    }

    let data = new FormData();
    data.append(name, file);

    if(params){
      for(var k in params){
        data.append(k, params[k]);
      }
    }

    let xhr = createCORSRequest('post', url, cors);
    xhr.withCredentials = withCredentials;
    xhr.upload.addEventListener('progress', onProgress, false);
    xhr.onload = onLoad;
    xhr.onerror = onError;
    xhr.send(data);

    if(callback){
      callback(null, xhr);
    }
  })
}

module.exports = function (args, callback) {
  return ajaxUpload(args, callback);
}
