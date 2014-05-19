module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'password-settings form-horizontal',

  template: require('settings/templates/password-settings'),

  saveOnSubmit: false,

  elements: {
    currentPassword: '#userPasswordCurrent',
    newPassword: '#userPasswordNew',
    confirmPassword: '#userPasswordRepeat'
  },

  bindings: {
    model: {
      'user:change-password:error': 'onChangePasswordError',
      'user:change-password:success': 'onChangePasswordSuccess',
    }
  },

  model: function() {
    return App.User;
  },

  onSubmit: function() {
    var currentPassword = this.getElement('currentPassword').val(),
      newPassword = this.getElement('newPassword').val(),
      confirmPassword = this.getElement('confirmPassword').val(),
      error = 'This field is required.';

    if(!currentPassword) {
      return this.getAttributeErrorElement('currentPassword').show().text(error);
    }

    if(!newPassword) {
      return this.getAttributeErrorElement('newPassword').show().text(error);
    }

    if(!confirmPassword) {
      return this.getAttributeErrorElement('confirmPassword').show().text(error);
    }

    if(newPassword !== confirmPassword) {
      error = "Password doesn't match the confirmation.";
      return this.getAttributeErrorElement('confirmPassword').show().text(error);
    }

    this.model.changePassword(currentPassword, newPassword, confirmPassword);
  },

  onChangePasswordError: function(error) {
    var errorElement;

    if(error.current_password) {
      errorElement = 'currentPassword';
      error = error.current_password[0];
    } else if(error.password1) {
      errorElement = 'newPassword';
      error = error.password1[0];
    } else if(error.password2) {
      errorElement = 'confirmPassword';
      error = error.password2[0];
    }

    error = error ? error : 'An error ocurred.';

    this.getAttributeErrorElement(errorElement).show().text(error);
  },

  onChangePasswordSuccess: function() {
    this.reset();
  },

  reset: function() {
    Z.FormView.prototype.reset.apply(this, arguments);

    this.getElement('currentPassword').val('');
    this.getElement('newPassword').val('');
    this.getElement('confirmPassword').val('');
  }
});

