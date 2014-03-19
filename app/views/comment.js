module.exports = Zeppelin.View.extend({
  name: 'Comment',

  tagName: 'li',

  className: 'comment',

  template: require('templates/comment'),

  events: {
    'click [data-action=edit]': 'onClickEdit'
  },

  elements: {
    preview: 'div.comment-preview',
    editForm: 'form.comment-edit-form'
  },

  bindings: {
    'edited': {
      callback: 'onEdited'
    }
  },

  subscriptions: {
    'comment:editing:cancel': 'hideEditMode'
  },

  update: function() {
    var template = require('templates/comment-preview');
    this.$preview.html(this.renderTemplate(template));
    return this;
  },

  initEditForm: function() {
    this.registerView(_.createView('comment-edit-form', {
      el: this.$editForm,
      form: this.$editForm,
      model: this.model
    }), 'editForm');

    return this;
  },

  onClickEdit: function() {
    if (!this.hasView('editForm')) this.initEditForm();
    this.showEditMode();
    return this;
  },

  showEditMode: function() {
    this.$el.addClass('is-editing');
    this.getView('editForm').focus();
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

  onEdited: function($el, model, changed) {
    if (changed) {
      this.hideEditMode();
      this.update();
    }

    return this;
  }
});
