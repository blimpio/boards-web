module.exports = Zeppelin.Controller.extend({
  name: 'ForgotPasswordController',

  title: 'Blimp | Password Recovery',

  template: require('templates/forgot-password'),

  events: {
    'click button[data-action=sendPasswordRecoveryEmail]': 'sendPasswordRecoveryEmail'
  },

  elements: {
    'email': 'input.forgot-password__email-field',
    'error': 'div.forgot-password__email-error'
  },

  initialize: function() {
    this.user = this.persistData(require('models/user'));
    this.user.fetch({fromCache: true});

    if (this.user.isSignedIn()) {
      this.redirect('boards');
    } else {
      this.insert('#application');
    }
  },

  sendPasswordRecoveryEmail: function() {
    var email = this.$email.val();

    if (Zeppelin.Validations.isEmail(email)) {
      return this.user.forgotPassword(email).done(function(data) {
        this.$error.text('');
        this.user.set(data).updateCache();
      }.bind(this)).fail(function(error) {
        this.$error.text(error.email);
      }.bind(this));
    } else {
      this.$error.text('Provide a valid email.');
    }
  }
});
