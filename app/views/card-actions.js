module.exports = Zeppelin.View.extend({
  name: 'CardActions',

  className: 'card-actions',

  template: require('templates/card-actions'),

  events: {
    'click [data-action=edit]': 'onClickEdit',
    'click [data-action=delete]': 'onClickDelete'
  },

  onClickEdit: function() {
    this.publish('card:editing');
    return this;
  },

  onClickCancel: function() {
    this.publish('card:editing:cancel');
    return this;
  },

  onClickDelete: function() {
    this.publish('card:delete');
    return this;
  }
});
