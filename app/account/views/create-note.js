module.exports = Zeppelin.FormView.extend({
  className: 'create-note note-editor',

  formSelector: 'form.note-editor-form',

  template: require('account/templates/note-editor'),

  model: require('core/models/card'),

  events: {
    'keydown [name=content]': 'onKeydown',
    'click [data-action=cancel]': 'close',
    'click [data-action=submit]': 'submit',
    'click [data-action=modify]': 'closePreview',
    'click [data-action=preview]': 'onClickPreview'
  },

  elements: {
    preview: 'div.note-editor-preview'
  },

  initialize: function() {
    $('#create-note-modal').on('hide.bs.modal', _.bind(function() {
      this.closePreview();
      this.reset();
    }, this));

    this.prepareModel();
  },

  prepareModel: function() {
    this.setModel(require('core/models/note'));
    this.model.set('board', this.options.board.id);
    return this;
  },

  close: function() {
    this.closePreview();
    this.reset();
    $('#create-note-modal').modal('hide');
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
    this.broadcast('card:created', this.model);
  },

  onSubmit: function() {
    this.prepareModel();
    this.close();
  },

  onValidationError: function() {
    this.closePreview();
  },

  onUnplug: function() {
    $('#create-note-modal').off('hide.bs.modal');
  }
});

