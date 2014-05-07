module.exports = Zeppelin.Collection.extend({
  url: App.API_URL + '/accounts/',

  model: require('core/models/account'),

  subscriptions: {
    'accounts:current': 'sendCurrent'
  },

  setCurrent: function(slug) {
    this.current = _.first(this.where({slug: slug}));
    return this;
  },

  sendCurrent: function(channel) {
    this.broadcast(channel, this.current);
  },

  getUnselectedAccounts: function() {
    var accounts = [];

    this.each(function(account) {
      if (this.current.id !== account.id) accounts.push(account.toJSON());
    }, this);

    return accounts;
  },

  hasTeamAccounts: function() {
    return this.filter(function(account) {
      return account.get('type') !== 'personal';
    }).length > 0;
  },

  getCurrentAccount: function() {
    var current = this.current;

    if (current.get('type') === 'personal' &&
    current.get('created_by') !== App.User.id) {
      current = this.getPersonalAccount();
    }

    return current;
  },

  getPersonalAccount: function() {
    return this.find(function(account) {
      return account.get('type') === 'personal' &&
      account.get('created_by') === App.User.id;
    });
  },

  getDisplayableAccounts: function() {
    return this.filter(function(account) {
      return account.id === this.getPersonalAccount().id ||
      account.get('type') !== 'personal';
    }, this);
  }
});
