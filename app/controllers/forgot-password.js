module.exports = Zeppelin.View.extend({
  name: 'ForgotPasswordController',

  template: require('templates/forgot-password'),

  initialize: function() {
    document.title = 'Blimp | Password Recovery';
    this.insert('#application').initChildren();
    return this;
  },

  initChildren: function() {
    this.addChild(_.createView('forgot-password-form'), 'form').render();
    return this;
  }
});
