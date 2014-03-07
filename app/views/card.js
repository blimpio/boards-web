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

  template: require('templates/card'),

  model: require('models/card'),

  elements: {
    'preview': 'div.card-preview',
    'editForm': 'form.card-edit-form'
  },

  bindings: {
    'model edited': 'onEdited'
  },

  subscriptions: {
    'card:editing': 'onClickEdit',
    'card:editing:cancel': 'onClickCancel',
    'card:delete': 'onClickDelete'
  },

  isDetail: false,

  canEdit: false,

  context: function() {
    return _.extend({}, this.model.getPresenters(['name', 'content']), {
      isDetail: this.isDetail
    });
  },

  update: function() {
    var template = require('templates/card-preview');
    this.$preview.html(this.renderTemplate(template));
    return this;
  },

  initActions: function() {
    this.addChild(_.createView('card-actions'), 'actions')
      .insert('div.sub-header-actions');

    return this;
  },

  onClick: function() {
    if (!this.isDetail) this.publish('card:selected', this.model);
    return this;
  },

  initEditForm: function() {
    this.addChild(_.createView('card-edit-form', {
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
    var board = this.model.get('board');
    this.model.destroy();
    this.publish('board:selected', App.Boards.get(board));
  }
});
