module.exports = Zeppelin.Collection.extend({
  url: '/api/accounts/',

  model: require('core/models/account'),

  subscriptions: {
    'accounts:current': 'sendCurrent',
    'user:signin:success': 'populateAccountsFromUser'
  },

  sendCurrent: function(channel) {
    this.broadcast(channel, this.current);
  },

  populateAccountsFromUser: function(user) {
    if (user.accounts) this.reset(user.accounts);
  }
});
