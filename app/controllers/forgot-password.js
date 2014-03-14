module.exports = Zeppelin.View.extend({
  name: 'ForgotPasswordController',

  el: '#application',

  template: require('templates/forgot-password'),

  views: {
    'form': require('views/forgot-password-form')
  },

  initialize: function() {
    document.title = 'Blimp | Password Recovery';
    return this;
  }
});
