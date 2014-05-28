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
    var url = App.API_URL + '/comments/' + this.id + '/',
        newUrl = App.API_URL + '/cards/' + this.get('card') + '/comments/';

    return this.isNew() ? newUrl : url;
  },

  initialize: function() {
    if (!this.isNew()) {
      this.request('collaborator:info', this.get('created_by'), function(info) {
        this.set('author', info);
      });
    }
  },

  isMine: function() {
    return this.get('created_by') === App.User.id;
  }
});
