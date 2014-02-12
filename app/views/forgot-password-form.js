module.exports = Zeppelin.FormView.extend({
  name: 'ForgotPasswordForm',

  el: 'form.forgot-password__form',

  initialize: function() {
    this.setForm();
  },

  onSubmit: function(event) {
    var email = this.getAttributeValue('email');

    event.preventDefault();

    if (Z.Validations.isEmail(email)) {
      return this.model.forgotPassword(email).done(function(data) {
        this.model.set(data).saveCache();
        this.render(require('templates/forgot-password-success'));
      }.bind(this)).fail(function(error) {
        this.getAttributeErrorElement('email').text(error.email);
      }.bind(this));
    } else {
      this.getAttributeErrorElement('email').text('Provide a valid email.');
    }
  }

});
