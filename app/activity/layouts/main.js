module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: function(context) {
    var template = this.options.comesFromAccountPage
      ? require('activity/templates/layout-content')
      : require('activity/templates/layout');

    return template(context);
  },

  regions: {
    boardsList: require('activity/regions/boards-list')
  },

  events: {
    'click [data-action=toggleSidebar]': 'toggleBoardsFullWitdhState',
    'click [data-action=showAllActivity]': 'onAllActivityClicked'
  },

  elements: {
    page: 'div.account-page',
    content: 'div.account-page-content',
    sidebarActions: 'div.account-page-sidebar-actions',
    contentWrapper: 'div.account-page-content-wrapper',
    allActivityBtnWrapper: 'div.all-activity-btn'
  },

  subscriptions: {
    'board:clicked': 'onBoardClicked'
  },

  render: function() {
    if (this.options.comesFromAccountPage) {
      this.getElement('content')
        .html(this.renderTemplate(this.template))
        .addClass('is-loading');

      this.getElement('sidebarActions')
        .html(this.renderTemplate(require('activity/templates/all-activity-btn')))

      this.addElement('allActivityBtnWrapper', 'div.all-activity-btn');

      this.$el.find('div.account-page').addClass('activity-page');
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

  showBoards: function() {
    if (!this.options.comesFromAccountPage) this.toggleLoadingContentState();
    this.showRegion('boardsList');
    return this;
  },

  selectAllActivity: function() {
    this.$('li.board').removeClass('is-selected');
    this.getElement('allActivityBtnWrapper').addClass('is-selected');
  },

  onBoardClicked: function() {
    this.getElement('allActivityBtnWrapper').removeClass('is-selected');
  },

  onAllActivityClicked: function(event) {
    event.preventDefault();
    this.selectAllActivity();
    this.broadcast('allActivity:clicked');
  }
});
