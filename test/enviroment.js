(function() {
  var Router = require('router');

  // Workaround for making sinon fakeServer work with Karma
  // when running tests in PhantomJS.
  // https://github.com/cjohansen/Sinon.JS/issues/319#issuecomment-34325683
  if (navigator.userAgent.indexOf('PhantomJS') !== -1) {
    window.ProgressEvent = function (type, params) {
      params = params || {};
      this.total = params.total || 0;
      this.loaded = params.loaded || 0;
      this.lengthComputable = params.lengthComputable || false;
    };
  }

  window.App = window.App || {};
  window.JWT_SIGNUP_TOKEN = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0eXBlIjogIlNpZ251cFJlcXVlc3QiLCAiZW1haWwiOiAic29tZXVzZXJAZXhhbXBsZS5jb20ifQ.heB3Y0qjUMq0cbrzIuz8q0tfn6o3VwKxdTjvUeIEtgM';
  window.JWT_PASSWORD_TOKEN = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0b2tlbl92ZXJzaW9uIjogImEyMmMzYjFkLWRkOGQtNDllZS05ZDA2LWQwNjJmNWY0NzQ1NiIsICJ0eXBlIjogIlBhc3N3b3JkUmVzZXQiLCAiaWQiOiAyfQ.D_D-tGwUmPSUofHEuWoZrgduVxCcVl36XCiiwGyxfaY';

  // Register Swag Helpers.
  Swag.Config.partialsPath = 'templates/';
  Swag.registerHelpers();

  // Turn off HTTP Requests for SANITY...
  Backbone.sync = function() {
    return {
      done: function() {},
      fail: function() {},
      then: function() {}
    };
  };

  // Prevent page reloads.
  window.onbeforeunload = function() {

  };

  // Clear localStorage
  localStorage.clear();

  // Load Helpers
  require('lib/helpers');

  $('body').append('<div id="application"></div>');

  App.Router = new Router();

  App.User = _.createModel('user');
  App.Cache = _.createModel('app');
  App.Cards = _.createCollection('cards');
  App.Boards = _.createCollection('boards');
  App.Accounts = _.createCollection('accounts');

  App.User.signinFromCache();
  App.Router.start({pushState: false});
})();
