var File = require('core/models/file');

module.exports = File.extend({
  defaults: function() {
    return _.extend(File.prototype.defaults(), {
      type: 'link'
    });
  },

  validations: _.extend({}, File.prototype.validations, {
    content: function(content) {
      if (!content) {
        return 'Every card requires some type of content.';
      } else if (!Z.Validations.isUrl(content)) {
        return 'Please provide a valid url.';
      }
    }
  }),

  getExtension: function() {
    return _.last(this.get('content').split('.')).replace(/\/.+|\//, '');
  }
});
