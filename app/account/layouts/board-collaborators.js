module.exports = Z.Layout.extend({
  el: 'div.board-collaborators',

  keepEl: true,

  template: require('account/templates/board-collaborators-layout'),

  regions: {
    inviteForm: require('account/regions/board-collaborators-invite'),
    collaborators: require('account/regions/board-collaborators')
  },

  events: {
    'click [data-action=hide]': 'hide',
    'shown.bs.modal #board-collaborators-modal': 'onShown',
    'hidden.bs.modal #board-collaborators-modal': 'onHidden',
    'click [data-action=submitCollaboratorsModal]': 'submit'
  },

  elements: {
    modal: 'div#board-collaborators-modal',
    alert: 'div.ui-modal-alert'
  },

  autocompleteRegex: /\/api\/v[0-9]\/autocomplete\/users\//,

  initialize: function() {
    _.bindAll(this, ['onShown', 'onHidden', 'onAjaxSuccess', 'onAjaxError']);
  },

  submit: function() {
    this.getRegion('toggleForm').view.submit();

    this.once('ajax:error', function() {
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
    $(document).on('ajaxError.collaborators', this.onAjaxError);
    $(document).on('ajaxSuccess.collaborators', this.onAjaxSuccess);
  },

  stopListeningToAjax: function() {
    $(document).off('ajaxError.collaborators');
    $(document).off('ajaxSuccess.collaborators');
  },

  showSettings: function(board) {
    this.getRegion('inviteForm').showForm({
      board: board.id
    });

    if (!this.getRegion('collaborators').isShown()) {
      this.getRegion('collaborators').show();
    }
  },

  onShown: function() {
    this.listenToAjax();
  },

  onHidden: function() {
    this.stopListeningToAjax();
    this.off('ajax:success ajax:error');
    this.getRegion('inviteForm').view.reset();
  },

  onAjaxSuccess: function(event, xhr, settings) {
    var $alert;

    if (settings.url.match(this.autocompleteRegex)) return;

    $alert = this.getElement('alert');
    $alert.text('Changes saved.').show();

    _.delay(function() {
      $alert.hide();
    }, 1500);

    this.trigger('ajax:success');
  },

  onAjaxError: function(event, xhr, settings) {
    var $alert;

    if (settings.url.match(this.autocompleteRegex)) return;

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
