module.exports = Zeppelin.View.extend({
  name: 'ForgotPasswordController',

  template: require('templates/forgot-password'),

  initialize: function() {
    document.title = 'Blimp | Password Recovery';
    this.insert('#application').initForm();
  },

  initForm: function() {
    return this.addChild(require('views/forgot-password-form'), {
      model: _.getModel('User')
    }, 'form');
  }
});
