module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'account-settings form-horizontal',

  template: require('settings/templates/account-settings'),

  model: function() {
    return App.Accounts.current
  }
});

