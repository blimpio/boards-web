module.exports = Zeppelin.View.extend({
  name: 'BoardController',

  template: require('templates/account-main'),

  initialize: function(options) {
    this.boardSlug = options ? options.boardSlug : '';
    _.bindAll(this, ['renderCurrentBoard', 'renderCards']);

    this.insert('#application').initChildren();
    this.fetchBoards();

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

    this.insert('#application').initChildren();
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

  onBoardsSync: function(boards) {
    var board;

    App.Boards.setCurrent(this.boardSlug);
    board = App.Boards.currentBoard();
    board = board ? board : App.Boards.at(0);

    if (board) {
      this.publish('board:selected', board);
    } else {
      return this;
    }

    document.title = 'Blimp | ' + board.get('name');

    this.children.boardHeader
      .setModel(board, true)
      .render();

    return this;
  }
});
