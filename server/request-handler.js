/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

/*
  { username:'b', text:'this is a test', objectID: '123asdasd1', roomname: 'lobby' },
   { username:'foo', text:'this is what data looks like', objectID: '75', roomname: 'lobby' }
*/
var url = require('url');

var messages = { results:[
] };

var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
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
        // if we have not already sorted
        // sort results
        // else response.end sorted results
        if( !sortedResults ){
          var sortedResults = messages.results.reverse();
          var sortedMessages = { results: sortedResults };
          console.log('identified query', sortedMessages);
        }
        response.end(JSON.stringify(sortedMessages));
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
        parsedBody.roomname = 'lobby';

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
