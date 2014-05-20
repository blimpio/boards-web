module.exports = Z.Region.extend({
  el: 'div.share-board-toggle',

  showForm: function(options) {
    this.setView(require('account/views/share-board-toggle'), options).show();
    return this;
  },

  focus: function() {
    this.view.focusOnShareUrl();
    return this;
  }
});
