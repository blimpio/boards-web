module.exports = Zeppelin.View.extend({
  name: 'AccountsController',

  template: require('templates/accounts-main'),

  initialize: function() {
    document.title = 'Blimp | Accounts';
    this.insert('#application').initChildren();
    return this;
  },

  initChildren: function() {
    this.addChild(_.createView('accounts-list'), 'accounts').render();
    return this;
  }
});
