module.exports = Z.Region.extend({
  el: 'div.create-note-container',

  showModal: function(options) {
    this.setView(require('account/views/create-note'), options).show();
    return this;
  }
});
