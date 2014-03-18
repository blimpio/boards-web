module.exports = Zeppelin.View.extend({
  name: 'Card',

  tagName: function() {
    if (this.isDetail) {
      return 'div';
    } else {
      return 'li';
    }
  },

  className: function() {
    var className = 'card';
    className += this.isDetail ? ' is-detail' : ' is-item';
    if (this.canEdit) className += ' can-edit';
    return className;
  },

  attributes: function() {
    return {
      'data-type': this.model.get('type')
    };
  },

  events: {
    'click': 'onClick'
  },

  model: require('models/card'),

  elements: {
    'preview': 'div.card-preview',
    'editForm': 'form.card-edit-form'
  },

  bindings: {
    'edited': {
      callback: 'onEdited'
    },

    'change:upload_progress': {
      element: 'span.card-upload-progress',
      callback: 'onUploadProgress'
    }
  },

  subscriptions: {
    'card:editing': 'onClickEdit',
    'card:editing:cancel': 'onClickCancel',
    'card:delete': 'onClickDelete'
  },

  isDetail: false,

  canEdit: false,

  context: function() {
    return _.extend({}, this.model.getPresenters(), {
      isDetail: this.isDetail
    });
  },

  initialize: function() {
    this.setTemplate();
  },

  onRender: function() {
    if (this.isDetail) this.$el.attr('data-type', this.model.get('type'));
    return this;
  },

  setTemplate: function() {
    if (this.model.isNote()) {
      this.template = require('templates/card-note');
    } else if (this.model.isFile()) {
      this.template = require('templates/card-file');
    }

    return this;
  },

  update: function() {
    var template = require('templates/card-note-preview');
    this.$preview.html(this.renderTemplate(template));
    return this;
  },

  initActions: function() {
    this.registerView(_.createView('card-actions'), 'actions');
    this.getView('actions').insert('div.sub-header-actions');
    return this;
  },

  onClick: function() {
    if (!this.isDetail && !this.model.isNew()) {
      this.publish('card:selected', this.model);
    }

    return this;
  },

  initEditForm: function() {
    this.registerView(_.createView('card-edit-form', {
      el: this.$editForm,
      form: this.$editForm,
      model: this.model
    }), 'editForm');

    return this;
  },

  onClickEdit: function() {
    if (!this.canEdit) return this;
    if (!this.hasView('editForm')) this.initEditForm();
    this.showEditMode();
    return this;
  },

  showEditMode: function() {
    this.$el.addClass('is-editing');
    this.getView('editForm').focus();
    return this;
  },

  onClickCancel: function() {
    if (!this.canEdit) return this;
    if (!this.hasView('editForm')) this.initEditForm();
    this.hideEditMode();
  },

  hideEditMode: function() {
    this.$el.removeClass('is-editing');
    return this;
  },

  onEdited: function(model, changed) {
    if (changed) {
      this.hideEditMode();
      this.update();
    }

    return this;
  },

  onUploadProgress: function($el, model, progress) {
    $el.text(progress + '%');
    if (progress === 100) $el.hide();
    return this;
  },

  onClickDelete: function() {
    var board = this.model.get('board');
    this.model.destroy();
    this.publish('board:selected', App.Boards.get(board));
  }
});
