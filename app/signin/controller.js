module.exports = Zeppelin.Controller.extend({
  title: 'Sign in - Blimp Boards',

  layouts: {
    main: require('signin/layouts/main')
  },

  subscriptions: {
    'user:reject-invite:success': 'onRejectInvite',
    'user:accept-invite:success': 'onAcceptInvite'
  },

  initialize: function() {
    _.bindAll(this, ['onInviteFetchSuccess', 'onInviteFetchFail']);
  },

  renderLayout: function(hasInvite) {
    this.getLayout('main').render(hasInvite);
  },

  renderForm: function() {
    this.getLayout('main').showForm();
  },

  signinWithInvite: function() {
    App.User.set('is_invite', true);

    if (this.options.inviteToken) {
      App.User.setEmailFromInviteJWT(this.options.inviteToken);

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

    if (App.User.isSignedIn()) {
      this.getLayout('main').toggleInviteFullWidth();
    } else {
      this.renderForm();
    }

    this.getLayout('main')
      .showInvitation(context)
      .toggleLoadingMainState();
  },

  onInviteFetchFail: function() {
    this.renderForm();
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
