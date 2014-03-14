module.exports = Zeppelin.View.extend({
  name: 'BoardController',

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
    }
  },

  initialize: function(options) {
    _.bindAll(this, ['renderCurrentBoard', 'renderCards']);
    this.boardSlug = options ? options.boardSlug : '';
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

  renderCurrentBoard: function() {
    var board;

    App.Boards.setCurrent(this.boardSlug);
    board = App.Boards.getCurrent();

    if (!board) {
      this.$el.html('Board not Found...');
      return this;
    }

    document.title = 'Blimp | ' + board.get('name');

    this.getView('allBoards')
      .selectBoard(board);

    this.getView('currentBoard')
      .setModel(board)
      .insert('div.sub-header-content')
      .initEditForm()
      .initActions();

    this.fetchCards(board);

    return this;
  },

  changeCurrentBoard: function(board) {
    if (!board) return this;

    document.title = 'Blimp | ' + board.get('name');

    App.Boards.setCurrent(board.get('slug'));
    this.fetchCards(board);

    this.getView('allBoards')
      .selectBoard(board);

    this.getView('currentBoard')
      .setModel(board)
      .render();

    return this;
  },

  renderCards: function() {
    this.getView('cardsList').render(function(card) {
      return card.get('board') === App.Cache.get('current_board');
    });
  }
});
