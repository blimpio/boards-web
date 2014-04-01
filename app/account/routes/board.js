module.exports = function(account, board) {
  if (!this.User.isSignedIn()) {
    this.navigate('/signin/', {trigger: true});
  } else {
    this.setController(require('account/controller'), {
      board: board,
      account: account
    });
  }
};
