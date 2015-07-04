#!/bin/env node

var AppContainer = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    ///**
    // *  Populate the cache.
    // */
    //self.populateCache = function() {
    //    if (typeof self.zcache === "undefined") {
    //        self.zcache = { 'index.html': '' };
    //    }
    //
    //    //  Local cache for static content.
    //    self.zcache['index.html'] = fs.readFileSync('./index.html');
    //};
    //
    //
    ///**
    // *  Retrieve entry (content) from cache.
    // *  @param {string} key  Key identifying content to retrieve from cache.
    // */
    //self.cache_get = function(key) { return self.zcache[key]; };
    //

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    ///**
    // *  Create the routing table entries + handlers for the application.
    // */
    //self.createRoutes = function() {
    //    self.routes = { };
    //
    //    self.routes['/asciimo'] = function(req, res) {
    //        var link = "http://i.imgur.com/kmbjB.png";
    //        res.send("<html><body><img src='" + link + "'></body></html>");
    //    };
    //
    //    self.routes['/'] = function(req, res) {
    //        res.setHeader('Content-Type', 'text/html');
    //        res.send(self.cache_get('index.html') );
    //    };
    //};
    //
    //
    ///**
    // *  Initialize the server (express) and create the routes and register
    // *  the handlers.
    // */
    //self.initializeServer = function() {
    //    self.createRoutes();
    //    self.app = express.createServer();
    //
    //    //  Add handlers for the app (from the routes).
    //    for (var r in self.routes) {
    //        self.app.get(r, self.routes[r]);
    //    }
    //};
    //

    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        //self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        //self.initializeServer();
    };


  self.setupServer = function() {

    /**
     * Module dependencies.
     */

    var app = require('./app');
    var http = require('http');

    /**
     * Get port from environment and store in Express.
     */

    var port = normalizePort(self.port);

    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(self.port, self.ipaddress, function () {
      console.log('%s: Node server started on %s:%d ...',
        Date(Date.now()), self.ipaddress, self.port);
    });
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
      var port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
      var addr = server.address();
      console.log('Server on port : ' + addr.port);
    }


    /**
     *  Start the server (starts up the sample application).
     */
    //self.start = function() {
    //    //  Start the app on the specific interface (and port).
    //    self.app.listen(self.port, self.ipaddress, function() {
    //        console.log('%s: Node server started on %s:%d ...',
    //                    Date(Date.now() ), self.ipaddress, self.port);
    //    });
    //};
  };
};


/**
 *  main():  Main code.
 */
var zapp = new AppContainer();
zapp.initialize();
zapp.setupServer();
//zapp.start();

//=====================================================================================
