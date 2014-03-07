module.exports = Zeppelin.FormView.extend({
  name: 'BoardEditForm',

  elements: {
    'nameInput': 'input[name=name]'
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
  }
});
