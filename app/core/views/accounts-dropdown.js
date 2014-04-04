module.exports = Zeppelin.CollectionView.extend({
  className: 'accounts-dropdown',

  listSelector: 'ol.accounts-dropdown-list',

  template: require('core/templates/accounts-dropdown'),

  itemView: require('core/views/accounts-dropdown-item'),

  manageItems: false,

  collection: function() {
    return App.Accounts;
  },

  context: function() {
    return {
      current: this.collection.current.attributes,
      hasMoreAccounts: this.collection.length > 1
    };
  }
});

