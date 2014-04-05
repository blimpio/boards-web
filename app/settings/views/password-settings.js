module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'password-settings form-horizontal',

  template: require('settings/templates/password-settings'),

  model: function() {
    return App.User;
  }
});

