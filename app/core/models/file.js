var Card = require('core/models/card');

module.exports = Card.extend({
  defaults: function() {
    return _.extend({
      type: 'file',
      is_uploading: false,
      upload_progress: 0
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

  hasNoPreview: function() {
    return !this.get('thumbnail_sm_path') &&
    !this.get('thumbnail_md_path') &&
    !this.get('thumbnail_lg_path');
  },

  getSmallPreview: function() {
    return this.get('thumbnail_sm_path') ||
    'http://gravatar.com/avatar/' + md5(this.get('name')) + '?d=retro&s=225';
  },

  getLargePreview: function() {
    return this.get('thumbnail_lg_path') ||
    'http://gravatar.com/avatar/' + md5(this.get('name')) + '?d=retro&s=225';
  }
});
