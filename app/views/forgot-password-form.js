module.exports = Zeppelin.FormView.extend({
  name: 'ForgotPasswordForm',

  el: 'form.forgot-password__form',

  form: 'form.forgot-password__form',

  template: require('templates/forgot-password-form'),

  bindings: {
    'user:forgot-password:success': {
      callback: 'onForgotPasswordSuccess'
    },

    'user:forgot-password:error': {
      callback: 'onForgotPasswordError'
    }
  },

  model: App.User,

  onSubmit: function(event) {
    var email = this.getAttributeValue('email');

    event.preventDefault();

    if (Z.Validations.isEmail(email)) {
      this.model.forgotPassword(email);
    } else {
      this.onForgotPasswordError(null, {email: 'Provide a valid email.'});
    }

    return this;
  },

  onForgotPasswordSuccess: function() {
    this.render(require('templates/forgot-password-success'));
    return this;
  },

  onForgotPasswordError: function(element, error) {
    this.getAttributeErrorElement('email').text(error.email);
    return this;
  }
});
