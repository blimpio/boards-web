module.exports = (function() {
  var Router = require('router');

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

  // Fetch user data from local storage, if any.
  _.getModel('User').fetchCache();

  // Initialize Router.
  Boards.Router = new Router();

  // Start listening to routes.
  Boards.Router.start();
})();
