module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('public-board/templates/layout'),

  currentAccountTemplate: require('public-board/templates/current-account'),

  regions: {
    userDropdown: require('core/regions/user-dropdown')
  },

  elements: {
    page: 'div.account-page',
    account: 'div.current-account',
    content: 'div.account-page-content-wrapper'
  },

  toggleLoadingMainState: function() {
    this.getElement('page').toggleClass('is-loading');
    return this;
  },

  toggleLoadingContentState: function() {
    this.getElement('content').toggleClass('is-loading');
    return this;
  },

  renderAccount: function(account) {
    this.getElement('account').html(
      this.renderTemplate(this.currentAccountTemplate, account.attributes)
    );

    return this;
  },

  renderHeader: function(account) {
    this.toggleLoadingMainState();
    this.renderAccount(account);
    this.showRegion('userDropdown');
    return this;
  }
});
