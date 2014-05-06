module.exports = Z.Region.extend({
  el: 'div.accounts-dropdown-wrapper',

  keepEl: true,

  view: require('core/views/accounts-dropdown'),

  renderView: function(accountsDropdown) {
    this.$el.html(accountsDropdown.renderWithFilter(function(account) {
      return account.id === this.collection.getPersonalAccount().id ||
      account.get('type') !== 'personal';
    }).el);

    return this;
  }
});
