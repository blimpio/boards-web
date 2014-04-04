module.exports = Z.Region.extend({
  el: 'div.accounts-dropdown-wrapper',

  view: require('core/views/accounts-dropdown'),

  renderView: function(accountsDropdown) {
    this.$el.html(accountsDropdown.renderWithFilter(function(account) {
      return account.id !== accountsDropdown.collection.current.id;
    }).el);

    return this;
  }
});
