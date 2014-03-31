module.exports = Zeppelin.ModelView.extend({
  className: 'signup-validate-account-email',

  template: require('signup/templates/validate-account-email'),

  successTemplate: require('signup/templates/request-signup-success'),

  elements: {
    requestBtn: 'button[data-action=confirm]',
    emailError: 'div[data-error=email]'
  },

  events: {
    'click [data-action=confirm]': 'confirm',
    'click [data-action=request]': 'request'
  },

  bindings: {
    model: {
      'user:request-invite:error': 'onRequestError',
      'user:request-invite:success': 'onRequestSuccess',
      'user:signup-request:error': 'onRequestError',
      'user:signup-request:success': 'onRequestSuccess'
    }
  },

  model: function() {
    return App.User;
  },

  context: function() {
    return {
      domain: this.model.getDomain(),
      account: this.model.get('requesting_account').name
    }
  },

  confirm: function() {
    this.model.set('is_invite').requestInvite();
    this.getElement('requestBtn').text('Requesting invite...');
  },

  request: function() {
    this.model.requestSignup();
    this.getElement('requestBtn').text('Requesting signup...');
  },

  onRequestError: function(error) {
    this.getElement('emailError').text(error);
  },

  onRequestSuccess: function() {
    if (this.model.get('is_invite')) {
      this.model.updateSignupStep('choose-name');
    } else {
      this.model.updateSignupStep('choose-email');
    }

    this.render(this.successTemplate, {
      email: this.model.get('email')
    });
  }
});

