module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'signup-validate-username',

  template: require('signup/templates/validate-username'),

  bindings: {
    model: {
      'user:signup-username:error': 'onSignupUsernameError',
      'user:signup-username:success': 'onSignupUsernameSuccess'
    }
  },

  saveOnSubmit: false,

  model: function() {
    return App.User;
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      domain: this.model.getDomain()
    });
  },

  onValidationSuccess: function() {
    this.model.validateUsername();
  },

  onSignupUsernameError: function(error) {
    this.getAttributeErrorElement('username').text(error);
  },

  onSignupUsernameSuccess: function() {
    this.model.updateSignupStep('validate-password');
    this.broadcast('signup:stepPassed');
  }
});

