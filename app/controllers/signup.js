module.exports = Zeppelin.View.extend({
  name: 'SignupController',

  el: '#application',

  template: require('templates/signup'),

  subscriptions: {
    'user:signup:success': function() {
      this.publish('router:navigate', '/accounts/');
    }
  },

  views: {
    'form': require('views/signup-form')
  },

  initialize: function() {
    document.title = 'Blimp | Signup';
    return this;
  },

  continueWithToken: function(token) {
    if (token) App.User.setEmailFromJWT(token);

    if (App.User.get('signup_step') < 3) {
      if (token) {
        App.User.updateSignupStep(3);
      } else if (App.User.isWaitingForEmailValidation()) {
        App.User.updateSignupStep(2).trigger('change:signup_step');
      } else {
        App.User.updateSignupStep(1);
      }
    }

    return this;
  },

  signupWithInviteToken: function(token) {
    App.User.set('is_invite', true);
    console.log(token);
    if (token) App.User.setEmailFromInviteJWT(token);

    if (App.User.get('signup_step') < 3) {
      if (token) {
        App.User.updateSignupStep(3);
      } else if (App.User.isWaitingForEmailValidation()) {
        App.User.updateSignupStep(2).trigger('change:signup_step');
      } else {
        App.User.updateSignupStep(1);
      }
    }

    return this;
  }
});
