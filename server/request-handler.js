/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var url = require('url');
var fs = require('fs');

var messages = { results:[

  { username: 'john doe',
   text: 'message 1',
   roomname: 'lobby',
   objectId: 32,
   createdAt: '2014-08-12T17:26:38.255Z' },
 { username: 'john doe',
   text: 'messgae 2',
   roomname: 'lobby',
   objectId: 53,
   createdAt: '2014-08-12T17:26:39.300Z' },
 { username: 'john doe',
   text: 'message 3',
   roomname: 'lobby',
   objectId: 75,
   createdAt: '2014-08-12T17:26:40.347Z' },
 { username: 'john doe',
   text: 'message 4',
   roomname: 'lobby',
   objectId: 75,
   createdAt: '2014-08-12T17:26:42.347Z' },
 { username: 'john doe',
   text: 'message 5',
   roomname: 'lobby',
   objectId: 75,
   createdAt: '2014-08-12T17:26:43.347Z' },
 { username: 'john doe',
   text: 'message 6',
   roomname: 'lobby',
   objectId: 75,
   createdAt: '2014-08-12T17:26:45.347Z' },
 { username: 'john doe',
   text: 'message 7',
   roomname: 'lobby',
   objectId: 75,
   createdAt: '2014-08-12T17:26:47.347Z' },
 { username: 'john doe',
   text: 'message 8',
   roomname: 'lobby',
   objectId: 75,
   createdAt: '2014-08-12T17:26:50.347Z' },
 { username: 'john doe',
   text: 'message 9',
   roomname: 'lobby',
   objectId: 75,
   createdAt: '2014-08-12T17:26:51.347Z' },
 { username: 'john doe',
   text: 'message 10',
   roomname: 'lobby',
   objectId: 75,
   createdAt: '2014-08-12T17:27:40.347Z' }


] };

var handleRequest = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  // default request status code
  var statusCode = 404;

  var query = url.parse(request.url).query;
  var mainPath = url.parse(request.url).pathname;

  console.log('url -parse:', query);

  // checks if the request points to this url
  if( mainPath === '/classes/messages' ){

    // check if the request type is either GET or OPTIONS
    if( request.method === 'GET' || request.method === 'OPTIONS' ){

      statusCode = 200;

      var headers = defaultCorsHeaders;

      headers['Content-Type'] = "text/plain";

      response.writeHead(statusCode, headers);

      if(query === 'order=-createdAt'){
        if( !sortedResults ){
          var sortedResults = messages.results.slice(0);
          sortedResults.reverse();
          var sortedMessages = { results: sortedResults };
          var mostRecentSortedMessages = { results: sortedMessages.results.slice(0, 100) };
        }
        response.end(JSON.stringify(mostRecentSortedMessages));
      } else {
        response.end(JSON.stringify(messages));
      }


    } else if( request.method === 'POST' ){

      // sets a created status response
      statusCode = 201;

      // start building a body string that will represent the stringified message object
      var body = "";

      // once we get all the data, call the callback which builds out the body string
      request.on('data', function(data){

        body += data;

      });

      // once the data from the post request is finished processing, parse and add it to the message object
      request.on('end', function(){
        var parsedBody = JSON.parse(body);
        parsedBody.objectId = Math.floor(Math.random() * 100);
        console.log(parsedBody.roomname);
        var date = new Date();
        parsedBody.createdAt = date.toJSON();

        messages.results.push( parsedBody );
      });

      var headers = defaultCorsHeaders;

      headers['Content-Type'] = "text/plain";

      response.writeHead(statusCode, headers);

      response.end(JSON.stringify(messages));
    }
  // same process when the request attempts to access a room url
  }else if( mainPath === '/classes/room1' ){

    if( request.method === 'GET' ){
      statusCode = 200;
      var headers = defaultCorsHeaders;

      headers['Content-Type'] = "text/plain";

      response.writeHead(statusCode, headers);

      response.end(JSON.stringify(messages));
    }else if( request.method === 'POST' ){
      statusCode = 201;
      var body = "";

      request.on('data', function(data){
        body += data;
      });

      request.on('end', function(){
        var parsedBody = JSON.parse(body);
        messages.results.push( parsedBody );
      });

      var headers = defaultCorsHeaders;

      headers['Content-Type'] = "text/plain";

      response.writeHead(statusCode, headers);

      response.end(JSON.stringify(messages));
    }

  }


};

var handler = function(){}

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = {
  handler: handleRequest
}
