module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'notifications-settings form-horizontal',

  template: require('settings/templates/notifications-settings'),

  model: function() {
    return App.User;
  }

});

