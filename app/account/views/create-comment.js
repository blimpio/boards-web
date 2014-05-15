module.exports = Zeppelin.FormView.extend({
  className: 'create-comment',

  formSelector: 'form.create-comment-form',

  template: require('account/templates/create-comment'),

  model: require('core/models/comment'),

  elements: {
    'commentInput': 'textarea.create-comment-input'
  },

  events: {
    'click [data-action=cancel]': 'onCancel',
    'focus textarea.create-comment-input': 'toggleActions'
  },

  context: function() {
    return {
      creator: this.options.user
    }
  },

  initialize: function() {
    this.prepareModel();
  },

  toggleActions: function() {
    this.$el.toggleClass('is-open');
    this.getElement('commentInput').css({
      height: '35px'
    });
  },

  prepareModel: function() {
    this.setModel(require('core/models/comment'));
    this.model.set('card', this.options.card);
    return this;
  },

  onRender: function() {
    this.getElement('commentInput').autosize();
  },

  onCancel: function() {
    this.toggleActions();
    this.reset();
  },

  onValidationSuccess: function() {
    this.broadcast('comment:created', this.model);
  },

  onSubmit: function() {
    this.toggleActions();
    this.prepareModel();
    this.reset();
  }
});

