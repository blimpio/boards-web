module.exports = Zeppelin.View.extend({
  name: 'SigninController',

  template: require('templates/signin'),

  subscriptions: {
    'user:signed:in': function() {
      this.publish('router:navigate', 'boards');
    }
  },

  initialize: function() {
    document.title = 'Blimp | Signin';

    this.user = Boards.getUser();
    this.user.fetchCache();

    if (this.user.isSignedIn()) {
      this.publish('router:navigate', 'boards');
    } else {
      this.insert('#application').initForm();
    }
  },

  initForm: function() {
    return this.addChild(require('views/signin-form'), {model: this.user}).render();
  }
});
