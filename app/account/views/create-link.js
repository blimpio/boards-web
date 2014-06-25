module.exports = Zeppelin.FormView.extend({
  className: 'create-link',

  formSelector: 'form.create-link-form',

  template: require('account/templates/create-link'),

  model: require('core/models/link'),

  events: {
    'click [data-action=cancel]': 'close',
    'click [data-action=submit]': 'submit'
  },

  initialize: function() {
    $('#create-link-modal').on('hide.bs.modal', _.bind(function() {
      this.reset();
    }, this));

    this.prepareModel();
  },

  prepareModel: function() {
    this.setModel(require('core/models/link'));
    this.model.set('board', this.options.board.id);
    return this;
  },

  close: function() {
    this.reset();
    $('#create-link-modal').modal('hide');
  },

  onValidationSuccess: function() {
    this.broadcast('card:created', this.model);
  },

  onSubmit: function() {
    if (!this.model.validationError) {
      this.prepareModel();
      this.close();
    }
  },

  onUnplug: function() {
    $('#create-link-modal').off('hide.bs.modal');
  }
});

