module.exports = function(token) {
  if (this.User.isSignedIn()) {
    this.navigate('/accounts/', {trigger: true});
  } else if (!token) {
    this.navigate('', {trigger: true});
  } else {
    this.setController(require('signup/controller'));
    this.controller.signupWithInvite(token);
  }
};
