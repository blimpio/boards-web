module.exports = Zeppelin.View.extend({
  name: 'CardController',

  el: '#application',

  template: require('templates/account-main'),

  views: {
    header: require('views/header'),
    allBoards: require('views/boards-list'),
    cardsList: require('views/cards-list'),
    currentBoard: {
      view: require('views/board'),
      data: {
        canEdit: true,
        isDetail: true
      }
    },
    currentCard: {
      view: require('views/card'),
      data: {
        canEdit: true,
        isDetail: true
      }
    }
  },

  initialize: function(options) {
    _.bindAll(this, ['renderCurrentBoard', 'renderCurrentCard']);
    this.cardSlug = options ? options.cardSlug : '';
    this.boardSlug = options ? options.boardSlug : '';
    this.fetchBoards();
    return this;
  },

  fetchBoards: function() {
    if (!App.Boards.length) {
      App.Boards.fetch({
        data: {
          account: App.Cache.get('current_account')
        },

        reset: true
      }).done(this.renderCurrentBoard);
    } else {
      this.renderCurrentBoard();
    }

    return this;
  },

  fetchCards: function(board) {
    if (App.Cards.isEmpty() || !App.Cards.hasCardsFromBoard(board.id)) {
      App.Cards.fetch({
        data: {
          slug: this.cardSlug,
          board: board.id
        },

        remove: false
      }).done(this.renderCurrentCard);
    } else {
      this.renderCurrentCard();
    }

    return this;
  },

  renderCurrentBoard: function() {
    var board;

    App.Boards.setCurrent(this.boardSlug);
    board = App.Boards.getCurrent();

    if (!board) {
      this.$el.html('Board not Found...');
      return this;
    }

    this.fetchCards(board);

    this.getView('allBoards')
      .selectBoard(board);

    this.getView('currentBoard')
      .setModel(board)
      .insert('div.sub-header-content')
      .initEditForm()
      .initActions();

    return this;
  },

  renderCurrentCard: function() {
    var card;

    App.Cards.setCurrent(this.cardSlug);
    card = App.Cards.getCurrent();

    if (!card) {
      this.$el.html('Card not Found...');
      return this;
    }

    this.getView('currentCard')
      .setModel(card)
      .insert('div.cards')
      .initActions();
  }
});
