module.exports = Zeppelin.FormView.extend({
  className: 'board-detail clearfix',

  formSelector: 'form.board-detail-edit',

  template: require('account/templates/board-detail'),

  events: {
    'click [data-action=edit]': 'toggleEditMode',
    'click [data-action=cancel]': 'toggleEditMode',
    'click [data-action=delete]': 'onClickDelete',
    'click [data-action=createFile]': 'onCreateFileClick'
  },

  elements: {
    name: 'strong.board-name',
    nameInput: 'input[name=name]'
  },

  bindings: {
    model: {
      'change:name': 'onNameChange',
      'change:thumbnail_xs_path': 'onThumbnailChange'
    }
  },

  partials: {
    'span.board-thumbnail-partial': require('account/templates/board-preview')
  },

  context: function() {
    return this.model.attributes;
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
    var $input = this.getElement('nameInput');

    if ($input.is(':focus')) {
      $input.on('blur.nameUpdated', function() {
        $input.off('blur.nameUpdated');
        if (name !== $input.val() &&
        this.model.previous('name') === inputVal)  $input.val(name);
      });
    } else {
      $input.val(name);
    }

    this.getElement('name').text(name);
    return this;
  },

  updateThumbnail: function(thumbnail) {
    this.renderPartial('span.board-thumbnail-partial', {
      color: this.model.get('color'),
      thumbnail_xs_path: thumbnail
    });
  },

  onClickDelete: function() {
    this.delete();
  },

  onCreateFileClick: function(event) {
    event.preventDefault();
    this.broadcast('fileUploader:trigger');
  },

  onValidationSuccess: function() {
    this.toggleEditMode();
  },

  onNameChange: function(board, name) {
    this.updateName(name);
  },

  onThumbnailChange: function(board, thumbnail) {
    this.updateThumbnail(thumbnail);
  }
});

