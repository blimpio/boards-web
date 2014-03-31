module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'signup-validate-name',

  template: require('signup/templates/validate-name'),

  saveOnSubmit: false,

  model: function() {
    return App.User;
  },

  onValidationSuccess: function() {
    if (this.model.get('is_invite')) {
      this.model.updateSignupStep('validate-username');
    } else {
      this.model.updateSignupStep('validate-account');
    }

    this.broadcast('signup:stepPassed');
  }
});

