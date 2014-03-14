module.exports = Zeppelin.FormView.extend({
  name: 'CreateCard',

  el: 'form.create-card',

  model: require('models/card'),

  events: {
    'click [data-action=cancel]': 'onClickCancel'
  },

  elements: {
    'nameInput': '[name=name]',
    'contentInput': '[name=content]'
  },

  subscriptions: {
    'card:creating': 'renderCardForm'
  },

  initialize: function() {
    this.prepareModel();
  },

  prepareModel: function() {
    this.model.set({
      'type': 'note',
      'board': App.Cache.get('current_board')
    });

    return this;
  },

  renderCardForm: function() {
    this.render(require('templates/create-note'));
    return this;
  },

  onClickCancel: function() {
    this.reset().publish('card:creating:cancel');
    return this;
  },

  reset: function() {
    this.$nameInput.val('');
    this.$contentInput.val('');
    return this;
  },

  onSubmit: function(event) {
    event.preventDefault();

    this.setAttributes();

    if (!this.model.validationError) {
      this.model.save();

      this.reset()
        .publish('card:created', this.model)
        .setModel(_.createModel('card'))
        .prepareModel();
    }

    return this;
  }
});
