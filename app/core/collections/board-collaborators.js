var Collaborators = require('core/collections/collaborators');

module.exports = Collaborators.extend({
  url: App.API_URL + '/boards/collaborators/',

  subscriptions: {
    'boardCollaborators:current': 'respondWithCurrentUserData',
    'collaborator:info': 'respondWithCurrentCollaboratorData'
  },

  setUrl: function(id) {
    this.url = App.API_URL + '/boards/' + id + '/collaborators/';
    return this;
  },

  respondWithCurrentUserData: function(channel) {
    this.broadcast(channel, this.current ? this.current.get('user_data') : null);
  },

  respondWithCurrentCollaboratorData: function(channel, id) {
    this.broadcast(channel, this.getCollaboratorData(id));
  }
});
