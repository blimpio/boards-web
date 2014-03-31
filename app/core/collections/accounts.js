module.exports = Zeppelin.Collection.extend({
  url: '/api/accounts/',

  model: require('core/models/account'),

  subscriptions: {
    'accounts:current': 'sendCurrent'
  },

  sendCurrent: function(channel) {
    this.broadcast(channel, this.current);
  }
});
