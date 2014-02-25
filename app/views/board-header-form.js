module.exports = Zeppelin.FormView.extend({
  el: 'div.boards__header',

  name: 'BoardHeaderForm',

  template: require('templates/board-header'),

  events: {
    'click [data-action=edit]': 'showEditMode',
    'click [data-action=cancel]': 'cancelEdit',
    'click [data-action=delete]': 'delete'
  },

  bindings: {
    'model edited': 'onEdited'
  },

  elements: {
    'nameInput': 'input[name=name]'
  },

  subscriptions: {
    'board:selected': 'changeBoard'
  },

  context: function() {
    return this.model.getPresenters(['name', 'thumbnail_sm_path']);
  },

  showEditMode: function() {
    this.$el.addClass('is-editing');
    this.$nameInput.focus();
  },

  hideEditMode: function() {
    this.$el.removeClass('is-editing');
  },

  cancelEdit: function() {
    this.hideEditMode();
    this.$nameInput.val(this.model.get('name'));
  },

  onSubmit: function(event) {
    event.preventDefault();
    this.setAttributes();

    if (!this.model.validationError) {
      this.model.trigger('edited', this.model, this.model.changedAttributes()).save();
      this.hideEditMode();
    }

    return this;
  },

  onEdited: function(model, changed) {
    if (changed) this.render();
    return this;
  },

  delete: function() {
    this.model.destroy();
  },

  changeBoard: function(board) {
    this.setModel(board, true).render();
    return this;
  }
});
