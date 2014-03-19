module.exports = Zeppelin.Model.extend({
  name: 'Comment',

  defaults: {
    date_created: _.now()
  },

  presenters: ['content', 'date_created'],

  localAttributes: ['card'],

  validations: {
    content: {
      isEmpty: false,
      message: 'Comments can\'t be left blank.'
    }
  },

  url: function() {
    var url = '/api/comments/' + this.id + '/',
        newUrl = '/api/cards/' + this.get('card') + '/comments/';

    return this.isNew() ? newUrl : url;
  }
});
