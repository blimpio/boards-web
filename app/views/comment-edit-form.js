module.exports = Zeppelin.FormView.extend({
  name: 'CommentEditForm',

  events: {
    'click [data-action=cancel]': 'onClickCancel',
    'click [data-action=delete]': 'onClickDelete'
  },

  elements: {
    'contentInput': '[name=content]'
  },

  focus: function() {
    this.$contentInput.select();
    return this;
  },

  reset: function() {
    this.$contentInput.val(this.model.get('content'));
    return this;
  },

  onClickCancel: function() {
    this.publish('comment:editing:cancel');
    return this;
  },

  onClickDelete: function() {
    this.model.destroy();
  },

  onSubmit: function(event) {
    event.preventDefault();
    this.setAttributes();

    if (!this.model.validationError) {
      this.reset().model
        .trigger('edited', this.model, this.model.changedAttributes())
        .save();
    }

    return this;
  }
});
