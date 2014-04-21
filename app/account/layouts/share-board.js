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
    'hidden.bs.modal #share-board-modal': 'onHidden',
    'click [data-action=submitShareModal]': 'submit'
  },

  elements: {
    modal: 'div#share-board-modal',
    alert: 'div.ui-modal-alert',
    footer: 'div.modal-footer',
    doneBtn: '[data-action=submitShareModal]'
  },

  subscriptions: {
    'inviteCollaborators:actions:hidden': 'showFooter',
    'inviteCollaborators:actions:visible': 'hideFooter'
  },

  initialize: function() {
    _.bindAll(this, ['onShown', 'onHidden', 'onAjaxSuccess', 'onAjaxError']);
  },

  submit: function() {
    this.getElement('doneBtn').text('Saving changes...');
    this.getRegion('toggleForm').view.submit();

    this.once('ajax:error', function() {
      this.getElement('doneBtn').text('Done');
      this.off('ajax:success');
    }, this);

    this.once('ajax:success', this.hide, this);

    return this;
  },

  hide: function() {
    this.getElement('modal').modal('hide');
    return this;
  },

  listenToAjax: function() {
    $(document).on('ajaxError.share', this.onAjaxError);
    $(document).on('ajaxSuccess.share', this.onAjaxSuccess);
  },

  stopListeningToAjax: function() {
    $(document).off('ajaxError.share');
    $(document).off('ajaxSuccess.share');
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

  showFooter: function() {
    this.getElement('footer').show();
    return this;
  },

  hideFooter: function() {
    this.getElement('footer').hide();
    return this;
  },

  onShown: function() {
    this.listenToAjax();
  },

  onHidden: function() {
    this.stopListeningToAjax();
    this.off('ajax:success ajax:error');
    this.getRegion('toggleForm').view.reset();
    this.getRegion('inviteForm').view.reset();
    this.showFooter();
    this.getElement('doneBtn').text('Done');
  },

  onAjaxSuccess: function(event, xhr, settings) {
    var $alert;

    if (settings.url.match(/\/api\/autocomplete\/users\//)) return false;

    $alert = this.getElement('alert');
    $alert.text('Changes saved.').show();

    _.delay(function() {
      $alert.hide();
    }, 1500);

    this.trigger('ajax:success');
  },

  onAjaxError: function(event, xhr, settings) {
    var $alert;

    if (settings.url.match(/\/api\/autocomplete\/users\//)) return false;

    $alert = this.getElement('alert');
    $alert.text('Something went wrong. Please try again.').show();

    _.delay(function() {
      $alert.hide();
    }, 1500);

    this.trigger('ajax:error');
  },

  onUnplug: function() {
    this.stopListeningToAjax();
  }
});
