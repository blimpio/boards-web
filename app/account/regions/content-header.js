module.exports = Z.Region.extend({
  el: '#account-page-header',

  showBoard: function(canEdit, options) {
    var BoardDetail = canEdit
      ? require('account/views/board-detail')
      : require('public-board/views/board-detail');

    this.setView(BoardDetail, options || {}).show();
  },

  showCard: function(canEdit, options) {
    var CardDetailActions = canEdit
      ? require('account/views/card-detail-actions')
      : require('public-board/views/card-detail-actions');

    this.setView(CardDetailActions, options || {}).show();
  }
});
