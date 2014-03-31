module.exports = Zeppelin.FormView.extend({
  className: 'board-detail clearfix',

  formSelector: 'form.edit-board-form',

  template: require('account/templates/board-detail'),

  events: {
    'click [data-action=edit]': 'toggleEditMode',
    'click [data-action=cancel]': 'toggleEditMode',
    'click [data-action=delete]': 'onClickDelete',
    'click [data-action=createFile]': 'onCreateFileClick'
  },

  elements: {
    name: 'strong.board-name'
  },

  bindings: {
    model: {
      'change:name': 'onNameChange'
    }
  },

  delete: function() {
    var msg = 'Are you sure you want to delete this board and it\'s cards?';
    if (window.confirm(msg)) this.model.destroy();
  },

  toggleEditMode: function() {
    this.$el.toggleClass('is-editing');

    if (this.$el.is('.is-editing')) {
      this.focus();
    } else {
      this.reset();
    }

    return this;
  },

  updateName: function(name) {
    this.getElement('name').text(name);
    return this;
  },

  onClickDelete: function() {
    this.delete();
  },

  onCreateFileClick: function() {
    this.broadcast('fileUploader:trigger');
  },

  onValidationSuccess: function() {
    this.toggleEditMode();
  },

  onNameChange: function(board, name) {
    this.updateName(name);
  }
});

