module.exports = Zeppelin.CompositeView.extend({
  className: 'sharing-settings',

  template: require('account/templates/sharing-settings'),

  elements: {
    sharingSetting: 'div.sharing-setting'
  },

  events: {
    'click [data-action=submit]': 'submit'
  },

  initialize: function() {
    this.$modal = $('#sharingModal');

    _.bindAll(this, ['onHide', 'onShow']);

    this.$modal.on('shown.bs.modal', this.onShow);
    this.$modal.on('hidden.bs.modal', this.onHide);
  },

  onRender: function() {
    this.addViews({
      form: {
        view: require('account/views/board-sharing-settings'),
        options: {
          model: this.options.board
        }
      }
    });

    this.getElement('sharingSetting').html(this.getView('form').render().el);
  },

  submit: function() {
    this.getView('form').submit();
    this.$modal.modal('hide');
  },

  resetForm: function() {
    this.getView('form').reset();
  },

  focusForm: function() {
    this.getView('form').focusOnShareUrl();
  },

  onShow: function() {
    this.focusForm();
  },

  onHide: function() {
    this.resetForm();
  },

  onUnplug: function() {
    this.$modal.off('shown.bs.modal', this.onShow);
    this.$modal.off('hidden.bs.modal', this.onHide);
  }
});

