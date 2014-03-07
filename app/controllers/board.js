module.exports = Zeppelin.View.extend({
  name: 'BoardController',

  template: require('templates/account-main'),

  initialize: function(options) {
    this.boardSlug = options ? options.boardSlug : '';
    _.bindAll(this, ['renderCurrentBoard', 'renderCards']);

    this.insert('#application').initChildren();
    this.fetchBoards();

    return this;
  },

  fetchBoards: function() {
    if (App.Boards.isEmpty()) {
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
          board: board.id
        },

        remove: false
      }).done(this.renderCards);
    } else {
      this.renderCards();
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
    this.addChild(_.createView('cards-list'), 'cardsList');
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

    document.title = 'Blimp | ' + board.get('name');

    this.children.allBoards
      .insert('div.sidebar')
      .selectBoard(board);

    this.children.currentBoard
      .setModel(board, true)
      .insert('div.sub-header-content')
      .initActions();

    this.fetchCards(board);

    return this;
  },

  changeCurrentBoard: function(board) {
    if (!board) return this;

    document.title = 'Blimp | ' + board.get('name');

    App.Boards.setCurrent(board.get('slug'));
    this.fetchCards(board);

    this.children.allBoards
      .selectBoard(board);

    this.children.currentBoard
      .setModel(board, true)
      .render();

    return this;
  },

  renderCards: function() {
    this.children.cardsList.render().filter(function(card) {
      return card.get('board') === App.Cache.get('current_board');
    });
  }
});
