module.exports = Zeppelin.Collection.extend({
  url: '/api/accounts/',

  model: require('core/models/account'),

  subscriptions: {
    'accounts:current': 'sendCurrent',
    'user:signin:success': 'populateAccountsFromUser'
  },

  setCurrent: function(slug) {
    this.current = _.first(this.where({slug: slug}));
    return this;
  },

  sendCurrent: function(channel) {
    this.broadcast(channel, this.current);
  },

  populateAccountsFromUser: function(user) {
    if (user.accounts) this.reset(user.accounts);
  },

  getUnselectedAccounts: function() {
    var accounts = [];

    this.each(function(account) {
      if (this.current.id !== account.id) accounts.push(account.toJSON());
    }, this);

    return accounts;
  }
});
