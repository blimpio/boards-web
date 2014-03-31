module.exports = function(account, board, card) {
  var Controller = require('account/controller');

  if (!this.User.isSignedIn()) {
    this.navigate('/signin/', {trigger: true});
  } else {
    this.setController(new Controller({
      card: card,
      board: board,
      account: account
    }));
  }
};
