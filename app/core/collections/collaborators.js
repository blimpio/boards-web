module.exports = Zeppelin.Collection.extend({
  url: '/api/boards/collaborators/',

  model: require('core/models/collaborator'),

  subscriptions: {
    'collaborators:collaborator': 'respondWithCollaborator'
  },

  respondWithCollaborator: function(id, channel) {
    this.broadcast(channel, this.getCollaborator(id));
  },

  getCollaborator: function(id) {
    return this.find(function(collaborator) {
      return collaborator.hasAccount() && collaborator.get('user').id === id;
    });
  },

  getCollaborators: function(ids) {
    var collaborators = [];

    _.forEach(ids, function(id) {
      collaborators.push(this.getCollaborator(id));
    }, this);

    return _.compact(collaborators);
  },

  invite: function(collaborators) {
    $.post(this.url, JSON.stringify(collaborators)).done(_.bind(function(response) {
      this.add(response);
    }, this));
  }
});
