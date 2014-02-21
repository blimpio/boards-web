module.exports = Zeppelin.View.extend({
  name: 'SigninController',

  template: require('templates/signin'),

  subscriptions: {
    'user:signin:success': function() {
      this.publish('router:navigate', 'accounts');
    }
  },

  initialize: function() {
    document.title = 'Blimp | Signin';
    this.insert('#application').initChildren();
    return this;
  },

  initChildren: function() {
    this.addChild(_.createView('signin-form'), 'form').render();
    return this;
  }
});
