module.exports = (function() {
  var Router;

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
    },

    contentType: 'application/json; charset=utf-8'
  });

  // Register Swag Helpers.
  Swag.registerHelpers();

  // Create the accounts collection.
  _.getCollection('Accounts');

  // Try to login user form localstorage.
  _.getModel('User').signinFromCache();

  // Initialize Router.
  Router = require('router');
  Boards.Router = new Router();

  // Start listening to routes.
  Boards.Router.start();
})();
