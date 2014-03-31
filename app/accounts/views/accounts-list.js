module.exports = Zeppelin.CollectionView.extend({
  tagName: 'ol',

  className: 'accounts-list list-group',

  itemView: require('accounts/views/account'),

  loadingTemplate: require('accounts/templates/loading'),

  collection: function() {
    return App.Accounts;
  }
});

