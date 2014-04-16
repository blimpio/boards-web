module.exports = function(step) {
  if (this.User.isSignedIn()) {
    this.navigate('/accounts/', {trigger: true});
  } else if (this.User.get('signup_step') === 'request-signup') {
    this.navigate('', {trigger: true});
  } else {
    this.setController(require('signup/controller'));

    if (this.User.hasInvitation()) {
      this.controller.renderLayout(true);
      this.controller.signupWithInvite(this.User.get('invited_user_token'));
    } else {
      this.controller.renderLayout(false);
      this.controller.renderStep();
    }
  }
};
