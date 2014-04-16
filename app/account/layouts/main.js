module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('account/templates/layout'),

  regions: {
    boardsList: require('account/regions/boards-list'),
    userDropdown: require('core/regions/user-dropdown'),
    createBoardForm: require('account/regions/create-board'),
    accountsDropdown: require('core/regions/accounts-dropdown')
  },

  events: {
    'click [data-action=toggleSidebar]': 'toggleBoardsFullWitdhState',
    'click [data-action=createFirstBoard]': 'onCreateFirstBoardClick'
  },

  elements: {
    page: '#account-page',
    content: '#account-page-content',
    contentWrapper: '#account-page-content-wrapper'
  },

  toggleLoadingMainState: function() {
    this.getElement('contentWrapper').removeClass('is-empty');
    this.getElement('page').toggleClass('is-loading');
    return this;
  },

  toggleLoadingContentState: function() {
    this.getElement('contentWrapper').toggleClass('is-loading');
    return this;
  },

  toggleEmptyBoardsState: function(hasNoBoards) {
    this.getElement('content').removeClass('is-loading');
    this.getElement('contentWrapper').removeClass('is-loading');
    this.getElement('contentWrapper').toggleClass('is-empty', hasNoBoards);
    return this;
  },

  toggleBoardsFullWitdhState: function() {
    this.getElement('contentWrapper').toggleClass('is-full-width');
    this.broadcast('cardsList:layout');
    return this;
  },

  showHeader: function() {
    this.toggleLoadingMainState();
    this.showRegion('userDropdown');
    this.showRegion('accountsDropdown');
    return this;
  },

  showBoards: function() {
    this.toggleLoadingContentState();
    this.showRegion('boardsList');
    this.showRegion('createBoardForm');
    return this;
  },

  onCreateFirstBoardClick: function() {
    this.toggleEmptyBoardsState();
    this.getRegion('createBoardForm').view.toggleCreateMode();
  }
});
