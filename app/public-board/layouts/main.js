module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('public-board/templates/layout'),

  currentAccountTemplate: require('public-board/templates/current-account'),

  regions: {
    userDropdown: require('core/regions/user-dropdown')
  },

  elements: {
    accountPage: 'div.account-page',
    currentAccount: 'div.current-account',
    contentWrapper: 'div.content-wrapper'
  },

  toggleLoadingMainState: function() {
    this.getElement('accountPage').toggleClass('is-loading');
    return this;
  },

  toggleEmptyBoardState: function(boardExists) {
    this.getElement('contentWrapper').removeClass('is-loading');
    this.getElement('contentWrapper').toggleClass('board-not-found', boardExists);
    return this;
  },

  renderAccount: function(account) {
    this.getElement('currentAccount').html(
      this.renderTemplate(this.currentAccountTemplate, account.attributes)
    );

    return this;
  },

  renderHeader: function(account) {
    this.renderAccount(account);
    this.showRegion('userDropdown');
    return this;
  }
});
