module.exports = Zeppelin.View.extend({
  name: 'ResetPasswordController',

  el: '#application',

  template: require('templates/reset-password'),

  autoRenders: false,

  views: {
    'form': require('views/reset-password-form')
  },

  initialize: function() {
    document.title = 'Blimp | Reset Password';
    return this;
  },

  validateToken: function(token) {
    if (token) App.User.setPasswordResetDataFromJWT(token);
    if (App.User.canResetPassword()) this.render();
    return this;
  }
});
