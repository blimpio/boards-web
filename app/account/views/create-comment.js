module.exports = Zeppelin.FormView.extend({
  className: 'create-comment',

  formSelector: 'form.create-comment-form',

  template: require('account/templates/create-comment'),

  model: require('core/models/comment'),

  events: {
    'click [data-action=cancel]': 'toggleActions',
    'focus textarea.create-comment-input': 'toggleActions'
  },

  context: function() {
    return {
      creator: this.options.creator
    }
  },

  initialize: function() {
    this.prepareModel();
  },

  toggleActions: function() {
    this.$el.toggleClass('is-open');
  },

  prepareModel: function() {
    this.setModel(require('core/models/comment'));
    this.model.set('card', this.options.cardId);
    return this;
  },

  onValidationSuccess: function() {
    this.broadcast('comment:created', this.model);
    this.toggleActions();
    this.prepareModel();
    this.reset();
  }
});

