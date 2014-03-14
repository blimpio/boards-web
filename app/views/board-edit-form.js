module.exports = Zeppelin.FormView.extend({
  name: 'BoardEditForm',

  el: 'form.board-edit-form',

  elements: {
    'nameInput': 'input[name=name]'
  },

  events: {
    'click [data-action=cancel]': 'onClickCancel'
  },

  focus: function() {
    this.$nameInput.select();
    return this;
  },

  reset: function() {
    this.$nameInput.val(this.model.get('name'));
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
  },

  onClickCancel: function() {
    console.log(this);
    this.publish('board:editing:cancel');
    return this;
  },
});
