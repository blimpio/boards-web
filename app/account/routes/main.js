module.exports = function(account) {
  var Controller = require('account/controller');

  if (!this.User.isSignedIn()) {
    this.navigate('/signin/', {trigger: true});
  } else {
    this.setController(new Controller({
      account: account
    }));
  }
};
