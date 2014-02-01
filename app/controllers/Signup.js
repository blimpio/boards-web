module.exports = Zeppelin.Controller.extend({
  name: 'SignupController',

  title: 'Blimp | Signup',

  template: require('templates/signup'),

  initialize: function() {
    this.user = this.persistData(require('models/user'));
    this.user.fetch({fromCache: true});
  },

  afterInserted: function() {
    var SignupFormView = require('views/signup-form');

    this.signupForm = this.initializeChild(SignupFormView, {
      model: this.user
    });
  },

  continueWithToken: function(data) {
    if (data && data.token) {
      this.user.setEmailFromJWT(data.token).updateSignupStep(3);
    } else if (this.user.isWaitingForEmailValidation()) {
      this.user.updateSignupStep(2).trigger('change:signup_step');
    } else {
      this.user.updateSignupStep(1);
    }
  }
});
