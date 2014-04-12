module.exports = Z.Layout.extend({
  el: '#share-board',

  keepEl: true,

  template: require('account/templates/share-board-layout'),

  regions: {
    toggleForm: require('account/regions/share-board-toggle'),
    inviteForm: require('account/regions/share-board-invite'),
    collaborators: require('account/regions/share-board-collaborators')
  },

  events: {
    'click [data-action=hide]': 'hide',
    'shown.bs.modal #share-board-modal': 'onShown',
    'hidden.bs.modal #share-board-modal': 'onHidden'
  },

  elements: {
    modal: 'div#share-board-modal',
    alert: 'div.ui-modal-alert'
  },

  initialize: function() {
    _.bindAll(this, ['onShown', 'onHidden', 'onAjaxSuccess', 'onAjaxError']);
  },

  hide: function() {
    this.getElement('modal').modal('hide');
    return this;
  },

  listenToAjax: function() {
    $(document).ajaxError(this.onAjaxError);
    $(document).ajaxSuccess(this.onAjaxSuccess);
  },

  stopListeningToAjax: function() {
    $(document).off('ajaxError');
    $(document).off('ajaxSuccess');
  },

  showSettings: function(board) {
    this.getRegion('toggleForm').showForm({
      model: board
    });

    this.getRegion('inviteForm').showForm({
      board: board.id
    });

    if (!this.getRegion('collaborators').isShown()) {
      this.getRegion('collaborators').show();
    }
  },

  onShown: function() {
    this.listenToAjax();
    this.getRegion('toggleForm').view.focusOnShareUrl();
  },

  onHidden: function() {
    this.stopListeningToAjax();
    this.getRegion('inviteForm').view.reset();
  },

  onAjaxSuccess: function() {
    var $alert = this.getElement('alert');

    $alert.text('Changes saved.').show();

    _.delay(function() {
      $alert.hide();
    }, 1500);
  },

  onAjaxError: function() {
    var $alert = this.getElement('alert');

    $alert.text('Something went wrong. Please try again.').show();

    _.delay(function() {
      $alert.hide();
    }, 1500);
  },

  onUnplug: function() {
    this.stopListeningToAjax();
  }
});
