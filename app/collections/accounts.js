module.exports = Zeppelin.Collection.extend({
  url: APPLICATION_HTTP_URL + '/api/accounts/',

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

  onUserSignin: function(user) {
    if (user.accounts && user.accounts.length) this.reset(user.accounts);
    return this;
  }
});
