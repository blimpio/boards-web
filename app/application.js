var Application = new Zeppelin.Application({
  routes: {
    'signup(/)': 'signup',
    'signup?token:token(/)': 'signup#continueWithToken'
  },

  initialize: function() {
    var Connection = require('lib/connection');

    // Load helpers.
    require('lib/helpers');

    // Register Swag Helpers
    Swag.registerHelpers();

    // Create a Connection object to communicate with the server through web sockets.
    // The `connection` object will be added to the `Application` object so it's available through
    // `window.Application.connection`.
    this.connection = new Connection({
      type: APPLICATION_CONNECTION,
      httpUrl: APPLICATION_HTTP_URL,
      socketUrl: APPLICATION_WEBSOCKET_URL
    });

    // Connect to the server.
    this.connection.create().done(function() {
      this.start();
    }.bind(this)).fail(function() {
      console.log('Connection Error', arguments);
    }.bind(this));
  }
});

module.exports = window.Application = Application;

