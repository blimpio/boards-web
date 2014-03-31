module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'request-signup-form',

  template: require('home/templates/request-signup-form'),

  successTemplate: require('signup/templates/request-signup-success'),

  saveOnSubmit: false,

  model: function() {
    return App.User;
  },

  elements: {
    submitBtn: 'button.request-signup-btn'
  },

  bindings: {
    model: {
      'user:check-domain:error': 'onCheckDomainError',
      'user:check-domain:success': 'onCheckDomainSuccess',
      'user:signup-request:error': 'onRequestSignupError',
      'user:signup-request:success': 'onRequestSignupSuccess'
    }
  },

  onValidationSuccess: function() {
    var domain = this.getAttributeValue('email').split('@')[1];
    this.model.checkSignupEmailDomain(domain);
    this.getElement('submitBtn').text('Requesting signup...');
  },

  onCheckDomainError: function(error) {
    this.getElement('submitBtn').text('Get Started Free');
    this.getAttributeErrorElement('email').text(error);
  },

  onCheckDomainSuccess: function(account) {
    if (account && account.id) {
      this.model.set({
        'email': this.getAttributeValue('email'),
        'signup_step': 'validate-account-email',
        'requesting_account': account
      }).saveCache();

      this.broadcast('router:navigate', 'signup/');
    } else {
      this.model.set({
        'email': this.getAttributeValue('email'),
        'signup_step': 'choose-email'
      }).saveCache();

      this.model.requestSignup();
    }
  },

  onRequestSignupError: function(error) {
    this.getElement('submitBtn').text('Get Started Free');
    this.getAttributeErrorElement('email').text(error);
  },

  onRequestSignupSuccess: function() {
    this.model.updateSignupStep('choose-email');
    this.render(this.successTemplate, {
      email: this.model.get('email')
    });
  }
});

