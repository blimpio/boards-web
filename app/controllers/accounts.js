module.exports = Zeppelin.View.extend({
  name: 'AccountsController',

  template: require('templates/accounts'),

  initialize: function() {
    document.title = 'Blimp | Accounts';
    this.insert('#application').initList();
    return this;
  },

  initList: function() {
    return this.addChild(require('views/accounts-list'), {
      collection: _.getCollection('Accounts')
    }, 'accounts').render();
  }
});
