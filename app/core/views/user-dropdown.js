module.exports = Zeppelin.ModelView.extend({
  className: function() {
    var className = 'user-dropdown';
    className += this.model.isSignedIn() ? ' signed-in' : ' signed-out';
    return className;
  },

  template: require('core/templates/user-dropdown'),

  model: function() {
    return App.User;
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      name: this.model.getFullName(),
      isSignedIn: this.model.isSignedIn()
    });
  }
});

