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
    contentInput: 'textarea[name=content]',
    modifiedNotificationTime: 'span.card-modified-notification-time',
    modifiedNotificationModifier: 'strong.card-modified-notification-modifier'
  },

  bindings: {
    model: {
      'change:content': 'onContentChange',
      'change:date_modified': 'onModified'
    }
  },

  subscriptions: {
    'note:edit': 'toggleEditMode'
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      time_modified: $.timeago(this.model.get('date_modified'))
    });
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
      this.getElement('content').html(_.markdown(content));
    }

    this.changeFromNote = false;
    return this;
  },

  updateModifiedNotification: function(modifier, date) {
    date = $.timeago(date || this.model.get('date_modified'));
    modifier = modifier || this.model.get('modified_by').username;

    this.getElement('modifiedNotificationModifier').text(modifier);
    this.getElement('modifiedNotificationTime').text(date);
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
    var $task = $(event.currentTarget);
    this.changeFromNote = true;
    this.model.updateTask(_.parseInt($task.attr('data-index')), $task.prop('checked'));
  },

  onModified: function(note, date_modified) {
    this.updateModifiedNotification(this.model.get('modified_by').username, date_modified);
  }
});

