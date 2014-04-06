module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'forgot-password-form',

  template: require('forgot-password/templates/forgot-password-form'),

  successTemplate: require('forgot-password/templates/forgot-password-success'),

  saveOnSubmit: false,

  model: function() {
    return App.User;
  },

  elements: {
    submitBtn: 'button[data-action=recover]'
  },

  bindings: {
    model: {
      'user:forgot-password:error': 'onForgotPasswordError',
      'user:forgot-password:success': 'onForgotPasswordSuccess'
    }
  },

  onSetModel: function() {
    this.model.set('is_recovering_password', true);
  },

  onValidationSuccess: function() {
    this.model.forgotPassword();
    this.getElement('submitBtn').text('Sending recovery email...');
  },

  onForgotPasswordError: function(error) {
    this.getElement('submitBtn').text('Recover');
    this.getAttributeErrorElement('email').show().text(error);
  },

  onForgotPasswordSuccess: function() {
    this.getAttributeErrorElement('email').hide();
    this.render(this.successTemplate);
  }
});

