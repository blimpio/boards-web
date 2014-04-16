module.exports = function(token) {
  if (this.User.isSignedIn() && !token) {
    this.navigate('/accounts/', {trigger: true});
  } else if (!token) {
    this.setController(require('signin/controller'));
    this.controller.renderLayout(false);
    this.controller.renderForm();
  } else {
    this.setController(require('signin/controller'), {
      inviteToken: token
    });

    this.controller.renderLayout(true);
    this.controller.signinWithInvite();
  }
};
