module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'signup-request',

  template: require('signup/templates/request-signup'),

  successTemplate: require('signup/templates/request-signup-success'),

  elements: {
    requestBtn: 'button[data-action=request]'
  },

  bindings: {
    model: {
      'user:signup-request:error': 'onRequestSignupError',
      'user:signup-request:success': 'onRequestSignupSuccess'
    }
  },

  model: function() {
    return App.User;
  },

  saveOnSubmit: false,

  onValidationSuccess: function() {
    this.model.requestSignup();
    this.getElement('requestBtn').text('Requesting signup...');
  },

  onRequestSignupError: function(error) {
    this.getElement('requestBtn').text('Sign up');
    this.getAttributeErrorElement('email').show().text(error);
  },

  onRequestSignupSuccess: function() {
    this.getAttributeErrorElement('email').hide();
    this.model.updateSignupStep('choose-email');
    this.render(this.successTemplate, {
      email: this.model.get('email')
    });
  }
});

