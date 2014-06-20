module.exports = Z.Region.extend({
  el: 'div.create-link-container',

  showModal: function(options) {
    this.setView(require('account/views/create-link'), options).show();
    return this;
  }
});
