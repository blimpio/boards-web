module.exports = Zeppelin.Controller.extend({
  title: 'Blimp Boards | Sign in.',

  layouts: {
    main: require('reset-password/layouts/main')
  },

  continueWithToken: function(token) {
    App.User.setPasswordResetDataFromJWT(token);

    if (App.User.canResetPassword()) {
      this.getLayout('main').render().getRegion('form').show();
    } else {
      alert('Invalid password reset token.');
      this.broadcast('router:navigate', '');
    }
  }
});
