var Card = require('account/views/card');

module.exports = Card.extend({
  attributes: function() {
    return {
      'title': this.model.get('name'),
      'data-type': 'file'
    };
  },

  className: function() {
    var className = Card.prototype.className.apply(this, arguments);
    if (this.model.get('is_uploading')) className += ' is-uploading';
    return className;
  },

  template: require('account/templates/file'),

  elements: {
    uploadProgress: 'div.card-upload-progress'
  },

  bindings: function() {
    return _.merge({
      model: {
        'change:is_uploading': 'onUploadingStateChange',
        'change:upload_progress': 'onUploadProgress'
      }
    }, Card.prototype.bindings);
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      preview: this.model.getSmallPreview(),
      extension: this.model.getExtension(),
      hasNoPreview: this.model.hasNoPreview()
    });
  },

  onUploadingStateChange: function(file, isUploading) {
    this.$el.toggleClass('is-uploading', isUploading);
  },

  onUploadProgress: function(file, progress) {
    this.getElement('uploadProgress').text(progress + '%');
  }
});
