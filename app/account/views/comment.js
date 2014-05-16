module.exports = Zeppelin.FormView.extend({
  tagName: 'li',

  className: function() {
    var className = 'comment clearfix';
    if (this.model.isMine()) className += ' is-mine';
    return className;
  },

  formSelector: 'form.comment-edit',

  events: {
    'click [data-action=edit]': 'toggleEditMode',
    'click [data-action=cancel]': 'toggleEditMode',
    'click [data-action=delete]': 'delete'
  },

  template: require('account/templates/comment'),

  context: function() {
    return _.extend({}, this.model.attributes, {
      time: $.timeago(this.model.get('date_created')),
      isMine: this.model.isMine()
    });
  },

  elements: {
    content: 'div.comment-content',
    commentInput: 'textarea.edit-comment-input'
  },

  bindings: {
    model: {
      'change:content': 'onContentChange'
    }
  },

  delete: function() {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      this.model.destroy();
    }
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

  updateContent: function(content) {
    this.getElement('content').html(_.markdown(content));
    return this;
  },

  reset: function() {
    Z.FormView.prototype.reset.apply(this, arguments);
    this.getElement('commentInput').height('auto');
  },

  onRender: function() {
    if (this.model.isMine()) {
      this.getElement('commentInput').autosize();
    }
  },

  onValidationSuccess: function() {
    this.toggleEditMode();
  },

  onContentChange: function(comment, content) {
    this.updateContent(content);
  }
});

