module.exports = Zeppelin.FormView.extend({
  el: 'form.signin',

  name: 'SigninForm',

  form: 'form.signin',

  template: require('templates/signin-form'),

  bindings: {
    'model user:signin:error': 'onAuthError'
  },

  model: App.User,

  onSubmit: function(event) {
    event.preventDefault();
    this.setAttributes();
    if (!this.model.validationError) this.model.signin();
    return this;
  },

  onAuthError: function(error) {
    if (error.username) this.getAttributeErrorElement('username').text(error.username);
    if (error.password) this.getAttributeErrorElement('password').text(error.password);
    return this;
  }
});
