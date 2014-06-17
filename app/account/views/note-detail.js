module.exports = Zeppelin.FormView.extend({
  className: function() {
    var className = 'card is-detail note-editor';
    if (this.model.get('featured')) className += ' is-featured';
    return className;
  },

  formSelector: 'edit-note-form',

  attributes: {
    'data-type': 'note'
  },

  events: {
    'keydown [name=content]': 'onKeydown',
    'click [data-action=cancel]': 'toggleEditMode',
    'click [data-action=submit]': 'submit',
    'click [data-action=modify]': 'closePreview',
    'click [data-action=preview]': 'onClickPreview',
    'click div.markdown input[type=checkbox]': 'onNoteTaskChange'
  },

  elements: {
    content: 'div.card-content',
    preview: 'div.note-editor-preview',
    nameInput: 'input[name=name]',
    contentInput: 'textarea[name=content]'
  },

  bindings: {
    model: {
      'change:content': 'onContentChange'
    }
  },

  subscriptions: {
    'note:edit': 'toggleEditMode'
  },

  template: require('account/templates/note-detail'),

  changeFromNote: false,

  toggleEditMode: function() {
    this.$el.toggleClass('is-editing');

    if (this.$el.is('.is-editing')) {
      this.getElement('nameInput')[0].select();
    } else {
      this.reset();
    }

    return this;
  },

  updateContent: function(content) {
    var $input = this.getElement('contentInput'),
        inputVal = $input.val();

    if ($input.is(':focus')) {
      $input.on('blur.contentUpdated', function() {
        $input.off('blur.contentUpdated');
        if (content !== inputVal &&
        this.model.previous('content') === inputVal) $input.val(content);
      });
    } else {
      $input.val(content);
    }

    if (!this.changeFromNote) {
      this.changeFromNote = false;
      this.getElement('content').html(_.markdown(content));
    }

    return this;
  },

  preview: function() {
    this.$el.addClass('is-previewing');
    this.getElement('preview').html(_.markdown(this.getAttributeValue('content')));
    return this;
  },

  closePreview: function() {
    this.$el.removeClass('is-previewing');
    this.focus();
    return this;
  },

  onKeydown: function(event) {
    if (event.keyCode === 9) {
      event.preventDefault();
      _.insertAtCursor(event.currentTarget, '    ');
    }
  },

  onClickPreview: function(event) {
    event.preventDefault();
    this.preview();
  },

  onValidationSuccess: function() {
    this.closePreview();
    this.toggleEditMode();
  },

  onContentChange: function(note, content) {
    this.updateContent(content);
  },

  onNoteTaskChange: function(event) {
    var $task = $(event.currentTarget),
        taskUpdatedText = '',
        taskOriginalText = $task.attr('data-original-text');

    this.changeFromNote = true;
    taskUpdatedText = this.model.updateTask(taskOriginalText);
    $task.attr('data-original-text', taskUpdatedText);
  }
});

