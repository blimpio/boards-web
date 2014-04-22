module.exports = Z.Region.extend({
  el: '#public-comments-container',

  showComments: function(options) {
    this.setView(require('account/views/public-comments'), options).show();
    return this;
  },
});
