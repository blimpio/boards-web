module.exports = Zeppelin.FormView.extend({
  name: 'SigninForm',

  el: 'form.signin',

  form: 'form.signin',

  template: require('templates/signin-form'),

  bindings: {
    'user:signin:error': {
      callback: 'onAuthError'
    }
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
