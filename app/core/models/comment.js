module.exports = Zeppelin.Model.extend({
  defaults: function() {
    return {
      created_by: {
        id: App.User.id,
        username: App.User.get('username'),
        gravatar_url: App.User.get('gravatar_url')
      },
      modified_by: {
        id: App.User.id,
        username: App.User.get('username'),
        gravatar_url: App.User.get('gravatar_url')
      },
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

  isMine: function() {
    return this.get('created_by').id === App.User.id;
  }
});
