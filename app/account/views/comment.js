module.exports = Zeppelin.ModelView.extend({
  tagName: 'li',

  className: 'comment clearfix',

  template: require('account/templates/comment'),

  context: function() {
    return _.extend({}, this.model.attributes, {
      time: $.timeago(this.model.get('date_created'))
    })
  }
});

