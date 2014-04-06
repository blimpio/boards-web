module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'signin-form',

  template: require('signin/templates/signin-form'),

  saveOnSubmit: false,

  model: function() {
    return App.User;
  },

  elements: {
    submitBtn: 'button[data-action=signin]'
  },

  bindings: {
    model: {
      'user:signin:error': 'onSigninError',
      'user:signin:success': 'onSigninSuccess'
    }
  },

  onSetModel: function() {
    this.model.set('is_signin', true);
  },

  onValidationSuccess: function() {
    this.model.signin();
    this.getElement('submitBtn').text('Signing you in...');
  },

  onSigninError: function(error) {
    this.getElement('submitBtn').text('Sign in');
    this.getAttributeErrorElement('password').show().text(error);
  },

  onSigninSuccess: function() {
    this.getAttributeErrorElement('password').hide();
    this.broadcast('router:navigate', '/accounts/');
  }
});

