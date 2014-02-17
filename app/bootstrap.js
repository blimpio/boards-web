module.exports = (function() {
  var Router = require('router'),
      Connection = require('lib/connection');

  // App namespace.
  window.Boards = {
    Models: {},
    Collections: {}
  };

  // Load helpers.
  require('lib/helpers');

  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      var token = _.getModel('User').get('token');
      if (token) xhr.setRequestHeader('Authorization', 'JWT ' + token);
    }
  });

  // Register Swag Helpers.
  Swag.registerHelpers();

  // Initialize Router.
  Boards.Router = new Router();

  // Create a Connection object to communicate with the server through web sockets.
  // The `connection` object will be added to the `Application` object so it's available through
  // `window.Application.connection`.
  Boards.Connection = new Connection({
    type: APPLICATION_CONNECTION,
    httpUrl: APPLICATION_HTTP_URL,
    socketUrl: APPLICATION_WEBSOCKET_URL
  });

  // Connect to the server.
  Boards.Connection.create().done(function() {
    Boards.Router.start();
  }).fail(function() {
    console.log('Connection Error', arguments);
  });
})();
