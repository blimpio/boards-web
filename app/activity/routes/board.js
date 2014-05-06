module.exports = function(account, board) {
  if (!this.User.isSignedIn()) {
    this.navigate('/signin/', {trigger: true});
  } else {
    this.setController(require('activity/controller'), {
      board: board,
      account: account,
      comesFromAccountPage: this.isCurrentController('Account') ? true : void 0
    });
  }
};
