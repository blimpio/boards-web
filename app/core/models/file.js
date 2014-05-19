var Card = require('core/models/card');

module.exports = Card.extend({
  defaults: function() {
    return _.extend({
      type: 'file',
      is_uploading: false,
      upload_progress: 0,
      thumbnail_sm_path: null,
      thumbnail_md_path: null,
      thumbnail_lg_path: null
    }, Card.prototype.defaults);
  },

  localAttributes: function() {
    return _.union(
      ['is_uploading', 'upload_progress'], Card.prototype.localAttributes
    );
  },

  getExtension: function() {
    return _.last(this.get('mime_type').split('/')) ||
    _.last(this.get('name').split('.'));
  },

  hasPreview: function() {
    return this.get('thumbnail_sm_path') !== null &&
    this.get('thumbnail_md_path') !== null &&
    this.get('thumbnail_lg_path') !== null;
  },

  getSmallPreview: function() {
    return this.get('thumbnail_sm_path');
  },

  getMediumPreview: function() {
    return this.get('thumbnail_md_path');
  },

  getLargePreview: function() {
    return this.get('thumbnail_lg_path');
  },

  getPreview: function() {
    return this.get('featured')
      ? this.getMediumPreview()
      : this.getSmallPreview();
  },

  previewIsDataUrl: function() {
    var preview = this.getPreview();
    return preview && (/data:image\//).test(preview);
  }
});
