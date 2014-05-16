module.exports = Zeppelin.ModelView.extend({
  tagName: 'li',

  className: function() {
    var className = 'comment clearfix';
    if (this.model.isMine()) className += ' is-mine';
    return className;
  },

  events: {
    'click [data-action=delete]': 'delete'
  },

  template: require('account/templates/comment'),

  context: function() {
    return _.extend({}, this.model.attributes, {
      time: $.timeago(this.model.get('date_created')),
      isMine: this.model.isMine()
    })
  },

  delete: function() {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      this.model.destroy();
    }
  }
});

