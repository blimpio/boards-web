module.exports = Z.Region.extend({
  el: 'div.invitation-container',

  show: function(options) {
    var InvitationView = require('core/views/invitation');
    this.setView(InvitationView, options);
    Z.Region.prototype.show.call(this);
  }
});
