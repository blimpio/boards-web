module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'advanced-settings form-horizontal',

  template: require('settings/templates/advanced-settings'),

  model: function() {
    return App.User;
  }
});

