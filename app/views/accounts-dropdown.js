module.exports = Zeppelin.View.extend({
  el: 'div.accounts-dropdown',

  name: 'AccountsDropdown',

  template: require('templates/accounts-dropdown'),

  collection: App.Accounts,

  events: {
    'click div.accounts-dropdown__current': 'toggle'
  },

  elements: {
    'accountsList': 'ol.accounts-dropdown__list'
  },

  context: function() {
    return this.collection.getPresenters(['accounts', 'currentAccount']);
  },

  toggle: function() {
    this.$accountsList.toggle();
    return this;
  }
});
