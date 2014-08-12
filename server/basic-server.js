/* Import node's http module: */
var http = require("http");
var reqHandler = require("./request-handler.js");
var express = require('express');
var path = require('path');

var app = express();

var newPath = path.resolve('.', '../client/client/index.html');

app.get('/', function(request, response){
  response.sendFile(newPath);
});

app.get('/classes/messages', function(request, response){
  reqHandler.handler(request, response);
});

app.post('/classes/messages', function(request, response){
  reqHandler.handler(request, response);
});

app.get('/classes/room1', function(request, response){
  reqHandler.handler(request, response);
});

app.post('/classes/room1', function(request, response){
  reqHandler.handler(request, response);
});

var cssPath = path.resolve('.', '../client/client/styles/styles.css');
app.get('/styles/styles.css', function(request, response){
  response.sendFile(cssPath);
});

var appPath = path.resolve('.', '../client/client/scripts/app.js');
app.get('/scripts/app.js', function(request, response){
  response.sendFile(appPath);
});

var underscorePath = path.resolve('.', '../client/client/bower_components/underscore/underscore.js');
app.get('/bower_components/underscore/underscore.js', function(request, response){
  response.sendFile(underscorePath);
});

var configPath = path.resolve('.', '../client/client/scripts/config.js');
app.get('/scripts/config.js', function(request, response){
  response.sendFile(configPath);
});

var imagesPath = path.resolve('.', '../client/client/images/spiffygif_46x46.gif');
app.get('/images/spiffygif_46x46.gif', function(request, response){
  response.sendFile(imagesPath);
});

var jqueryPath = path.resolve('.', '../client/client/bower_components/jquery/jquery.min.js');
app.get('/bower_components/jquery/jquery.min.js', function(request, response){
  response.sendFile(jqueryPath);
});

var directoryPath = path.resolve('.', '../client/client');
console.log(directoryPath)
app.use(express.static (__dirname + directoryPath));

var server = app.listen(3000, function(){
  console.log('listening');
});
