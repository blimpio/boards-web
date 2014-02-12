module.exports = Zeppelin.FormView.extend({
  name: 'ResetPasswordForm',

  el: 'form.reset-password__form',

  events: {
    'click button[data-action=resetPassword]': 'resetPassword'
  },

  initialize: function() {
    this.setForm();
  },

  resetPassword: function() {
    var password = this.getAttributeValue('password');

    if (Z.Validations.isOfMinimumLength(password, 8)) {
      return this.model.resetPassword(password).done(function(data) {
        this.model.unset('passwordResetData').cache.clearAll();
        this.render(require('templates/reset-password-success'));
      }.bind(this)).fail(function(error) {
        this.getAttributeErrorElement('password').text(error.token);
      }.bind(this));
    } else {
      this.getAttributeErrorElement('password').text('Your password must have at least 8 characters.');
    }
  }
});
