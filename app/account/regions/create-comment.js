module.exports = Z.Region.extend({
  el: '#create-comment-container',

  showForm: function(options) {
    this.setView(require('account/views/create-comment'), options).show();
    return this;
  }
});
