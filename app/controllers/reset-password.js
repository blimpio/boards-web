module.exports = Zeppelin.Controller.extend({
  name: 'ResetPasswordController',

  title: 'Blimp | Reset Recovery',

  template: require('templates/reset-password'),

  events: {
    'click button[data-action=resetPassword]': 'resetPassword'
  },

  elements: {
    'password': 'input.reset-password__password-field',
    'error': 'div.reset-password__password-error'
  },

  initialize: function() {
    this.user = this.persistData(require('models/user'));
    this.user.fetch({fromCache: true});
  },

  renderForm: function() {
    if (this.user.canResetPassword()) {
      this.insert('#application');
    } else {
      this.redirect('signin');
    }

    return this;
  },

  validateToken: function(data) {
    if (data.token) {
      this.user.setPasswordResetDataFromJWT(data.token);
    }

    this.renderForm();
    return this;
  },

  resetPassword: function() {
    var password = this.$password.val();

    if (Zeppelin.Validations.minLength(password, 8)) {
      return this.user.resetPassword(password).done(function(data) {
        this.user.unset('passwordResetData').clearCache();
        this.renderToContainer(require('templates/reset-password-success'));
      }.bind(this)).fail(function(error) {
        this.$error.text(error.token);
      }.bind(this));
    } else {
      this.$error.text('Your password must have at least 8 characters.');
    }
  }
});
