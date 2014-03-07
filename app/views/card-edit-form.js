module.exports = Zeppelin.FormView.extend({
  name: 'CardEditForm',

  events: {
    'click [data-action=cancel]': 'onClickCancel'
  },

  elements: {
    'nameInput': '[name=name]',
    'contentInput': '[name=content]'
  },

  focus: function() {
    this.$nameInput.select();
    return this;
  },

  reset: function() {
    this.$nameInput.val(this.model.get('name'));
    this.$contentInput.val(this.model.get('content'));
    return this;
  },

  onClickCancel: function() {
    this.publish('card:editing:cancel');
    return this;
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
