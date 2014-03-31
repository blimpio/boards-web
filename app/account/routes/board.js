module.exports = function(account, board) {
  var Controller = require('account/controller');

  if (!this.User.isSignedIn()) {
    this.navigate('/signin/', {trigger: true});
  } else {
    this.setController(new Controller({
      board: board,
      account: account
    }));
  }
};
