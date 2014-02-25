module.exports = Zeppelin.View.extend({
  name: 'AccountController',

  template: require('templates/account'),

  initialize: function() {
    document.title = 'Blimp | Boards';

    App.Boards.fetch({reset: true}).done(_.bind(this.onBoardsSync, this));
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
    var currentBoard = App.Cache.get('current_board') || App.Boards.currentBoard();

    if (currentBoard && App.Boards.get(currentBoard)) {
      this.publish('board:selected', App.Boards.get(currentBoard));
    } else if (App.Boards.at(0)) {
      this.publish('board:selected', App.Boards.at(0));
    } else {
      return this;
    }

    this.children.boardHeader
      .setModel(App.Boards.currentBoard(), true)
      .render();

    return this;
  }
});
