module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'user-settings form-horizontal',

  template: require('settings/templates/user-settings'),

  model: function() {
    return App.User;
  }
});

