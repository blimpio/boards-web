var RequestSignupForm = require('./request-signup');

module.exports = RequestSignupForm.extend({
  className: 'signup-choose-email',

  template: require('signup/templates/choose-email'),

  events: {
    'click [data-action=reject]': 'reject',
    'click [data-action=choose]': 'choose'
  },

  partials: {
    'div.request-signup': require('signup/templates/request-signup')
  },

  model: function() {
    return App.User;
  },

  choose: function() {
    this.model.updateSignupStep('complete-signup');
    this.broadcast('signup:stepPassed');
  },

  reject: function() {
    this.renderPartial('div.request-signup');
  }
});

