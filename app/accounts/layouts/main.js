module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('accounts/templates/layout'),

  regions: {
    accountsList: require('accounts/regions/accounts-list')
  }
});
