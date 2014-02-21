module.exports = Zeppelin.View.extend({
  name: 'SignupController',

  template: require('templates/signup'),

  subscriptions: {
    'user:signup:success': function() {
      this.publish('router:navigate', 'accounts');
    }
  },

  initialize: function() {
    document.title = 'Blimp | Signup';
    this.user = App.User;
    this.insert('#application').initForm();
    return this;
  },

  initForm: function() {
    return this.addChild(require('views/signup-form'), {
      model: this.user
    }, 'form').render();
  },

  continueWithToken: function(token) {
    if (this.user.get('signup_step') < 3) {
      if (token) {
        this.user.setEmailFromJWT(token).updateSignupStep(3);
      } else if (this.user.isWaitingForEmailValidation()) {
        this.user.updateSignupStep(2).trigger('change:signup_step');
      } else {
        this.user.updateSignupStep(1);
      }
    }

    return this;
  }
});
