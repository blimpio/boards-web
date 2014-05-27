module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('accounts/templates/layout'),

  regions: {
    accounts: require('accounts/regions/accounts-list')
  },

  elements: {
    accounts: 'div.accounts'
  },

  toggleLoadingState: function() {
    this.getElement('accounts').toggleClass('is-loading');
    return this;
  },

  showAccounts: function() {
    this.getRegion('accounts').show();
    return this;
  }
});
