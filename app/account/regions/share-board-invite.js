module.exports = Z.Region.extend({
  el: 'div.share-board-invite',

  showForm: function(options) {
    this.setView(require('account/views/invite-collaborators-form'), options).show();
    return this;
  }
});
