module.exports = function(account) {
  if (!this.User.isSignedIn()) {
    this.navigate('/signin/', {trigger: true});
  } else {
    this.setController(require('activity/controller'), {
      account: account,
      comesFromAccountPage: this.isCurrentController('Account') ? true : void 0
    });
  }
};
