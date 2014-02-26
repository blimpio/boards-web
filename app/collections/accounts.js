module.exports = Zeppelin.Collection.extend({
  url: '/api/accounts/',

  name: 'Accounts',

  model: require('models/account'),

  presenters: ['accounts'],

  subscriptions: {
    'user:signin:success': 'onUserSignin'
  },

  userHasAccount: function(slug) {
    if (slug) return this.findWhere({slug: slug}) !== undefined;
    return false;
  },

  setCurrent: function(slug) {
    this.current = this.userHasAccount(slug) ? this.findWhere({slug: slug}).id : null;
    App.Cache.set('current_account', this.current).saveCache();
    return this;
  },

  accounts: function() {
    return this.map(function(account) {
      return account.serialize();
    });
  },

  account: function(id) {
    var account = this.get(id);
    if (account) return account.serialize();
    return null;
  },

  currentAccount: function() {
    return this.account(this.current);
  },

  getSlug: function() {
    var account = this.get(this.current);
    return account ? account.get('slug') : '';
  },

  onUserSignin: function(user) {
    if (user.accounts && user.accounts.length) this.reset(user.accounts);
    return this;
  }
});
