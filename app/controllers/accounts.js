module.exports = Zeppelin.View.extend({
  name: 'AccountsController',

  template: require('templates/accounts'),

  subscriptions: {
    'user:accounts:fetched': 'onAccountsFetch'
  },

  initialize: function() {
    document.title = 'Blimp | Accounts';

    this.user = Boards.getUser();
    this.user.fetchCache();

    if (!this.user.isSignedIn()) {
      this.publish('router:navigate', 'signin');
    } else {
      this.user.fetchAccounts();
      this.insert('#application');
    }
  },

  initList: function() {
    return this.addChild(require('views/accounts-list'), {model: this.user});
  },

  onAccountsFetch: function(accounts) {
    if (accounts.length > 1) {
      this.initList().render();
    } else {
      this.publish('router:navigate', 'boards');
    }
  }
});
