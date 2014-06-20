FileDetail = require('account/views/file-detail');

module.exports = FileDetail.extend({
  attributes: {
    'data-type': 'link'
  },

  template: require('account/templates/link-detail')
});
