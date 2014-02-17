module.exports = Zeppelin.View.extend({
  name: 'SigninController',

  template: require('templates/signin'),

  subscriptions: {
    'user:signed:in': function() {
      this.publish('router:navigate', 'accounts');
    }
  },

  initialize: function() {
    document.title = 'Blimp | Signin';
    this.insert('#application').initForm();
  },

  initForm: function() {
    return this.addChild(require('views/signin-form'), {
      model: _.getModel('User')
    }, 'form').render();
  }
});
