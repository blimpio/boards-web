module.exports = Z.Layout.extend({
  el: 'div.header',

  keepEl: true,

  template: require('core/templates/header'),

  regions: {
    userDropdown: require('core/regions/user-dropdown'),
    accountsDropdown: require('core/regions/accounts-dropdown')
  },

  events: {
    'click a.navigation-item-link': 'onNavigationClick'
  },

  elements: {
    'navigationLinks': 'a.navigation-item-link'
  },

  onNavigationClick: function(event) {
    this.getElement('navigationLinks').removeClass('is-selected');
    $(event.currentTarget).addClass('is-selected');
  }
});
