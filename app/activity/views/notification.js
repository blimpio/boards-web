module.exports = Zeppelin.ModelView.extend({
  tagName: 'li',

  className: 'notification',

  template: function(context) {
    var type = this.model.getType().replace(':', '-'),
        template = require('activity/templates/' + type + '-notification');

    return template(context);
  },

  context: function() {
    return this.model.getData();
  }
});

