module.exports = Zeppelin.FormView.extend({
  name: 'CreateBoard',

  el: 'form.create-board',

  model: require('models/board'),

  template: require('templates/create-board'),

  events: {
    'click [data-action=cancel]': 'hide'
  },

  elements: {
    'nameInput': '[name=name]'
  },

  initialize: function() {
    this.model.set('account', App.Cache.get('current_account'));
  },

  onSubmit: function(event) {
    event.preventDefault();

    this.setAttributes();

    if (!this.model.validationError) {
      this.hide().trigger('new:board', this.model);
      this.model.save();
      this.setModel(_.createModel('board', {
        account: App.Cache.get('current_account')
      }));
    }
  },

  hide: function() {
    this.reset().$el.hide();
    return this;
  },

  reset: function() {
    this.$nameInput.val('');
    return this;
  }
});
