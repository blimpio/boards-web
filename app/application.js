module.exports = (function() {
  var Router = require('router');

  require('lib/config');
  require('lib/helpers');

  window.Boards = {};

  Boards.User = _.createModel('user');
  Boards.Boards = _.createCollection('boards');
  Boards.Accounts = _.createCollection('accounts');

  Boards.Router = new Router();

  Boards.User.signinFromCache();
  Boards.Router.start();
})();
