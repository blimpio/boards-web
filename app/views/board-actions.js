module.exports = Zeppelin.View.extend({
  name: 'BoardActions',

  className: 'board-actions',

  template: require('templates/board-actions'),

  events: {
    'click [data-action=addCard]': 'onClickAddCard',
    'click [data-action=addNote]': 'onClickAddNote'
  },

  onClickAddCard: function(event) {
    $(event.currentTarget).next('.dropdown-content').toggle();
    return this;
  },

  onClickAddNote: function() {
    this.publish('card:creating');
    return this;
  }
});
