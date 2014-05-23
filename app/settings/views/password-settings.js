module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'password-settings form-horizontal',

  template: require('settings/templates/password-settings'),

  saveOnSubmit: false,

  elements: {
    actions: 'div.settings-modal-actions',
    saveBtn: 'button[data-action=save]',
    newPassword: '#userPasswordNew',
    currentPassword: '#userPasswordCurrent',
    confirmPassword: '#userPasswordRepeat'
  },

  events: function() {
    return {
      'input input': _.debounce(this.onChange, 200),
      'click [data-action=cancel]': 'onCancel'
    };
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

  reset: function() {
    Z.FormView.prototype.reset.apply(this, arguments);

    this.getElement('newPassword').val('');
    this.getElement('currentPassword').val('');
    this.getElement('confirmPassword').val('');
  },

  onChange: function() {
    if (this.getElement('newPassword').val() &&
    this.getElement('currentPassword').val() &&
    this.getElement('confirmPassword').val()) {
      this.getElement('actions').show();
    } else {
      this.getElement('actions').hide();
    }
  },

  onCancel: function() {
    this.reset();
    this.getElement('actions').hide();
  },

  onValidationSuccess: function() {
    this.getElement('saveBtn').text('Saving changes...');
  },

  onChangePasswordError: function(error) {
    var errorElement;

    if(error.current_password) {
      error = error.current_password[0];
      errorElement = 'currentPassword';
    } else if(error.password1) {
      error = error.password1[0];
      errorElement = 'newPassword';
    } else if(error.password2) {
      error = error.password2[0];
      errorElement = 'confirmPassword';
    }

    error = error ? error : 'An error ocurred.';

    this.getAttributeErrorElement(errorElement).show().text(error);
  },

  onChangePasswordSuccess: function() {
    var self = this;

    this.getElement('saveBtn').text('Save');

    _.delay(function() {
      self.getElement('actions').hide();
    }, 200);
  },

  onSubmit: function() {
    var error = 'This field is required.',
        newPassword = this.getElement('newPassword').val(),
        currentPassword = this.getElement('currentPassword').val(),
        confirmPassword = this.getElement('confirmPassword').val();

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
      error = 'Password doesn\'t match the confirmation.';
      return this.getAttributeErrorElement('confirmPassword').show().text(error);
    }

    this.model.changePassword(currentPassword, newPassword, confirmPassword);
  }
});

