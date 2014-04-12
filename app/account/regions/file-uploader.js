module.exports = Z.Region.extend({
  el: '#file-uploader',

  showUploader: function(options) {
    this.setView(require('account/views/file-uploader'), options).show();
    return this;
  },

  enable: function() {
    this.view.enable();
  },

  disable: function() {
    this.view.disable();
  }
});
