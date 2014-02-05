module.exports = Zeppelin.Controller.extend({
  name: 'SigninController',

  title: 'Blimp | Signin',

  template: require('templates/signin'),

  subscriptions: {
    'user:signed:in': function() {
      this.redirect('boards');
    }
  },

  initialize: function() {
    this.user = this.persistData(require('models/user'));
    this.user.fetch({fromCache: true});

    if (this.user.isSignedIn()) {
      this.redirect('boards');
    } else {
      this.insert('#application');
    }
  },

  afterInserted: function() {
    var SigninFormView = require('views/signin-form');

    this.signinForm = this.initializeChild(SigninFormView, {
      model: this.user
    });
  },
});
