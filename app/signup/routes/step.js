module.exports = function(step) {
  if (this.User.isSignedIn()) {
    this.navigate('/accounts/', {trigger: true});
  } else if (this.User.get('signup_step') === 'request-signup') {
    this.navigate('', {trigger: true});
  } else {
    this.setController(require('signup/controller'));
    this.controller.renderStep(step);
  }
};
