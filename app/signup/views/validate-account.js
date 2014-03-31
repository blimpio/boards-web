module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'signup-validate-account',

  template: require('signup/templates/validate-account'),

  saveOnSubmit: false,

  model: function() {
    return App.User;
  },

  onValidationSuccess: function() {
    this.model.updateSignupStep('validate-domain');
    this.broadcast('signup:stepPassed');
  }
});

