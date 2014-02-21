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
    this.insert('#application').initChildren();
    return this;
  },

  initChildren: function() {
    this.addChild(_.createView('signup-form'), 'form').render();
    return this;
  },

  continueWithToken: function(token) {
    if (App.User.get('signup_step') < 3) {
      if (token) {
        App.User.setEmailFromJWT(token).updateSignupStep(3);
      } else if (App.User.isWaitingForEmailValidation()) {
        App.User.updateSignupStep(2).trigger('change:signup_step');
      } else {
        App.User.updateSignupStep(1);
      }
    }

    return this;
  }
});
