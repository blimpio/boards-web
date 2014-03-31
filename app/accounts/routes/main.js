module.exports = function() {
  if (!this.User.isSignedIn()) {
    this.navigate('/signin/', {trigger: true});
  } else if (this.User.get('accounts').length === 1) {
    this.navigate('/' + this.User.get('accounts')[0].slug + '/', {trigger: true});
  } else {
    this.setController(require('accounts/controller'));
  }
};
