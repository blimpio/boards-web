module.exports = Zeppelin.View.extend({
  name: 'StackActions',

  className: 'stack-actions',

  template: require('templates/stack-actions'),

  events: {
    'click [data-action=delete]': 'onClickDelete',
    'click [data-action=unstack]': 'onClickUnstack'
  },

  onClickDelete: function() {
    this.trigger('stack:delete');
    return this;
  },

  onClickUnstack: function() {
    this.trigger('stack:unstack');
    return this;
  }
});
