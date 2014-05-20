module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'advanced-settings form-horizontal',

  template: require('settings/templates/advanced-settings'),

  saveOnSubmit: false,

  events: {
    'click [data-action=close-account]': 'toggleConfirmAccountWrapper',
    'click [data-action=cancel-confirm]': 'toggleConfirmAccountWrapper',
  },

  elements: {
    currentPassword: '#userPasswordCurrent',
    closeAccountWrapper: '.close-account-wrapper',
    confirmAccountWrapper: '.confirm-close-wrapper'
  },

  bindings: {
    model: {
      'user:cancel-account:success': 'onCancelAccountSuccess',
      'user:cancel-account:error': 'onCancelAccountError',
    }
  },

  model: function() {
    return App.User;
  },

  toggleConfirmAccountWrapper: function() {
    this.reset();

    this.getElement('closeAccountWrapper').toggleClass('hide');
    this.getElement('confirmAccountWrapper').toggleClass('hide');
  },

  submit: function() {
    var currentPassword = this.getElement('currentPassword').val(),
      error = 'This field is required.';

    if(!currentPassword) {
      return this.getAttributeErrorElement('currentPassword').show().text(error);
    }

    this.model.closeAccount(currentPassword);
  },

  onCancelAccountSuccess: function() {
    this.broadcast('settings:close');
    this.broadcast('router:navigate', '/', {
      trigger: true
    });
  },

  onCancelAccountError: function(error) {
    this.getAttributeErrorElement('currentPassword').show().text(error);
  },

  reset: function() {
    Z.FormView.prototype.reset.apply(this, arguments);

    this.getElement('currentPassword').val('');
  }
});

