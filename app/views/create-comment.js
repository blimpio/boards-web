module.exports = Zeppelin.FormView.extend({
  name: 'CreateComment',

  el: 'form.create-comment',

  model: require('models/comment'),

  template: require('templates/create-comment'),

  events: {
    'click [data-action=cancel]': 'onClickCancel'
  },

  elements: {
    'contentInput': '[name=content]'
  },

  initialize: function() {
    this.prepareModel();
  },

  prepareModel: function() {
    this.model.set({
      'card': App.Cache.get('current_card')
    });

    return this;
  },

  onClickCancel: function() {
    this.reset().publish('comment:creating:cancel');
    return this;
  },

  reset: function() {
    this.$contentInput.val('');
    return this;
  },

  onSubmit: function(event) {
    event.preventDefault();

    this.setAttributes();

    if (!this.model.validationError) {
      this.model.save();

      this.reset()
        .publish('new:comment', this.model)
        .setModel(_.createModel('comment'))
        .prepareModel();
    }

    return this;
  }
});
