module.exports = Zeppelin.ModelView.extend({
  className: 'invitation',

  events: {
    'click [data-action=reject]': 'reject',
    'click [data-action=accept]': 'accept'
  },

  elements: {
    'rejectBtn': '[data-action=reject]',
    'acceptBtn': '[data-action=accept]'
  },

  model: function() {
    return App.User;
  },

  template: function(context) {
    var template = this.options.isSignin
      ? require('core/templates/signin-invitation')
      : require('core/templates/signup-invitation');

    return template(context);
  },

  context: function() {
    return this.options;
  },

  initialize: function() {
    _.bindAll(this, ['remove']);
  },

  reject: function() {
    if (confirm('Are you sure you want to reject this invitation?')) {
      this.getElement('rejectBtn').text('Rejecting...');
      this.model.rejectInvitation().done(this.remove);
    }
  },

  accept: function() {
    this.getElement('acceptBtn').text('Accepting...');
    this.model.acceptInvitation().done(this.remove);
  }
});
