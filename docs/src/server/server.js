/**
 * 服务器端启动程序
 * Created by Ray on 2016-03-03
 */
var express = require('express');

var AppRouter = require('./router');

const appServer = {};

var app_server_status = "uninitialized";
var app_server = null;

const app = express();
const rootPath = __dirname + '/../../..';
const buildPath = rootPath + '/build';

// 启动应用服务
appServer.start = function(){
  console.log("starting appServer....");

  appServer.exit();

  if(app_server_status === "uninitialized" || app_server_status == "closed"){
    console.log("initializing appServer");

    app.use('/static', express.static(buildPath + '/docs'));

    app_server_status = "initialized";

    console.log("appServer initialized");
  }

  if(app_server_status !== "initialized"){
    return;
  }

  // 加载应用模块
  AppRouter.loadRouter(app);

  var port = process.env.PORT || 16000;
  
  app_server = app.listen(port,function(){
    var host = app_server.address().address;
    var port = app_server.address().port;

    console.log("please visit:" + host + ":" + port);
  });

  app_server_status = "started";

  console.log("appServer started");
}

appServer.exit = function(){
  if(app_server && app_server_status == "started"){
    app_server.close();
    app_server_status = "closed";
  }
}

module.exports = appServer;
