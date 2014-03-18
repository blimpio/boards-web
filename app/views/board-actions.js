module.exports = Zeppelin.View.extend({
  name: 'BoardActions',

  className: 'board-actions',

  template: require('templates/board-actions'),

  events: {
    'click [data-action=addCard]': 'onClickAddCard',
    'click [data-action=addNote]': 'onClickAddNote',
    'click [data-action=addFile]': 'onClickAddFile'
  },

  elements: {
    'cardTypesDropdown': 'div.dropdown-content.card-types'
  },

  onClickAddCard: function(event) {
    this.$cardTypesDropdown.toggle();
    return this;
  },

  onClickAddNote: function() {
    this.$cardTypesDropdown.hide();
    this.publish('card:creating', 'card');
    return this;
  },

  onClickAddFile: function() {
    this.$cardTypesDropdown.hide();
    this.publish('card:creating', 'file');
    return this;
  }
});
