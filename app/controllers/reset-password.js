module.exports = Zeppelin.View.extend({
  name: 'ResetPasswordController',

  template: require('templates/reset-password'),

  initialize: function() {
    document.title = 'Blimp | Reset Recovery';

    this.user = Boards.getUser();
    this.user.fetchCache();
  },

  renderForm: function() {
    if (this.user.canResetPassword()) {
      this.insert('#application').initForm();
    } else {
      this.publish('router:navigate', 'signin');
    }

    return this;
  },

  validateToken: function(token) {
    if (token) {
      this.user.setPasswordResetDataFromJWT(token);
    }

    this.renderForm();
    return this;
  },

  initForm: function() {
    return this.addChild(require('views/reset-password-form'), {model: this.user}).render();
  }
});
