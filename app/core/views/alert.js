module.exports = Zeppelin.View.extend({
  className: 'app-alert alert alert-info',

  template: require('core/templates/alert'),

  elements: {
    close: 'button.close',
    message: 'span.app-alert-message'
  },

  events: {
    'click button.close': 'close'
  },

  open: function(message) {
    if (message) {
      this.getElement('message').text(message);
      this.$el.show();
    }
  },

  close: function() {
    this.$el.hide();
    this.getElement('message').text('');
  }
});

