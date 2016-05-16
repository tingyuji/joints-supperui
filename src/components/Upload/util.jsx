'use strict';

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

function ajaxUpload({url, name, cors, params, uploadParams, file, onProgress, onLoad, onError, withCredentials}, callback) {
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
}

module.exports = function (args, callback) {
  return ajaxUpload(args, callback);
}
