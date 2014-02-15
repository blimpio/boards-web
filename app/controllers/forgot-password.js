module.exports = Zeppelin.View.extend({
  name: 'ForgotPasswordController',

  template: require('templates/forgot-password'),

  initialize: function() {
    document.title = 'Blimp | Password Recovery';

    this.user = _.getModel('User');
    this.user.fetchCache();

    if (this.user.isSignedIn()) {
      this.publish('router:navigate', 'boards');
    } else {
      this.insert('#application').initForm();
    }
  },

  initForm: function() {
    return this.addChild(require('views/forgot-password-form'), {model: this.user}).render();
  }
});
