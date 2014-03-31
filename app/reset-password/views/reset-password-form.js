module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'reset-password-form',

  template: require('reset-password/templates/reset-password-form'),

  successTemplate: require('reset-password/templates/reset-password-success'),

  saveOnSubmit: false,

  model: function() {
    return App.User;
  },

  elements: {
    submitBtn: 'button[data-action=reset]'
  },

  bindings: {
    model: {
      'user:reset-password:error': 'onResetPasswordError',
      'user:reset-password:success': 'onResetPasswordSuccess'
    }
  },

  onAddModel: function() {
    this.model.set('is_recovering_password', true);
  },

  onValidationSuccess: function() {
    this.model.resetPassword();
    this.getElement('submitBtn').text('Reseting password...');
  },

  onResetPasswordError: function(error) {
    this.getElement('submitBtn').text('Reset');
    this.getAttributeErrorElement('email').text(error);
  },

  onResetPasswordSuccess: function() {
    this.render(this.successTemplate);
  }
});
