module.exports = Z.Region.extend({
  el: '#create-note-container',

  showModal: function(options) {
    this.setView(require('account/views/create-note'), options).show();
    return this;
  }
});
