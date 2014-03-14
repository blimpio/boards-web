module.exports = Zeppelin.FormView.extend({
  name: 'ResetPasswordForm',

  el: 'form.reset-password__form',

  form: 'form.reset-password__form',

  template: require('templates/reset-password-form'),

  bindings: {
    'user:reset-password:success': {
      callback: 'onResetPasswordSuccess'
    },

    'user:reset-password:error': {
      callback: 'onResetPasswordError'
    }
  },

  model: App.User,

  onSubmit: function(event) {
    var password = this.getAttributeValue('password');

    event.preventDefault();

    if (Z.Validations.isOfMinimumLength(password, 8)) {
      this.model.resetPassword(password);
    } else {
      this.onResetPasswordError(null, {password: 'Your password must have at least 8 characters.'});
    }

    return this;
  },

  onResetPasswordSuccess: function() {
    this.render(require('templates/reset-password-success'));
    return this;
  },

  onResetPasswordError: function(element, error) {
    this.getAttributeErrorElement('password').text(error.password);
    return this;
  }
});
