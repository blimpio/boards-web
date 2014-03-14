module.exports = Zeppelin.View.extend({
  name: 'SigninController',

  el: '#application',

  template: require('templates/signin'),

  subscriptions: {
    'user:signin:success': function() {
      this.publish('router:navigate', '/accounts/');
    }
  },

  views: {
    'form': require('views/signin-form')
  },

  initialize: function() {
    document.title = 'Blimp | Signin';
    return this;
  }
});
