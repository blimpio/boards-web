module.exports = Zeppelin.Collection.extend({
  url: '/api/boards/collaborators/',

  model: require('core/models/person'),

  subscriptions: {
    'collaborators:collaborator': 'respondWithCollaborator'
  },

  respondWithCollaborator: function(id, channel) {
    this.broadcast(channel, this.getCollaborator(id));
  },

  getCollaborator: function(id) {
    var user = this.find(function(collaborator) {
      return collaborator.has('user') && collaborator.get('user').id === id;
    });

    return user ? this._prepareModel(user.get('user')) : user;
  },

  getCollaborators: function(ids) {
    var collaborators = [];

    _.forEach(ids, function(id) {
      collaborators.push(this.getCollaborator(id));
    }, this);

    return _.compact(collaborators);
  }
});
