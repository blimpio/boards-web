module.exports = Zeppelin.Collection.extend({
  url: APPLICATION_HTTP_URL + '/api/boards/',

  name: 'Boards',

  model: require('models/board'),

  subscriptions: {
    'board:selected': 'onBoardSelected'
  },

  setCurrent: function(slug) {
    this.current = slug ? this.findWhere({slug: slug}) : this.first();
    this.current = this.current && this.current.id ? this.current.id : null;
    App.Cache.set('current_board', this.current).saveCache();
    return this;
  },

  currentBoard: function() {
    return this.current ? this.get(this.current) : null;
  },

  onBoardSelected: function(board) {
    this.setCurrent(board.get('slug'));
  }
});
