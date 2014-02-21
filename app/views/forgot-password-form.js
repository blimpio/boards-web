module.exports = Zeppelin.FormView.extend({
  name: 'ForgotPasswordForm',

  el: 'form.forgot-password__form',

  bindings: {
    'model user:forgot-password:success': 'onForgotPasswordSuccess',
    'model user:forgot-password:error': 'onForgotPasswordError'
  },

  model: App.User,

  initialize: function() {
    this.setForm();
    return this;
  },

  onSubmit: function(event) {
    var email = this.getAttributeValue('email');

    event.preventDefault();

    if (Z.Validations.isEmail(email)) {
      return this.model.forgotPassword(email);
    } else {
      this.onForgotPasswordError({email: ['Provide a valid email.']});
    }

    return this;
  },

  onForgotPasswordSuccess: function() {
    this.render(require('templates/forgot-password-success'));
    return this;
  },

  onForgotPasswordError: function(error) {
    this.getAttributeErrorElement('email').text(error);
    return this;
  }
});
