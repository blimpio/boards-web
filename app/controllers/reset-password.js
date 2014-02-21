module.exports = Zeppelin.View.extend({
  name: 'ResetPasswordController',

  template: require('templates/reset-password'),

  initialize: function() {
    document.title = 'Blimp | Reset Recovery';
    this.user = App.User;
    return this;
  },

  renderForm: function() {
    this.insert('#application').initForm();
    return this;
  },

  validateToken: function(token) {
    if (token) this.user.setPasswordResetDataFromJWT(token);
    if (this.user.canResetPassword()) this.renderForm();
    return this;
  },

  initForm: function() {
    return this.addChild(require('views/reset-password-form'), {
      model: this.user
    }, 'form');
  }
});
