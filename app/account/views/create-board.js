module.exports = Zeppelin.FormView.extend({
  className: 'create-board',

  formSelector: 'form.create-board-form',

  template: require('account/templates/create-board'),

  model: require('core/models/board'),

  events: {
    'click [data-action=cancel]': 'toggleCreateMode',
    'click [data-action=createBoard]': 'toggleCreateMode'
  },

  toggleCreateMode: function() {
    this.$el.toggleClass('is-creating')
    this.focus();
    return this;
  },

  onRender: function() {
    this.account = App.Accounts.getPersonalAccount().id;
    this.model.set('account', this.account);
  },

  onValidationSuccess: function() {
    this.broadcast('board:created', this.model);
  },

  onSubmit: function() {
    this.setModel(require('core/models/board'));
    this.model.set('account', this.account);
    this.reset();
    this.toggleCreateMode();
  }
});

