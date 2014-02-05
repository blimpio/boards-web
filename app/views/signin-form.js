module.exports = Zeppelin.FormView.extend({
  el: 'form.signin',

  name: 'SigninForm',

  template: require('templates/signin-form'),

  saveOnSubmit: false,

  events: {
    'click button[data-action=signin]': 'signin'
  },

  initialize: function() {
    this.addValidations();
  },

  addValidations: function() {
    this.model.validations = {};

    if (!this.model.hasValidation('username')) {
      this.model.addValidation('username', [{
        required: true,
        message: 'A username is required to authenticate you.'
      }, {
        isAlphanumeric: true,
        message: 'Your username must be an alphanumeric value.'
      }]);
    }

    if (!this.model.hasValidation('password')) {
      this.model.addValidation('password', [{
        required: true,
        message: 'A password is required to authenticate you.'
      }, {
        minLength: 8,
        message: 'Your password must have a minimun of 8 characters.'
      }]);
    }
  },

  signin: function() {
    var $errorElement = this.find('[data-model-attribute-error=password]');

    this.setAttributes();

    if (!this.model.validationError) {
      return this.model.signin().done(function(data) {
        this.model.clear().set(data).updateCache();
        this.publish('user:signed:in');
      }.bind(this)).fail(function(error) {
        $errorElement.show().text(error.non_field_errors);
      }.bind(this));
    }
  }
});
