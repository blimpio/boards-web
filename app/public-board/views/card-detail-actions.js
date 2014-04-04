var CardDetailActions = require('account/views/card-detail-actions');

module.exports = CardDetailActions.extend({
  template: function(context) {
    var type = this.model.get('type'),
        template = require('public-board/templates/' + type + '-detail-actions');

    return template(context);
  },

  events: {
    'click [data-action=back]': 'onClickBack',
    'click [data-action=download]': 'download'
  }
});

