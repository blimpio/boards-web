module.exports = Zeppelin.Model.extend({
  cacheId: 'App',

  subscriptions: {
    'board:selected': 'onBoardSelected'
  },

  initialize: function() {
    this.set(this.cache.getAll());
  },

  saveCurrent: function(item, data) {
    this.set(item, data).cache.set(item, data);
    return this;
  },

  onBoardSelected: function(board) {
    this.saveCurrent('board', board.id);
  }
});
