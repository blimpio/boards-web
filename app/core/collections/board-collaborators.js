var Collaborators = require('core/collections/collaborators');

module.exports = Collaborators.extend({
  url: '/api/boards/collaborators/',

  subscriptions: {
    'boardCollaborators:current': 'respondWithCurrentUserData',
    'boardCollaborators:collaborator': 'respondWithCurrentCollaboratorData'
  },

  respondWithCurrentUserData: function(channel) {
    this.broadcast(channel, this.current ? this.current.get('user_data') : null);
  },

  respondWithCurrentCollaboratorData: function(channel, id) {
    this.broadcast(channel, this.getCollaboratorData(id));
  }
});
