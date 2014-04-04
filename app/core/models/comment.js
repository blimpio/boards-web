module.exports = Zeppelin.Model.extend({
  defaults: function() {
    var creatorId;

    this.request('user:id', function(id) {
      creatorId = id;
    });

    return {
      created_by: creatorId,
      date_created: _.now()
    }
  },

  localAttributes: ['card', 'creator'],

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
