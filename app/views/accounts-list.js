module.exports = Zeppelin.View.extend({
  el: 'ol.accounts__list',

  name: 'AccountsList',

  template: require('templates/accounts-list'),

  bindings: {
    'model change:accounts': 'onAccountsChange'
  },

  context: function() {
    return this.model.getPresenters(['accounts']);
  },

  onAccountsChange: function(user, accounts) {
    this.render();
  }
});
