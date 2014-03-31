var CreateNote = require('account/views/create-note'),
    FileUploader = require('account/views/file-uploader');

module.exports = Z.Layout.extend({
  el: '#application',

  keepEl: true,

  template: require('account/templates/layout'),

  regions: {
    createNote: require('account/regions/create-note'),
    boardsList: require('account/regions/boards-list'),
    fileUploader: require('account/regions/file-uploader'),
    createBoardForm: require('account/regions/create-board'),
    accountsDropdown: require('core/regions/accounts-dropdown')
  },

  events: {
    'click [data-action=toggleSidebar]': 'toggleBoardsFullWitdhState',
    'click [data-action=createFirstBoard]': 'onCreateFirstBoardClick'
  },

  elements: {
    accountPage: 'div.account-page',
    contentWrapper: 'div.content-wrapper'
  },

  toggleLoadingMainState: function() {
    this.getElement('accountPage').toggleClass('is-loading');
    return this;
  },

  toggleLoadingBoardsState: function() {
    this.getElement('contentWrapper').toggleClass('is-loading');
    return this;
  },

  toggleEmptyBoardsState: function(hasBoards) {
    this.getElement('contentWrapper').removeClass('is-loading');
    this.getElement('contentWrapper').toggleClass('has-no-boards', hasBoards);
    return this;
  },

  toggleBoardsFullWitdhState: function() {
    this.getElement('contentWrapper').toggleClass('boards-full-width');
    this.broadcast('cardsList:layout');
    return this;
  },

  showHeader: function() {
    this.toggleLoadingMainState();
    this.showRegion('accountsDropdown');
    return this;
  },

  showBoards: function() {
    this.showRegion('boardsList');
    this.showRegion('createBoardForm');
  },

  onCreateFirstBoardClick: function() {
    this.toggleEmptyBoardsState();
    this.getRegion('createBoardForm').view.toggleCreateMode();
  },

  showFileUploader: function(board) {
    this.getRegion('fileUploader').setView(FileUploader, {
      board: board
    }).show();
  },

  enableFileUploader: function() {
    this.getRegion('fileUploader').view.enable();
  },

  disableFileUploader: function() {
    this.getRegion('fileUploader').view.disable();
  },

  showCreateNoteModal: function(board) {
    this.getRegion('createNote').setView(CreateNote, {
      board: board
    }).show();
  },
});
