module.exports = Zeppelin.CollectionView.extend({
  tagName: 'ol',

  className: 'accounts-list list-group',

  itemView: require('accounts/views/account'),

  loadingTemplate: require('accounts/templates/loading'),

  collection: function() {
    return App.Accounts;
  },

  _onReset: function () {
    this.removeViews();

    _.forEach(this.collection.getDisplayableAccounts(), function (account) {
      this.addItem(account);
    }, this);

    if (this.isRendered()) this.renderItems();
    return this;
  }
});

