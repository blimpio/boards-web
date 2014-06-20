var File = require('core/models/file');

module.exports = File.extend({
  defaults: function() {
    return _.extend(File.prototype.defaults(), {
      type: 'link'
    });
  },

  getExtension: function() {
    return _.last(this.get('content').split('.')).replace(/\/.+|\//, '');
  }
});
