module.exports = Zeppelin.Model.extend({
  defaults: function() {
    var author;

    this.request('boardCollaborators:current', function(collaborator) {
      author = collaborator;
    });

    return author ? {
      author: author,
      created_by: author.id,
      modified_by: author.id,
      date_created: _.now()
    } : {
      created_by: App.User.id,
      modified_by: App.User.id,
      date_created: _.now()
    };
  },

  localAttributes: ['card', 'author'],

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
  },

  initialize: function() {
    if (!this.isNew()) {
      this.request('boardCollaborators:collaborator', this.get('created_by'), function(author) {
        this.set('author', author);
      });
    }
  },
});
