module.exports = Z.Layout.extend({
  el: '#account-page-content',

  regions: {
    cards: require('account/regions/cards-list'),
    header: require('account/regions/content-header'),
    detail: require('account/regions/card-detail'),
    detailInfo: require('account/regions/card-detail-info'),
    createNote: require('account/regions/create-note'),
    fileUploader: require('account/regions/file-uploader')
  },

  events: {
    'click [data-action=createFirstFile]': 'onCreateFirstFileClick',
    'click [data-action=createFirstNote]': 'onCreateFirstNoteClick'
  },

  elements: {
    cardDetail: '#card-detail-container'
  },

  toggleLoadingContentState: function() {
    this.$el.removeClass('is-empty');
    this.$el.toggleClass('is-loading');
    return this;
  },

  toggleEmptyCardsState: function(hasNoCards, canEdit) {
    this.$el.removeClass('is-loading');
    this.$el.toggleClass('can-edit', canEdit);
    this.$el.toggleClass('is-empty', hasNoCards);
    return this;
  },

  showCards: function(options) {
    if (this.getRegion('detail').isShown()) {
      this.closeCard();
    } else {
      this.showFileUploader({
        board: options.board.attributes
      });

      this.showCreateNoteModal({
        board: options.board.attributes
      });

      this.toggleLoadingContentState();
    }

    this.getRegion('header').showBoard(options.canEdit, {
      model: options.board
    });

    this.getRegion('cards').$el.show();

    if (this.getRegion('cards').isShown() && !options.forceShow) {
      if (options.triggerLayout) this.getRegion('cards').view.triggerLayout();
    } else {
      this.getRegion('cards').showList(options.canEdit);
    }

    return this;
  },

  closeCards: function() {
    this.closeCard();
    this.getRegion('cards').$el.hide();
    this.getRegion('header').close();
    this.$el.removeClass('is-empty is-loading');
  },

  showCard: function(options) {
    if (this.getRegion('cards').isShown()) {
      this.getRegion('cards').$el.hide();
    }

    this.getElement('cardDetail').show();

    this.getRegion('header').showCard(options.canEdit, {
      model: options.card,
      boardUrl: options.board.getUrl(),
      boardName: options.board.get('name'),
      boardAvatar: options.board.getAvatar()
    });

    this.getRegion('detail').showDetail(options.card);

    this.getRegion('detailInfo').showDetailInfo({
      card: options.card,
      canEdit: options.canEdit
    });

    this.getRegion('fileUploader').disable();

    return this;
  },

  closeCard: function() {
    this.closeRegion('detail');
    this.closeRegion('detailInfo');
    this.getElement('cardDetail').hide();
    this.getRegion('fileUploader').enable();
    return this;
  },

  showFileUploader: function(options) {
    this.getRegion('fileUploader').showUploader(options);
    return this;
  },

  showCreateNoteModal: function(options) {
    this.getRegion('createNote').showModal(options);
    return this;
  },

  onCreateFirstFileClick: function() {
    this.broadcast('fileUploader:trigger');
  },

  onCreateFirstNoteClick: function() {
    $('#create-note-modal').modal('show');
  }
});
