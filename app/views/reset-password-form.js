module.exports = Zeppelin.FormView.extend({
  name: 'ResetPasswordForm',

  el: 'form.reset-password__form',

  bindings: {
    'model user:reset-password:success': 'onResetPasswordSuccess',
    'model user:reset-password:error': 'onResetPasswordError'
  },

  initialize: function() {
    this.setForm();
    return this;
  },

  onSubmit: function(event) {
    var password = this.getAttributeValue('password');

    event.preventDefault();

    if (Z.Validations.isOfMinimumLength(password, 8)) {
      this.model.resetPassword(password);
    } else {
      this.onResetPasswordError({password: ['Your password must have at least 8 characters.']});
    }

    return this;
  },

  onResetPasswordSuccess: function() {
    this.render(require('templates/reset-password-success'));
    return this;
  },

  onResetPasswordError: function(error) {
    this.getAttributeErrorElement('password').text(error);
    return this;
  }
});
