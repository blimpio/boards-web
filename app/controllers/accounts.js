module.exports = Zeppelin.View.extend({
  name: 'AccountsController',

  el: '#application',

  template: require('templates/accounts-main'),

  views: {
    'accounts': require('views/accounts-list')
  },

  initialize: function() {
    document.title = 'Blimp | Accounts';
    return this;
  }
});
