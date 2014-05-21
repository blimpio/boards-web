module.exports = Zeppelin.Collection.extend({
  model: require('core/models/collaborator'),

  comparator: function(collaborator) {
    return collaborator.get('date_created');
  },

  setCurrent: function(id) {
    this.current = this.find(function(collaborator) {
      return collaborator.get('user') === id;
    });

    return this;
  },

  getCollaboratorData: function(id) {
    var collaborator = this.find(function(collaborator) {
      return collaborator.get('user') === id;
    });

    return collaborator ? collaborator.get('user_data') : {};
  },

  invite: function(collaborators) {
    var _collaborators = this.add(collaborators);

    return $.post(this.url, JSON.stringify(collaborators), _.bind(function(response) {
      _.forEach(response, function(collaborator) {
        var model;

        if (collaborator.user) {
          model = _.find(_collaborators, function(_collaborator) {
            return _collaborator.get('user') === collaborator.user;
          });
        } else {
          model = _.find(_collaborators, function(_collaborator) {
            return _collaborator.get('user_data').email === collaborator.user_data.email;
          });
        }

        if (model) {
          model.set(collaborator, {silent: true});
          model.trigger('sync', model, collaborator);
        }
      });
    }, this));
  }
});
