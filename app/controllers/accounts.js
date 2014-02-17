module.exports = Zeppelin.View.extend({
  name: 'AccountsController',

  template: require('templates/accounts'),

  initialize: function() {
    document.title = 'Blimp | Accounts';
    this.insert('#application').initList();
  },

  initList: function() {
    return this.addChild(require('views/accounts-list'), {
      model: _.getModel('User')
    }, 'accounts').render();
  }
});
