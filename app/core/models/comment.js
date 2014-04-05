module.exports = Zeppelin.Model.extend({
  defaults: function() {
    return {
      created_by: App.User.id,
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
