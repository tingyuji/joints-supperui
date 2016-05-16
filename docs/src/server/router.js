/**
 * 系统服务端路由
 * Created by Ray on 2016-03-04
 */
var path = require('path');
var Uri = require('../utils/uri');

const rootPath = __dirname + '/../../..';
const buildPath = rootPath + '/build';

module.exports.loadRouter = function(app){
  console.log("开始加载路由...");

  // TODO: 代理路由
  app.get("/", function(req, res, next){
    res.sendFile("/index.html", { root:  buildPath });
  });

  app.get(["/*"], function(req, res, next){
    var _uriObj = Uri.purl(req.path);

    var _uriSegPath = _uriObj.data.seg.path;

    if(_uriSegPath.length === 0 
      || _uriSegPath[0] === "static"
      || _uriSegPath[0] === "favicon.ico"){
      return next();
    }

    const _appName = _uriSegPath[0];

    var indexPath = "/index.html";
 
    if(_appName){
      indexPath = _appName + '/index.html';
    }

    res.sendFile(indexPath, { root:  buildPath });
  });
  
  console.log("路由加载完成")
}