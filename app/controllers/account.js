module.exports = Zeppelin.View.extend({
  name: 'AccountController',

  el: '#application',

  template: require('templates/account-main'),

  views: {
    header: require('views/header'),
    allBoards: require('views/boards-list')
  },

  initialize: function() {
    _.bindAll(this, 'onBoardsSync');
    this.setDocumentTitle();
    this.fetchBoards();
    return this;
  },

  setDocumentTitle: function() {
    var account = App.Accounts.getCurrent();
    if (account) document.title = 'Blimp | ' + account.get('name');
    return this;
  },

  fetchBoards: function() {
    if (App.Boards.isEmpty()) {
      App.Boards.fetch({
        data: {
          account: App.Cache.get('current_account')
        },

        reset: true
      }).done(this.onBoardsSync);
    } else {
      this.onBoardsSync();
    }

    return this;
  },

  onBoardsSync: function() {
    this.getView('allBoards').render();
    return this;
  }
});
