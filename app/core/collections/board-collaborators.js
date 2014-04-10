var Collaborators = require('core/collections/collaborators');

module.exports = Collaborators.extend({
  url: '/api/boards/collaborators/',

  subscriptions: {
    'boardCollaborators:collaborators': 'respondWithCollaborators'
  },

  respondWithCollaborators: function(channel) {
    this.broadcast(channel, this.toJSON());
  }
});
