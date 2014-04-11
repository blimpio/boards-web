var signupSteps = ['choose-email', 'validate-username', 'validate-password'];

module.exports = Zeppelin.Controller.extend({
  name: 'Signup',

  title: 'Blimp Boards | Signup',

  layouts: {
    main: require('signup/layouts/main')
  },

  subscriptions: {
    'signup:stepPassed': 'renderStep'
  },

  initialize: function() {
    this.getLayout('main').render().getRegion('form').show();
  },

  renderStep: function(step) {
    var stepView;

    if (step && signupSteps[step - 1]) {
      stepView = require('signup/views/' + signupSteps[step - 1]);
      App.User.set('signup_step', signupSteps[step - 1]);
    } else {
      step = _.indexOf(signupSteps, App.User.get('signup_step')) + 1;
      stepView = require('signup/views/' + App.User.get('signup_step'));
    }

    if (stepView) {
      this.broadcast('router:navigate', 'signup/step/' + step + '/', {
        trigger: false
      });

      this.getLayout('main').getRegion('form').show(stepView);
    }
  },

  continueWithToken: function(token) {
    if (App.User.get('signup_step') === 'request-signup') {
      App.User.updateSignupStep('choose-email');
    }

    App.User.setEmailFromJWT(token);

    if (App.User.get('email')) {
      this.renderStep();
    } else {
      alert('Invalid signup request token.');
      this.broadcast('router:navigate', '');
    }
  },

  signupWithInvite: function(token) {
    App.User.set('is_invite', true);

    if (token) {
      App.User.setEmailFromInviteJWT(token);
      App.User.updateSignupStep('validate-name');
      this.renderStep();
    } else {
      this.broadcast('router:navigate', '');
    }
  }
});
