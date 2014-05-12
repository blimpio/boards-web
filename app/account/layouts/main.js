module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: function(context) {
    var template = this.options.comesFromAccountPage
      ? require('account/templates/layout-content')
      : require('account/templates/layout');

    return template(context);
  },

  regions: {
    boardsList: require('account/regions/boards-list'),
    createBoardForm: require('account/regions/create-board')
  },

  events: {
    'click [data-action=toggleSidebar]': 'toggleBoardsFullWitdhState',
    'click [data-action=createFirstBoard]': 'onCreateFirstBoardClick'
  },

  elements: {
    page: 'div.account-page',
    content: 'div.account-page-content',
    contentWrapper: 'div.account-page-content-wrapper'
  },

  render: function() {
    if (this.options.comesFromAccountPage) {
      this.getElement('content')
        .addClass('is-loading')
        .html(this.renderTemplate(this.template));
    } else {
      Z.Layout.prototype.render.apply(this, arguments);
    }

    return this;
  },

  toggleLoadingMainState: function() {
    this.getElement('contentWrapper').removeClass('is-empty');
    this.getElement('page').toggleClass('is-loading');
    return this;
  },

  toggleLoadingContentState: function() {
    this.getElement('contentWrapper')
      .removeClass('is-creating-first-board')
      .toggleClass('is-loading');

    return this;
  },

  toggleEmptyBoardsState: function(hasNoBoards) {
    this.getElement('content').removeClass('is-loading');
    this.getElement('contentWrapper').removeClass('is-loading is-creating-first-board');
    this.getElement('contentWrapper').toggleClass('is-empty', hasNoBoards);
    return this;
  },

  toggleBoardsFullWitdhState: function() {
    this.getElement('contentWrapper').toggleClass('is-full-width');
    this.broadcast('cardsList:layout');
    return this;
  },

  showBoards: function() {
    if (!this.options.comesFromAccountPage) this.toggleLoadingContentState();
    this.showRegion('boardsList');
    this.showRegion('createBoardForm');
    return this;
  },

  onCreateFirstBoardClick: function() {
    this.toggleEmptyBoardsState();
    this.getElement('contentWrapper').addClass('is-creating-first-board');
    this.getRegion('createBoardForm').view.toggleCreateMode();
  }
});
