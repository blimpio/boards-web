module.exports = (function() {
  var Router = require('router');

  require('lib/config');
  require('lib/helpers');

  window.App = window.App || {};

  App.Router = new Router();

  App.User = _.createModel('user');
  App.Cache = _.createModel('app');
  App.Cards = _.createCollection('cards');
  App.Boards = _.createCollection('boards');
  App.Accounts = _.createCollection('accounts');
  App.Comments = _.createCollection('comments');

  App.User.signinFromCache();
  App.Router.start({pushState: true});
})();
