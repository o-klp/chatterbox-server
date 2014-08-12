/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var messages = { results:[
  { username:'joe', text:'this is a test', objectID: '123123asdasd1', roomname: 'lobby' },
  { username:'joe', text:'this is a test', objectID: '123asdasd1', roomname: 'lobby' },
  ]};

var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  console.log("Serving request type " + request.method + " for url " + request.url);

  // default request status code
  var statusCode = 404;

  // checks if the request points to this url
  if( request.url === '/classes/messages' ){

    // check if the request type is either GET or OPTIONS
    if( request.method === 'GET' || request.method === 'OPTIONS' ){

      statusCode = 200;
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
        messages.results.push( parsedBody );
      });

    }
  // same process when the request attempts to access a room url
  }else if( request.url === '/classes/room1' ){

    if( request.method === 'GET' ){
      statusCode = 200;
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

    }

  }
  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;


  headers['Content-Type'] = "text/plain";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

    /* Make sure to always call response.end() - Node will not send
     * anything back to the client until you do. The string you pass to
     * response.end() will be the body of the response - i.e. what shows
     * up in the browser.*/

     // want to pass in parsed data
  response.end(JSON.stringify(messages));

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
