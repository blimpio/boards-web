module.exports = Zeppelin.View.extend({
  name: 'BoardController',

  template: require('templates/account'),

  initialize: function(options) {
    this.boardSlug = options ? options.boardSlug : '';

    App.Boards.fetch({
      data: {
        account: App.Cache.get('current_account')
      },

      reset: true
    }).done(_.bind(this.onBoardsSync, this));

    this.insert('#application').initChildren();
    return this;
  },

  initChildren: function() {
    this.addChild(_.createView('header'), 'header').render();
    this.addChild(_.createView('boards-sidebar'), 'sidebar').render();
    this.addChild(_.createView('board-header-form'), 'boardHeader');
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
