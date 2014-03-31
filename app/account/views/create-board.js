module.exports = Zeppelin.FormView.extend({
  className: 'create-board',

  formSelector: 'form.create-board-form',

  template: require('account/templates/create-board'),

  model: require('core/models/board'),

  events: {
    'click [data-action=cancel]': 'toggleCreateMode',
    'click [data-action=createBoard]': 'toggleCreateMode'
  },

  setAccount: function() {
    this.request('accounts:current', function(account) {
      if (account) {
        this.options.accountId = account.id;
        this.model.set('account', this.options.accountId);
      }
    });
  },

  toggleCreateMode: function() {
    this.$el.toggleClass('is-creating')
    this.focus();
    return this;
  },

  onRender: function() {
    this.setAccount();
  },

  onValidationSuccess: function() {
    this.broadcast('board:created', this.model);
    this.setModel(require('core/models/board'));
    this.model.set('account', this.options.accountId);
    this.reset();
    this.toggleCreateMode();
  }
});

