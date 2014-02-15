module.exports = Zeppelin.View.extend({
  name: 'SignupController',

  template: require('templates/signup'),

  subscriptions: {
    'user:signed:in': function() {
      this.publish('router:navigate', 'boards');
    }
  },

  initialize: function() {
    document.title = 'Blimp | Signup';

    this.user = _.getModel('User');
    this.user.fetchCache();

    if (this.user.isSignedIn()) {
      this.publish('router:navigate', 'boards');
    } else {
      this.insert('#application').initForm();
    }
  },

  initForm: function() {
    return this.addChild(require('views/signup-form'), {model: this.user}).render();
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
  }
});
