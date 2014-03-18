module.exports = Zeppelin.View.extend({
  el: 'div.accounts-dropdown',

  name: 'AccountsDropdown',

  template: require('templates/accounts-dropdown'),

  collection: App.Accounts,

  context: function() {
    return this.collection.getPresenters(['accounts', 'currentAccount']);
  }
});
