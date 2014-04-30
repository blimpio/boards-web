module.exports = Z.Region.extend({
  el: 'div.cards-list-container',

  showList: function(canEdit) {
    var CardsList = canEdit
      ? require('account/views/cards-list')
      : require('public-board/views/cards-list');

    this.show(CardsList);
    return this;
  }
});
