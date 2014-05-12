module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  attributes: {
    autocomplete: 'off'
  },

  className: 'signup-complete',

  template: require('signup/templates/complete-signup'),

  bindings: {
    self: {
      'before:submit': 'onBeforeSubmit'
    },

    model: {
      'user:signup:error': 'onSignupError',
      'user:signup:success': 'onSignupSuccess',
      'user:signup-username:error': 'onSignupUsernameError',
      'user:signup-username:success': 'onSignupUsernameSuccess'
    }
  },

  elements: {
    finishBtn: '[data-action=validate]'
  },

  saveOnSubmit: false,

  model: function() {
    return App.User;
  },

  resetFinishBtn: function() {
    this.getElement('finishBtn').text('Finish');
  },

  onBeforeSubmit: function() {
    this.getElement('finishBtn').text('Signing up...');
  },

  onValidationSuccess: function() {
    this.model.validateUsername();
  },

  onValidationError: function() {
    this.resetFinishBtn();
  },

  onSignupUsernameError: function(error) {
    this.resetFinishBtn();
    this.getAttributeErrorElement('username').show().text(error);
  },

  onSignupUsernameSuccess: function() {
    this.clean();
    this.model.signup();
  },

  onSignupError: function(error) {
    this.resetFinishBtn();
    this.getAttributeErrorElement('password').show().text(error);
  },

  onSignupSuccess: function() {
    this.clean();
    this.resetFinishBtn();
    this.broadcast('router:navigate', '/accounts/');
  }
});

