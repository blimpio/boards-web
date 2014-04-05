var BoardDetail = require('account/views/board-detail'),
    CardDetailInfo = require('public-board/views/card-detail-info'),
    CardDetailActions = require('public-board/views/card-detail-actions');

module.exports = Z.Layout.extend({
  el: 'div.content',

  regions: {
    cardsList: require('public-board/regions/cards-list'),
    cardDetail: require('account/regions/card-detail'),
    contentHeader: require('account/regions/content-header'),
    cardDetailInfo: require('account/regions/card-detail-info')
  },

  elements: {
    cardsWrapper: 'div.cards-wrapper',
    contentHeader: 'div.content-header'
  },

  boardDetailTemplate: require('public-board/templates/board-detail'),

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

  renderBoardDetail: function(board) {
    this.getElement('contentHeader').html(
      this.renderTemplate(this.boardDetailTemplate, board.attributes)
    );

    return this;
  },

  closeBoardDetail: function() {
    this.getRegion('cardsList').close();
    this.getRegion('contentHeader').close();
    this.getElement('cardsWrapper').removeClass('has-no-cards');
    return this;
  },

  showCards: function() {
    this.closeCardDetail();

    if (!this.getRegion('cardsList').isShown()) {
      this.getRegion('cardsList').show();
    } else {
      this.getRegion('cardsList').view.$el.show();
    }

    return this;
  },

  showCardDetail: function(card, board, creator) {
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
    this.getRegion('cardDetail').close();
    this.getRegion('cardDetailInfo').close();
    return this;
  },

  cardDetailIsShow: function() {
    return this.getRegion('cardDetail').isShown();
  }
});
