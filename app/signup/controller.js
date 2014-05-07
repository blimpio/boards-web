var signupSteps = ['choose-email', 'validate-username', 'validate-password'];

module.exports = Zeppelin.Controller.extend({
  name: 'Signup',

  title: 'Sign up - Blimp Boards',

  layouts: {
    main: require('signup/layouts/main')
  },

  subscriptions: {
    'signup:stepPassed': 'renderStep',
    'user:reject-invite:success': 'onRejectInvite',
    'user:accept-invite:success': 'onAcceptInvite'
  },

  initialize: function() {
    _.bindAll(this, ['onInviteFetchSuccess', 'onInviteFetchFail']);
  },

  renderLayout: function(hasInvite) {
    this.getLayout('main').render(hasInvite);
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

      this.getLayout('main').showForm(stepView);
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

  signupWithInvite: function() {
    App.User.set('is_invite', true);

    if (this.options.inviteToken) {
      App.User.setEmailFromInviteJWT(this.options.inviteToken);
      App.User.updateSignupStep('validate-username');

      $.getJSON(App.API_URL + '/auth/invitations/' + this.options.inviteToken + '/')
        .done(this.onInviteFetchSuccess)
        .fail(this.onInviteFetchFail);
    } else {
      this.broadcast('router:navigate', '');
    }
  },

  onInviteFetchSuccess: function(response) {
    var context = _.extend({
      token: this.options.inviteToken,
      hasAuth: App.User.isSignedIn()
    }, response);

    if (response.signup_request_token) {
      App.User.setEmailFromJWT(response.signup_request_token);
    }

    if (App.User.isSignedIn()) {
      this.getLayout('main').toggleInviteFullWidth();
    } else {
      this.renderStep();
    }

    this.getLayout('main')
      .showInvitation(context)
      .toggleLoadingMainState();
  },

  onInviteFetchFail: function() {
    this.renderStep();
    this.getLayout('main')
      .toggleLoadingMainState()
      .toggleSignupFullWidth();
  },

  onRejectInvite: function() {
    if (App.User.isSignedIn()) {
      this.broadcast('router:navigate', '/accounts/');
    } else {
      this.getLayout('main').toggleSignupFullWidth();
    }
  },

  onAcceptInvite: function() {
    this.broadcast('router:navigate', '/accounts/');
  }
});
