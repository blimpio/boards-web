module.exports = Zeppelin.View.extend({
  name: 'Board',

  tagName: function() {
    if (this.isDetail) {
      return 'div';
    } else {
      return 'li';
    }
  },

  className: function() {
    var className = 'board';
    className += this.isDetail ? ' is-detail' : ' is-item';
    if (this.canEdit) className += ' can-edit';
    return className;
  },

  template: require('templates/board'),

  events: {
    'click': 'onClick',
    'click [data-action=edit]': 'onClickEdit',
    'click [data-action=delete]': 'onClickDelete'
  },

  elements: {
    'preview': 'div.board-preview',
    'editForm': 'form.board-edit-form'
  },

  bindings: {
    'model edited': 'onEdited'
  },

  model: require('models/board'),

  isDetail: false,

  canEdit: false,

  context: function() {
    return this.model.getPresenters(['name', 'thumbnail_sm_path']);
  },

  update: function() {
    var template = require('templates/board-preview');
    this.$preview.html(this.renderTemplate(template));
    return this;
  },

  initActions: function() {
    this.addChild(_.createView('board-actions'), 'actions')
      .insert('div.sub-header-actions');

    return this;
  },

  select: function() {
    this.$el.siblings('.board.is-selected').removeClass('is-selected');
    this.$el.addClass('is-selected');
    App.Boards.setCurrent(this.model.get('slug'));
    return this;
  },

  onClick: function() {
    if (!this.isDetail) this.publish('board:selected', this.model);
    return this;
  },

  initEditForm: function() {
    this.addChild(_.createView('board-edit-form', {
      el: this.$editForm,
      model: this.model
    }), 'editForm').setForm();

    return this;
  },

  onClickEdit: function() {
    if (!this.canEdit) return this;
    if (!this.children.editForm) this.initEditForm();
    this.showEditMode();
    return this;
  },

  showEditMode: function() {
    this.$el.addClass('is-editing');
    this.children.editForm.focus();
    return this;
  },

  onClickCancel: function() {
    if (!this.canEdit) return this;
    if (!this.children.editForm) this.initEditForm();
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

  onClickDelete: function() {
    this.model.destroy();
    this.publish('board:selected', App.Boards.first());
  }
});
