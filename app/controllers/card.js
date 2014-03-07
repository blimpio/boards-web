module.exports = Zeppelin.View.extend({
  name: 'CardController',

  template: require('templates/account-main'),

  initialize: function(options) {
    this.cardSlug = options ? options.cardSlug : '';
    this.boardSlug = options ? options.boardSlug : '';

    _.bindAll(this, ['renderCurrentBoard', 'renderCurrentCard']);

    this.insert('#application').initChildren();
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

  initChildren: function() {
    this.addChild(_.createView('header'), 'header').render();

    this.addChild(_.createView('boards-list'), 'allBoards');
    this.addChild(_.createView('board', {
      canEdit: true,
      isDetail: true
    }), 'currentBoard');

    this.addChild(_.createView('card', {
      canEdit: true,
      isDetail: true
    }), 'card');
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

    this.children.allBoards
      .insert('div.sidebar')
      .selectBoard(board);

    this.children.currentBoard
      .setModel(board, true)
      .insert('div.sub-header-content');

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

    this.children.card
      .setModel(card, true)
      .insert('div.cards')
      .initActions();
  }
});
