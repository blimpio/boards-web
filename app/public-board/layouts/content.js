module.exports = Z.Layout.extend({
  el: '#account-page-content',

  regions: {
    cards: require('account/regions/cards-list'),
    header: require('account/regions/content-header'),
    detail: require('account/regions/card-detail'),
    detailInfo: require('account/regions/card-detail-info')
  },

  elements: {
    cardDetail: '#card-detail-container'
  },

  toggleLoadingContentState: function() {
    this.$el.toggleClass('is-loading');
    return this;
  },

  toggleEmptyCardsState: function(hasNoCards) {
    this.$el.removeClass('is-loading');
    this.$el.toggleClass('is-empty', hasNoCards);
    return this;
  },

  showCards: function(options) {
    if (this.getRegion('detail').isShown()) {
      this.closeCard();
    } else {
      this.toggleLoadingContentState();
    }

    this.getRegion('header').showBoard(false, {
      model: options.board
    });

    if (this.getRegion('cards').isShown()) {
      this.getRegion('cards').$el.show();
      if (options.triggerLayout) this.getRegion('cards').view.triggerLayout();
    } else {
      this.getRegion('cards').showList(false);
    }

    return this;
  },

  showCard: function(options) {
    if (this.getRegion('cards').isShown()) {
      this.getRegion('cards').$el.hide();
    }

    this.getElement('cardDetail').show();

    this.getRegion('header').showCard(false, {
      model: options.card,
      boardUrl: options.board.getUrl(),
      boardName: options.board.get('name'),
      boardAvatar: options.board.getAvatar()
    });

    this.getRegion('detail').showDetail(options.card);

    this.getRegion('detailInfo').showDetailInfo({
      card: options.card,
      canEdit: false
    });

    return this;
  },

  closeCard: function() {
    this.closeRegion('detail');
    this.closeRegion('detailInfo');
    this.getElement('cardDetail').hide();
    return this;
  }
});
