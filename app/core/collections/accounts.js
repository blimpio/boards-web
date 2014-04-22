module.exports = Zeppelin.Collection.extend({
  url: '/api/accounts/',

  model: require('core/models/account'),

  subscriptions: {
    'accounts:current': 'sendCurrent',
    'user:signin:success': 'populateAccountsFromUser'
  },

  parse: function(response) {
    var currentUser;

    this.request('user:id', function(id) {
      currentUser = id;
    });

    return _.filter(response, function(account) {
      if (account.type === 'personal'
      && account.created_by === currentUser) return account;
    }, this);
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
  },

  hasTeamAccounts: function() {
    return this.filter(function(account) {
      return account.get('type') !== 'personal';
    }).length > 0;
  },

  getPersonalAccount: function() {
    return this.find(function(account) {
      return account.get('type') === 'personal';
    });
  }
});
