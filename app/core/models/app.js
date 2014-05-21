module.exports = Zeppelin.Model.extend({
  cacheId: 'App',

  subscriptions: {
    'boards:empty': 'onBoardsEmpty',
    'user:signout': 'onUserSignedOut',
    'board:selected': 'onBoardSelected'
  },

  initialize: function() {
    this.set(this.cache.getAll());
  },

  saveCurrent: function(item, data) {
    this.set(item, data).cache.set(item, data);
    return this;
  },

  removeCurrent: function(item) {
    this.unset(item).cache.clear(item);
    return this;
  },

  onBoardsEmpty: function() {
    this.removeCurrent('board');
  },

  onBoardSelected: function(board) {
    this.saveCurrent('board', board.id);
  },

  onUserSignedOut: function() {
    this.clear();
    this.destroyCache();
  }
});
