module.exports = function(account, board, card) {
  if (!this.User.isSignedIn()) {
    this.navigate('/signin/', {trigger: true});
  } else {
    this.setController(require('account/controller'), {
      card: card,
      board: board,
      account: account
    });
  }
};
