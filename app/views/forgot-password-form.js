module.exports = Zeppelin.FormView.extend({
  name: 'ForgotPasswordForm',

  el: 'form.forgot-password__form',

  events: {
    'click button[data-action=sendPasswordRecoveryEmail]': 'sendPasswordRecoveryEmail'
  },

  initialize: function() {
    this.setForm();
  },

  sendPasswordRecoveryEmail: function() {
    var email = this.getAttributeValue('email');

    if (Z.Validations.isEmail(email)) {
      return this.model.forgotPassword(email).done(function(data) {
        this.model.set(data).saveCache();
      }.bind(this)).fail(function(error) {
        this.getAttributeErrorElement('email').text(error.email);
      }.bind(this));
    } else {
      this.getAttributeErrorElement('email').text('Provide a valid email.');
    }
  }

});
