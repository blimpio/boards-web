module.exports = Z.Layout.extend({
  el: 'div.content',

  regions: {
    cardsList: require('account/regions/cards-list'),
    cardDetail: require('account/regions/card-detail'),
    contentHeader: require('account/regions/content-header'),
    cardDetailInfo: require('account/regions/card-detail-info')
  },

  events: {
    'click [data-action=createFirstFile]': 'onCreateFirstFileClick',
    'click [data-action=createFirstNote]': 'onCreateFirstNoteClick'
  },

  elements: {
    cardsWrapper: 'div.cards-wrapper'
  },

  setHeight: function() {
    this.$el.height($(document).height() - 52);
    return this;
  },

  toggleLoadingCardsState: function() {
    this.getElement('cardsWrapper').toggleClass('is-loading');
    return this;
  },

  toggleEmptyCardsState: function(hasCards) {
    this.getElement('cardsWrapper').removeClass('is-loading');
    this.getElement('cardsWrapper').toggleClass('has-no-cards', hasCards);
    return this;
  },

  showBoardDetail: function(board, canEdit) {
    var BoardDetail = canEdit
      ? require('account/views/board-detail')
      : require('public-board/views/board-detail');

    this.getRegion('contentHeader').setView(BoardDetail, {model: board}).show();
    return this;
  },

  closeBoardDetail: function() {
    this.closeRegion('cardsList');
    this.closeRegion('contentHeader');
    this.getElement('cardsWrapper').removeClass('has-no-cards');
    return this;
  },

  onCreateFirstFileClick: function() {
    this.broadcast('fileUploader:trigger');
  },

  onCreateFirstNoteClick: function() {
    $('#createNoteModal').modal('show');
  },

  showCards: function(canEdit) {
    this.closeCardDetail();

    if (!this.getRegion('cardsList').isShown()) {
      this.getRegion('cardsList').showList(canEdit);
    } else {
      this.getRegion('cardsList').view.$el.show();
    }

    return this;
  },

  showCardDetail: function(card, board, creator, canEdit) {
    var CardDetailInfo = canEdit
      ? require('account/views/card-detail-info')
      : require('public-board/views/card-detail-info'),

        CardDetailActions = canEdit
          ? require('account/views/card-detail-actions')
          : require('public-board/views/card-detail-actions');

    if (this.getRegion('cardsList').isShown()) {
      this.getRegion('cardsList').view.$el.hide();
    }

    this.getRegion('contentHeader').setView(CardDetailActions, {
      model: card,
      boardUrl: board.getUrl(),
      boardName: board.get('name')
    }).show();

    this.getRegion('cardDetail').showDetail(card);

    this.getRegion('cardDetailInfo').setView(CardDetailInfo, {
      model: card,
      creator: creator
    }).show();

    return this;
  },

  closeCardDetail: function() {
    this.closeRegion('cardDetail');
    this.closeRegion('cardDetailInfo');
    return this;
  },

  cardDetailIsShow: function() {
    return this.getRegion('cardDetail').isShown();
  }
});
