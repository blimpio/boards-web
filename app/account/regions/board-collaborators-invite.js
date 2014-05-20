module.exports = Z.Region.extend({
  el: 'div.board-collaborators-invite',

  showForm: function(options) {
    this.setView(require('account/views/invite-collaborators-form'), options).show();
    return this;
  }
});
