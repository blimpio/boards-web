module.exports = Zeppelin.FormView.extend({
  el: 'form.signin',

  name: 'SigninForm',

  template: require('templates/signin-form'),

  initialize: function() {
    this.addValidations();
  },

  addValidations: function() {
    this.model.addValidation('username', [{
      isEmpty: false,
      message: 'A username is required to authenticate you.'
    }, {
      isAlphanumeric: true,
      message: 'Your username must be an alphanumeric value.'
    }]);

    this.model.addValidation('password', [{
      isEmpty: false,
      message: 'A password is required to authenticate you.'
    }, {
      isOfMinimumLength: 6,
      message: 'Your password must have a minimun of 6 characters.'
    }]);
  },

  onSubmit: function(event) {
    event.preventDefault();

    this.setAttributes();

    if (!this.model.validationError) {
      return this.model.signin().done(function(data) {
        this.model.clear().set(data).saveCache();
        this.publish('user:signed:in');
      }.bind(this)).fail(function(error) {
        this.getAttributeErrorElement('password').text(error.non_field_errors);
      }.bind(this));
    }
  }
});
